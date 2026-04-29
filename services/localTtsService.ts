import * as ort from 'onnxruntime-web';

// ONNX Runtime configuration for WASM
if (typeof window !== 'undefined') {
    // For 110% offline, the user should download these .wasm files to /public/wasm/
    // and change this path to '/wasm/' 
    ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.3/dist/';
}

let session: ort.InferenceSession | null = null;
let modelConfig: any = null;
let tokens: Map<string, number> = new Map();

export interface TtsModelData {
    modelUrl: string;
    configUrl: string;
    tokensUrl?: string;
}

/**
 * Normalizes text and converts to phonemes/ids.
 * Piper usually requires espeak-ng, but for a "lite" implementation 
 * we can use a character-based map if the model supports it or 
 * provide a hook for a WASM phonemizer.
 */
/**
 * Simplified Spanish Grapheme-to-Phoneme mapping for Piper.
 * This maps common Spanish characters to the phoneme IDs expected by the es_MX model.
 */
function textToIds(text: string, config: any): number[] {
    const idMap = config.phoneme_id_map || {};
    const ids: number[] = [0]; // Start with PAD
    
    const lowerText = text.toLowerCase()
        .replace(/j/g, 'x')
        .replace(/ñ/g, 'ɲ')
        .replace(/ch/g, 'tʃ')
        .replace(/ll/g, 'ʝ')
        .replace(/rr/g, 'r');

    // Basic character to IPA mapping for Spanish
    const charToIpa: Record<string, string> = {
        'a': 'a', 'b': 'b', 'c': 'k', 'd': 'd', 'e': 'e', 'f': 'f', 'g': 'g', 'h': '', 
        'i': 'i', 'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n', 'o': 'o', 'p': 'p', 'q': 'k',
        'r': 'ɾ', 's': 's', 't': 't', 'u': 'u', 'v': 'b', 'w': 'w', 'x': 'ks', 'y': 'ʝ', 'z': 's',
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ü': 'u',
        ' ': ' ', ',': ',', '.': '.', '!': '!', '?': '?'
    };

    for (const char of lowerText) {
        const ipa = charToIpa[char] || char;
        for (const phoneme of ipa) {
            const idArray = idMap[phoneme];
            if (idArray && idArray.length > 0) {
                ids.push(idArray[0]);
                ids.push(0); // Interleave with PAD (standard for VITS/Piper)
            }
        }
    }

    ids.push(0); // End with PAD
    return ids;
}

export async function initLocalTts(modelData: TtsModelData) {
    if (session) return;

    try {
        console.log("Initializing Offline TTS (Piper Claude-high)...");
        const cache = await caches.open('tts-offline-cache-v4');

        // 1. Load Config
        const configRef = await getResource(modelData.configUrl, cache);
        modelConfig = await configRef.json();

        // 2. Load Model
        const modelRef = await getResource(modelData.modelUrl, cache);
        const modelBuffer = await modelRef.arrayBuffer();

        // 3. Create Inference Session with WASM
        // Note: Using 'wasm' provider is essential for browser compatibility
        session = await ort.InferenceSession.create(modelBuffer, {
            executionProviders: ['wasm'],
            graphOptimizationLevel: 'all'
        });

        console.log("✅ Offline TTS Ready and Cached.");
    } catch (error) {
        console.error("❌ Failed to initialize offline TTS:", error);
        throw error;
    }
}

async function getResource(url: string, cache: Cache): Promise<Response> {
    let response = await cache.match(url);
    if (!response) {
        console.log(`📥 Downloading ${url} for offline use...`);
        response = await fetch(url);
        
        const contentType = response.headers.get('content-type');
        if (!response.ok || (contentType && contentType.includes('text/html'))) {
            throw new Error(`Failed to fetch ${url} (got HTML or bad status: ${response.status})`);
        }
        
        await cache.put(url, response.clone());
    } else {
        console.log(`📦 Using cached version of ${url}`);
    }
    return response;
}

export async function synthesizeLocal(text: string, audioCtx: AudioContext): Promise<AudioBuffer | null> {
    if (!session || !modelConfig) {
        console.warn("TTS session not ready.");
        return null;
    }

    try {
        const phonemeIds = textToIds(text, modelConfig);
        console.log(`Synthesizing with local model: "${text}"`);
        
        const inputIds = new BigInt64Array(phonemeIds.map(BigInt));
        const inputLengths = new BigInt64Array([BigInt(phonemeIds.length)]);
        
        const noiseScale = Number(import.meta.env.VITE_TTS_NOISE_SCALE || 0.667);
        const lengthScale = Number(import.meta.env.VITE_TTS_LENGTH_SCALE || 1.0);
        const noiseW = Number(import.meta.env.VITE_TTS_NOISE_W || 0.8);
        const scales = new Float32Array([noiseScale, lengthScale, noiseW]);

        const feeds: Record<string, ort.Tensor> = {
            'input': new ort.Tensor('int64', inputIds, [1, phonemeIds.length]),
            'input_lengths': new ort.Tensor('int64', inputLengths, [1]),
            'scales': new ort.Tensor('float32', scales, [3])
        };

        // Some Piper models require sid (speaker id) even if single speaker
        // We check the model metadata or fallback to 0
        if (session.inputNames.includes('sid')) {
            feeds['sid'] = new ort.Tensor('int64', new BigInt64Array([0n]), [1]);
        }

        const results = await session.run(feeds);
        const output = results.output.data as Float32Array;

        if (audioCtx.state === 'suspended') await audioCtx.resume();

        const sampleRate = modelConfig.audio?.sample_rate || 22050;
        const audioBuffer = audioCtx.createBuffer(1, output.length, sampleRate);
        audioBuffer.getChannelData(0).set(output);

        return audioBuffer;
    } catch (error) {
        console.error("Synthesis error:", error);
        return null;
    }
}

export function isLocalTtsReady(): boolean {
    return !!session;
}
