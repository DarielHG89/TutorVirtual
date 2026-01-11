import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type } from "@google/genai";
import type { Question, StudentProfile, GameState, CategoryId, QuestionResult } from "../types";
import { categoryNames } from "../utils/constants";
import { lessons } from "../data/lessons";

// Para una futura integración con una IA de Gemini auto-hospedada,
// se modificaría la inicialización del cliente o se usaría un endpoint de fetch aquí.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstructionQuiz = (profile: StudentProfile) => {
    const genderTerm = profile.gender === 'boy' ? 'un niño' : 'una niña';
    return `Eres 'Maestro Digital', un tutor IA súper divertido, amigable y paciente para ${genderTerm} de ${profile.age} años. Tus respuestas deben ser simples, alentadoras y fáciles de entender. Usa un lenguaje muy sencillo, positivo y creativo, con analogías y ejemplos divertidos. Usa muchos emoticonos relevantes como ✨, 🚀, 🧠, 👍, 💡. Habla siempre en español. Evita caracteres especiales o formato que pueda confundir a un lector de texto a voz.`;
};

const getSystemInstructionLive = (profile: StudentProfile) => {
    const genderTerm = profile.gender === 'boy' ? 'un niño' : 'una niña';
    return `Eres 'Maestro Digital', un tutor de IA amigable, paciente y divertido para ${genderTerm} de ${profile.age} años que se llama ${profile.name}. Tu objetivo es tener una conversación educativa y atractiva. Responde a sus preguntas, explícale cosas de forma sencilla y mantén la conversación. Usa un lenguaje sencillo y positivo. Dirígete a ${profile.name} por su nombre de vez en cuando para que la conversación sea más personal. También puedes dibujar cosas para el niño. Para dibujar algo, debes llamar a la función 'generateImage' con una descripción clara y creativa en inglés de lo que quieres dibujar. Por ejemplo, si el niño te pide 'dibuja un perro astronauta', llama a la función con el prompt 'an astronaut dog'. Habla siempre en español.`;
}

let isApiAvailable = false;

export async function checkGeminiConnection(): Promise<boolean> {
    try {
        // Hacemos una llamada muy ligera para ver si el servicio responde.
        await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "hola",
            config: { thinkingConfig: { thinkingBudget: 0 } }
        });
        isApiAvailable = true;
        console.log("Gemini API connection successful.");
    } catch (error) {
        isApiAvailable = false;
        console.warn("Gemini API connection failed. Falling back to offline mode.", error);
    }
    return isApiAvailable;
}

export async function generateExplanation(question: Question, incorrectAnswer: string, profile: StudentProfile): Promise<string> {
    if (!isApiAvailable) {
        throw new Error("AI service is not available.");
    }
    try {
        const prompt = `La pregunta era: "${question.question}". ${profile.gender === 'boy' ? 'El niño' : 'La niña'} respondió "${incorrectAnswer}", pero la respuesta correcta es "${question.answer}". ¡No pasa nada por equivocarse! Explícale de forma súper positiva, divertida y sencilla por qué la respuesta es "${question.answer}". Usa una analogía o un ejemplo genial para que lo entienda. Anímale a seguir intentándolo. Empieza con algo como "¡Casi! ¡Vamos a ver este pequeño truco! 🕵️‍♂️" o "¡Buena intentona! Así es como lo ven los detectives de las mates: 🧠".`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: getSystemInstructionQuiz(profile),
                temperature: 0.7,
            }
        });
        
        const explanation = response.text;
        if (typeof explanation === 'string' && explanation.trim().length > 0) {
            return explanation;
        } else {
            console.warn("Received empty or invalid explanation from AI.");
            throw new Error("Received empty or invalid explanation from AI.");
        }

    } catch (error) {
        console.error("Error generating AI explanation:", error);
        throw error;
    }
}

export async function generateHint(question: Question, profile: StudentProfile): Promise<string> {
    if (!isApiAvailable) {
        throw new Error("AI service is not available.");
    }
    try {
        const prompt = `La pregunta es: "${question.question}". Dame una pista muy creativa y divertida para un ${profile.gender === 'boy' ? 'niño' : 'ña'} de ${profile.age} años. Usa una analogía o una pequeña historia para explicar el concepto. Por ejemplo, si es una multiplicación, podrías hablar de galaxias de galletas 🌌🍪. ¡Hazlo memorable y nada aburrido! Es crucial y de máxima importancia que, bajo NINGUNA circunstancia, reveles la respuesta final ("${question.answer}") ni números que lleven directamente a ella. NO MUESTRES EL RESULTADO. ENFÓCATE EN EL MÉTODO.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: getSystemInstructionQuiz(profile),
                temperature: 0.8,
            }
        });

        const hint = response.text;
        if (typeof hint === 'string' && hint.trim().length > 0) {
            return hint;
        } else {
            console.warn("Received empty or invalid hint from AI.");
            throw new Error("Received empty or invalid hint from AI.");
        }
    } catch (error) {
        console.error("Error generating AI hint:", error);
        throw error;
    }
}

export async function generateSpeech(text: string): Promise<string> {
    if (!isApiAvailable) {
        throw new Error("AI service is not available for speech generation.");
    }
    try {
        const promptText = `Lee el siguiente texto en español: "${text}"`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: promptText }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            return base64Audio;
        } else {
            throw new Error("No audio data received from TTS API.");
        }
    } catch (error) {
        console.error("Error generating AI speech:", error);
        throw error;
    }
}


export function connectToLive(
    profile: StudentProfile,
    onMessage: (message: LiveServerMessage) => void,
    onError: (error: ErrorEvent) => void,
    onClose: (close: CloseEvent) => void,
    // FIX: Replaced deprecated FunctionDeclarationTool with the correct type for the tools parameter.
    tools?: { functionDeclarations: FunctionDeclaration[] }[]
) {
     if (!isApiAvailable) {
        return Promise.reject(new Error("Gemini API is not available."));
    }
    
    return ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
            onopen: () => console.log('Live session opened.'),
            onmessage: onMessage,
            onerror: onError,
            onclose: onClose,
        },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            systemInstruction: getSystemInstructionLive(profile),
            tools: tools,
        },
    });
}

export async function generateImageFromText(prompt: string): Promise<string> {
    if (!isApiAvailable) {
        throw new Error("El servicio de IA no está disponible para generar imágenes.");
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const firstCandidate = response.candidates?.[0];

        if (firstCandidate?.content?.parts) {
            for (const part of firstCandidate.content.parts) {
                if (part.inlineData?.data) {
                    const base64ImageBytes: string = part.inlineData.data;
                    return `data:image/png;base64,${base64ImageBytes}`;
                }
            }
        }

        const finishReason = firstCandidate?.finishReason;
        if (finishReason && finishReason !== 'STOP') {
             console.warn(`Image generation failed. Finish Reason: ${finishReason}`, response);
             if (finishReason === 'SAFETY') {
                  throw new Error('La idea fue rechazada por los filtros de seguridad. Intenta con una descripción diferente.');
             }
             throw new Error(`La IA falló con el motivo: ${finishReason}.`);
        }
        
        console.warn("No image data found in AI text-to-image response. This might be due to safety filters.", response);
        throw new Error("La IA no pudo generar la imagen, posiblemente debido a los filtros de seguridad. Intenta con una descripción diferente.");

    } catch (error) {
        console.error("Error generating image from text:", error);
        if (error instanceof Error) {
            throw new Error(`Error de la IA: ${error.message}`);
        }
        throw error;
    }
}


export async function generateAvatarFromText(description: string, profile: { name: string; age: number; gender: 'boy' | 'girl' | null }): Promise<string> {
    if (!isApiAvailable) {
        throw new Error("AI service is not available for image generation.");
    }
    try {
        const genderTerm = profile.gender === 'boy' ? 'un niño' : 'una niña';
        const nameTagInstruction = profile.name.trim() ? `Añade una pequeña etiqueta con el nombre '${profile.name.trim()}' bajo su hombro izquierdo.` : '';
        const fullPrompt = `Crea un avatar de dibujos animados de ${genderTerm} de ${profile.age} años que es ${description}. Estilo alegre y amigable para un niño, fondo simple de un solo color. ${nameTagInstruction}`;

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: fullPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png', // Use PNG for potential transparency
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0]?.image?.imageBytes;
            if (base64ImageBytes) {
                return `data:image/png;base64,${base64ImageBytes}`;
            }
        }
        
        console.warn("No image data found in AI text-to-image response. This might be due to safety filters.", response);
        throw new Error("La IA no pudo generar la imagen, posiblemente debido a los filtros de seguridad. Intenta con una descripción diferente.");

    } catch (error) {
        console.error("Error generating avatar from text:", error);
        if (error instanceof Error) {
            throw new Error(`Error de la IA: ${error.message}`);
        }
        throw error;
    }
}

export async function generateAvatarFromPhoto(base64Photo: string, mimeType: string, profile: { name: string; age: number; gender: 'boy' | 'girl' | null }): Promise<string> {
    if (!isApiAvailable) {
        throw new Error("AI service is not available for image editing.");
    }
    try {
        const pureBase64 = base64Photo.split(',')[1];
        if (!pureBase64) {
            throw new Error("Invalid base64 photo format.");
        }
        
        const genderTerm = profile.gender === 'boy' ? 'un niño' : 'una niña';
        const nameTagInstruction = profile.name.trim() ? `Añade una pequeña etiqueta con el nombre '${profile.name.trim()}' bajo su hombro izquierdo.` : '';

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: pureBase64,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: `Convierte esta foto en un avatar estilo dibujo animado de ${genderTerm} de ${profile.age} años. Mantén los rasgos principales pero con un estilo artístico y simple. Fondo de un solo color. ${nameTagInstruction}`,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const firstCandidate = response.candidates?.[0];

        // Success Case: Check for image data in the response parts.
        if (firstCandidate?.content?.parts) {
            for (const part of firstCandidate.content.parts) {
                if (part.inlineData?.data) {
                    const base64ImageBytes: string = part.inlineData.data;
                    return `data:image/png;base64,${base64ImageBytes}`;
                }
            }
        }
        
        // Failure Cases: Analyze the response to provide a better error message.
        const finishReason = firstCandidate?.finishReason;
        if (finishReason && finishReason !== 'STOP') {
             console.warn(`Image generation failed. Finish Reason: ${finishReason}`, response);
             if (finishReason === 'NO_IMAGE') {
                 throw new Error('La IA no pudo procesar esta foto. Por favor, intenta con una imagen diferente, más clara y donde se vea bien una cara.');
             }
             if (finishReason === 'SAFETY') {
                  throw new Error('La foto fue rechazada por los filtros de seguridad de la IA. Por favor, intenta con una foto diferente.');
             }
             // Generic reason from API
             throw new Error(`La IA falló con el motivo: ${finishReason}.`);
        }

        const blockReason = response.promptFeedback?.blockReason;
        if (blockReason) {
            console.warn(`Image generation blocked. Reason: ${blockReason}`, response.promptFeedback);
            throw new Error(`La imagen fue rechazada por el filtro de seguridad de la IA (Motivo: ${blockReason}). Por favor, intenta con una foto diferente.`);
        }

        // Final fallback if no specific reason is found
        console.warn("No image data found in AI response for an unknown reason.", response);
        throw new Error("No se recibieron datos de imagen de la IA. Inténtalo de nuevo.");

    } catch (error) {
        console.error("Error generating avatar from photo:", error);
         if (error instanceof Error) {
            throw new Error(`Error de la IA: ${error.message}`);
        }
        throw error;
    }
}

export async function processUserFeedback(feedback: string): Promise<string> {
    if (!isApiAvailable) {
        throw new Error("El servicio de IA no está disponible.");
    }
    try {
        const prompt = `Un usuario ha enviado el siguiente comentario o sugerencia sobre la aplicación educativa "Maestro Digital": "${feedback}". Analiza el comentario y genera una respuesta de agradecimiento corta, amigable y alentadora en español. Agradécele por su tiempo y por ayudar a mejorar la aplicación. Mantén el tono del "Maestro Digital": positivo, cercano y con algún emoji.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "Eres 'Maestro Digital', un amigable tutor de IA. Tu tarea es responder a los comentarios de los usuarios de forma positiva y agradecida.",
                temperature: 0.5,
            }
        });
        
        const thankYouMessage = response.text;
        if (typeof thankYouMessage === 'string' && thankYouMessage.trim().length > 0) {
            return thankYouMessage;
        } else {
            throw new Error("La IA no generó una respuesta.");
        }

    } catch (error) {
        console.error("Error processing user feedback:", error);
        throw new Error("No se pudo procesar la sugerencia en este momento.");
    }
}


function summarizePerformance(gameState: GameState): string {
    let summary = "Resumen de rendimiento:\n";
    let entries = 0;

    const allCategoryIds = Object.keys(categoryNames) as CategoryId[];

    for (const categoryId of allCategoryIds) {
        const categoryData = gameState[categoryId];
        if (categoryData && categoryData.skillHistory.length > 0) {
            const lastFiveSessions = categoryData.skillHistory.slice(-5);
            
            const totalScore = lastFiveSessions.reduce((sum, s) => sum + s.score, 0);
            const avgScore = totalScore / lastFiveSessions.length;
            
            const failedQuestions: { q: string, a: string }[] = [];
            lastFiveSessions.forEach(session => {
                session.results?.forEach(result => {
                    if (!result.correct && failedQuestions.length < 2) {
                        failedQuestions.push({ q: result.question, a: result.correctAnswer });
                    }
                });
            });

            if (entries < 4) {
                summary += `- Categoría "${categoryNames[categoryId]}": Puntuación promedio reciente de ${Math.round(avgScore)}. `;
                if (failedQuestions.length > 0) {
                    summary += `Algunos errores recientes incluyen la pregunta: "${failedQuestions[0].q}" (respuesta: ${failedQuestions[0].a}). `;
                }
                summary += "\n";
                entries++;
            }
        }
    }

    if (entries === 0) {
        return "El estudiante aún no tiene suficiente historial de práctica para analizar.";
    }

    return summary;
}

export async function generatePersonalizedSuggestion(gameState: GameState, profile: StudentProfile): Promise<string> {
    if (!isApiAvailable) {
        throw new Error("El servicio de IA no está disponible.");
    }

    const performanceSummary = summarizePerformance(gameState);

    const prompt = `
        Analiza el siguiente resumen de rendimiento del estudiante llamado ${profile.name}.
        ${performanceSummary}
        Basado en este resumen, identifica un área clave de mejora y una fortaleza.
        Genera un consejo corto (2-3 frases), súper positivo y personalizado dirigido a ${profile.name}.
        El consejo debe:
        1. Empezar mencionando algo que está haciendo bien (una fortaleza).
        2. Sugerir un área específica para practicar, idealmente mencionando el tipo de pregunta o una lección relacionada.
        3. Ser muy alentador y usar emojis.
        Ejemplo: "¡Hola, ${profile.name}! 🚀 Veo que eres un campeón en 'Multiplicación y División', ¡vas a toda velocidad! He notado que a veces las restas 'pidiendo prestado' nos dan un poco de guerra. ¿Qué tal si practicamos la lección 'Procedimiento escrito de la sustracción' para volvernos invencibles? 💪"
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: getSystemInstructionQuiz(profile),
                temperature: 0.8,
            }
        });

        const suggestion = response.text;
        if (typeof suggestion === 'string' && suggestion.trim().length > 0) {
            return suggestion;
        } else {
            throw new Error("La IA no generó una sugerencia.");
        }
    } catch (error) {
        console.error("Error generating personalized suggestion:", error);
        throw new Error("No se pudo generar el consejo en este momento.");
    }
}

export async function generateNumberLineExercise(
    min: number, 
    max: number, 
    count: number, 
    difficulty: 'fácil' | 'medio' | 'difícil', 
    profile: StudentProfile
): Promise<{ value: number; label: string; }[]> {
    if (!isApiAvailable) {
        throw new Error("AI service is not available.");
    }

    const difficultyPrompt = {
        'fácil': 'fracciones comunes como 1/2, 1/4 y decimales simples como 0.5.',
        'medio': 'fracciones menos comunes como 3/8, 2/5 y decimales con dos cifras como 0.65.',
        'difícil': 'fracciones que necesiten ser simplificadas para entender su valor y decimales cercanos entre sí, como 0.8 y 0.85.'
    };

    const prompt = `Genera un conjunto de ${count} números únicos para un ejercicio de recta numérica para un niño de ${profile.age} años. Los números deben estar estrictamente entre ${min} y ${max}. Incluye una mezcla de fracciones y decimales. La dificultad debe ser ${difficulty}: ${difficultyPrompt[difficulty]}.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: `Eres un generador de contenido educativo. Respondes únicamente con el JSON solicitado, sin texto adicional. Asegúrate de que los valores numéricos ('value') se correspondan exactamente con su etiqueta en formato de cadena ('label'). Por ejemplo, si la etiqueta es "3/4", el valor debe ser 0.75.`,
                temperature: 0.8,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        items: {
                            type: Type.ARRAY,
                            description: "Una lista de objetos, cada uno representando un número para la recta numérica.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    label: {
                                        type: Type.STRING,
                                        description: "La etiqueta del número como se debe mostrar (ej. '1/2', '0.75')."
                                    },
                                    value: {
                                        type: Type.NUMBER,
                                        description: "El valor numérico exacto de la etiqueta para su posicionamiento."
                                    }
                                },
                                required: ["label", "value"]
                            }
                        }
                    },
                    required: ["items"]
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        if (result.items && Array.isArray(result.items)) {
            return result.items;
        } else {
            throw new Error("La respuesta de la IA no tiene el formato esperado.");
        }

    } catch (error) {
        console.error("Error generating AI number line exercise:", error);
        throw error;
    }
}
