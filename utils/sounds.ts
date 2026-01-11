// utils/sounds.ts

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
    if (audioContext && audioContext.state !== 'closed') {
        return audioContext;
    }
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
        try {
            audioContext = new AudioContext();
            return audioContext;
        } catch (e) {
            console.error("Could not create AudioContext:", e);
            return null;
        }
    }
    return null;
};

// Resume audio context on first user interaction
const resumeAudio = () => {
    const ctx = getAudioContext();
    if (ctx?.state === 'suspended') {
        ctx.resume();
    }
    window.removeEventListener('click', resumeAudio, true);
    window.removeEventListener('keydown', resumeAudio, true);
};
if (typeof window !== 'undefined') {
    window.addEventListener('click', resumeAudio, true);
    window.addEventListener('keydown', resumeAudio, true);
}


const playTone = (type: 'correct' | 'incorrect' | 'click' | 'hint' | 'mascot-chirp' | 'mascot-surprised' | 'mascot-snore') => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        const now = ctx.currentTime;

        switch(type) {
            case 'correct':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(523.25, now); // C5
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.5);
                oscillator.start(now);
                oscillator.stop(now + 0.5);
                break;
            case 'incorrect':
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(155.56, now); // D#3
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.4);
                oscillator.start(now);
                oscillator.stop(now + 0.4);
                break;
            case 'click':
                 oscillator.type = 'triangle';
                 oscillator.frequency.setValueAtTime(880.00, now); // A5
                 gainNode.gain.setValueAtTime(0, now);
                 gainNode.gain.linearRampToValueAtTime(0.1, now + 0.01);
                 gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.1);
                 oscillator.start(now);
                 oscillator.stop(now + 0.1);
                 break;
            case 'hint':
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(659.25, now); // E5
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
                oscillator.start(now);
                oscillator.stop(now + 0.3);
                break;
            
            // --- New Mascot Sounds ---
            case 'mascot-chirp':
                oscillator.type = 'sine';
                // Quick pitch up (chirp)
                oscillator.frequency.setValueAtTime(600, now);
                oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
                
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.15, now + 0.02);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
                
                oscillator.start(now);
                oscillator.stop(now + 0.1);
                break;

            case 'mascot-surprised':
                oscillator.type = 'triangle';
                // Slide up effect
                oscillator.frequency.setValueAtTime(400, now);
                oscillator.frequency.linearRampToValueAtTime(800, now + 0.2);
                
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.25);
                
                oscillator.start(now);
                oscillator.stop(now + 0.25);
                break;

            case 'mascot-snore':
                oscillator.type = 'sawtooth';
                // Low pitch slide down
                oscillator.frequency.setValueAtTime(150, now);
                oscillator.frequency.linearRampToValueAtTime(80, now + 0.4);
                
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.1, now + 0.1);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
                
                oscillator.start(now);
                oscillator.stop(now + 0.4);
                break;
        }
        
    } catch (e) {
        console.error("Could not play sound:", e);
    }
};

export const playCorrectSound = () => playTone('correct');
export const playIncorrectSound = () => playTone('incorrect');
export const playClickSound = () => playTone('click');
export const playHintSound = () => playTone('hint');
export const playMascotSound = (type: 'chirp' | 'surprised' | 'snore') => playTone(`mascot-${type}` as any);