import React, { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { playCorrectSound, playIncorrectSound, playClickSound } from '../../utils/sounds';
import type { StudentProfile } from '../../types';

interface SpeedMathGameProps {
    onBack: () => void;
    studentProfile?: StudentProfile | null;
}

type Operation = '+' | '-' | '*' | '/';

interface Problem {
    a: number;
    b: number;
    op: Operation;
    answer: number;
    options: number[];
}

// Score-based adaptive problem generator to match child's learning stage dynamically
const generateProblem = (score: number): Problem => {
    let op: Operation = '+';
    let a = 0, b = 0, answer = 0;

    if (score < 3) {
        // Nivel 1: Súper Fácil (Suma y resta con números de una cifra o menores a 12)
        const ops: Operation[] = ['+', '-'];
        op = ops[Math.floor(Math.random() * ops.length)];
        if (op === '+') {
            a = Math.floor(Math.random() * 8) + 1; // 1-8
            b = Math.floor(Math.random() * 5) + 1; // 1-5
            answer = a + b;
        } else {
            a = Math.floor(Math.random() * 6) + 6; // 6-11
            b = Math.floor(Math.random() * (a - 1)) + 1; // 1 a a-1
            answer = a - b;
        }
    } else if (score < 6) {
        // Nivel 2: Muy Fácil (Suma y resta < 25, tablas del 2 y 5)
        const ops: Operation[] = ['+', '-', '*'];
        op = ops[Math.floor(Math.random() * ops.length)];
        if (op === '+') {
            a = Math.floor(Math.random() * 15) + 3;
            b = Math.floor(Math.random() * 10) + 2;
            answer = a + b;
        } else if (op === '-') {
            a = Math.floor(Math.random() * 12) + 10; // 10-21
            b = Math.floor(Math.random() * (a - 3)) + 2;
            answer = a - b;
        } else {
            // Tablas sencillas del 2 y 5
            const bases = [2, 5];
            a = bases[Math.floor(Math.random() * bases.length)];
            b = Math.floor(Math.random() * 9) + 1; // 1-9
            if (Math.random() > 0.5) {
                const temp = a;
                a = b;
                b = temp;
            }
            answer = a * b;
        }
    } else if (score < 10) {
        // Nivel 3: Fácil (Suma y resta < 50, tablas 2, 3, 4, 5, 10, divisiones sencillas)
        const ops: Operation[] = ['+', '-', '*', '/'];
        op = ops[Math.floor(Math.random() * ops.length)];
        if (op === '+') {
            a = Math.floor(Math.random() * 25) + 5;
            b = Math.floor(Math.random() * 20) + 5;
            answer = a + b;
        } else if (op === '-') {
            a = Math.floor(Math.random() * 25) + 20; // 20-44
            b = Math.floor(Math.random() * (a - 5)) + 4;
            answer = a - b;
        } else if (op === '*') {
            const table = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
            const other = Math.floor(Math.random() * 9) + 2; // 2-10
            a = Math.random() > 0.5 ? table : other;
            b = a === table ? other : table;
            answer = a * b;
        } else {
            // división exacta con tablas 2 o 5
            b = [2, 5][Math.floor(Math.random() * 2)];
            answer = Math.floor(Math.random() * 9) + 2; // 2-10
            a = b * answer;
        }
    } else if (score < 16) {
        // Nivel 4: Medio (Sumas < 80, multiplicación hasta tabla del 9 y divisiones asociadas)
        const ops: Operation[] = ['+', '-', '*', '/'];
        op = ops[Math.floor(Math.random() * ops.length)];
        if (op === '+') {
            a = Math.floor(Math.random() * 40) + 10;
            b = Math.floor(Math.random() * 30) + 10;
            answer = a + b;
        } else if (op === '-') {
            a = Math.floor(Math.random() * 45) + 30; // 30-74
            b = Math.floor(Math.random() * (a - 8)) + 5;
            answer = a - b;
        } else if (op === '*') {
            a = Math.floor(Math.random() * 8) + 2; // 2-9
            b = Math.floor(Math.random() * 8) + 2; // 2-9
            answer = a * b;
        } else {
            b = Math.floor(Math.random() * 8) + 2; // 2-9
            answer = Math.floor(Math.random() * 8) + 2; // 2-9
            a = b * answer;
        }
    } else {
        // Nivel 5: Avanzado (Sumas/restas de tres cifras, multiplicación y división hasta tabla del 12)
        const ops: Operation[] = ['+', '-', '*', '/'];
        op = ops[Math.floor(Math.random() * ops.length)];
        if (op === '+') {
            a = Math.floor(Math.random() * 80) + 20;
            b = Math.floor(Math.random() * 80) + 20;
            answer = a + b;
        } else if (op === '-') {
            a = Math.floor(Math.random() * 100) + 50; // 50-149
            b = Math.floor(Math.random() * (a - 15)) + 10;
            answer = a - b;
        } else if (op === '*') {
            a = Math.floor(Math.random() * 11) + 2; // 2-12
            b = Math.floor(Math.random() * 11) + 2; // 2-12
            answer = a * b;
        } else {
            b = Math.floor(Math.random() * 11) + 2; // 2-12
            answer = Math.floor(Math.random() * 11) + 2; // 2-12
            a = b * answer;
        }
    }

    // Smart distraction generation for math pedagogy
    const optionsSet = new Set<number>();
    optionsSet.add(answer);

    // Provide natural logical traps/mistakes nearby
    if (op === '+' || op === '-') {
        const suggestions = [
            answer + 1,
            answer - 1,
            answer + 10,
            answer - 10,
            answer + 2,
            answer - 2
        ];
        suggestions.forEach(s => {
            if (s >= 0 && optionsSet.size < 4) optionsSet.add(s);
        });
    } else if (op === '*') {
        const suggestions = [
            a * (b + 1),
            a * (b - 1),
            (a + 1) * b,
            (a - 1) * b,
            answer + a,
            answer - a,
            answer + b,
            answer - b
        ];
        suggestions.forEach(s => {
            if (s > 0 && optionsSet.size < 4) optionsSet.add(s);
        });
    } else if (op === '/') {
        const suggestions = [
            answer + 1,
            answer - 1,
            answer + 2,
            answer - 2,
            Math.max(1, answer * 2),
            Math.max(1, Math.round(answer / 2))
        ];
        suggestions.forEach(s => {
            if (s > 0 && optionsSet.size < 4) optionsSet.add(s);
        });
    }

    // Safety fallback for options uniqueness
    while (optionsSet.size < 4) {
        const offset = Math.floor(Math.random() * 13) - 6; // -6 to 6
        const alt = answer + offset;
        if (offset !== 0 && alt >= 0) {
            optionsSet.add(alt);
        } else {
            optionsSet.add(answer + Math.floor(Math.random() * 12) + 1);
        }
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    return { a, b, op, answer, options };
};

export const SpeedMathGame: React.FC<SpeedMathGameProps> = ({ onBack, studentProfile }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [score, setScore] = useState(0);
    const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [isNewRecord, setIsNewRecord] = useState(false);

    // Get specific localStorage key for student high scores
    const getHighScoreKey = () => {
        return studentProfile ? `speed_math_high_score_${studentProfile.id}` : 'speed_math_high_score_global';
    };

    const [highScore, setHighScore] = useState<number>(() => {
        const saved = localStorage.getItem(studentProfile ? `speed_math_high_score_${studentProfile.id}` : 'speed_math_high_score_global');
        return saved ? parseInt(saved, 10) : 0;
    });

    const getLevelInfo = (s: number) => {
        if (s < 3) return { name: 'Principiante 🌱', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
        if (s < 6) return { name: 'Aprendiz 🔍', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
        if (s < 10) return { name: 'Activo 🏃', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
        if (s < 16) return { name: 'Maestro 🎓', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
        return { name: 'Ninja Intelectual ⚡🥷', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20 animate-pulse font-black' };
    };

    const level = getLevelInfo(score);

    const startGame = () => {
        setIsPlaying(true);
        setTimeLeft(60);
        setScore(0);
        setGameOver(false);
        setCurrentProblem(generateProblem(0)); // starts at score 0 difficulty
        setFeedback(null);
        setIsNewRecord(false);
        playClickSound();
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(curr => curr - 1);
            }, 1000);
        } else if (timeLeft <= 0 && isPlaying) {
            setIsPlaying(false);
            setGameOver(true);
            playCorrectSound();

            const key = getHighScoreKey();
            const currentHS = parseInt(localStorage.getItem(key) || '0', 10);
            if (score > currentHS) {
                localStorage.setItem(key, score.toString());
                setHighScore(score);
                setIsNewRecord(true);
            } else {
                setIsNewRecord(false);
            }
        }
        return () => clearInterval(timer);
    }, [isPlaying, timeLeft, score]);

    const handleAnswer = (selected: number) => {
        if (!currentProblem || !isPlaying || feedback !== null) return;

        if (selected === currentProblem.answer) {
            const nextScore = score + 1;
            setScore(nextScore);
            setFeedback('correct');
            playCorrectSound();
            setTimeout(() => {
                setFeedback(null);
                setCurrentProblem(generateProblem(nextScore)); // pass updated score for progressive scaling
            }, 300);
        } else {
            setFeedback('incorrect');
            playIncorrectSound();
            setTimeLeft(curr => Math.max(0, curr - 3)); // 3-second penalty
            setTimeout(() => {
                setFeedback(null);
                // Pedagogical refinement: generate new problem so the child doesn't get permanently stuck
                setCurrentProblem(generateProblem(score));
            }, 450);
        }
    };

    if (gameOver) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-xl text-white my-8 max-w-2xl mx-auto text-center border-2 border-amber-500 shadow-2xl">
                <h2 className="text-4xl font-black mb-4 text-amber-400">¡Tiempo Agotado! ⏱️</h2>
                <div className="text-7xl mb-4">🏆</div>
                
                <p className="text-2xl mb-2">Puntuación Final: <span className="font-black text-4xl text-emerald-400">{score}</span></p>
                <p className="text-md text-slate-400 mb-6">Nivel alcanzado: <span className="font-semibold text-white">{level.name}</span></p>

                {isNewRecord ? (
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-emerald-500/20 border border-emerald-500 text-emerald-400 px-6 py-3 rounded-lg font-bold text-xl mb-8 animate-pulse"
                    >
                        🎉 ¡NUEVO RÉCORD PERSONAL! 🎉
                    </motion.div>
                ) : (
                    <p className="text-slate-400 mb-8">El récord actual de {studentProfile ? studentProfile.name : 'dispositivo'} es: <span className="text-slate-200 font-bold">{highScore}</span></p>
                )}

                <div className="flex gap-4">
                    <Button onClick={startGame} variant="special" className="text-xl px-6 py-3">Jugar de Nuevo</Button>
                    <Button onClick={onBack} variant="secondary" className="text-xl px-6 py-3">Volver a Juegos</Button>
                </div>
            </div>
        );
    }

    if (!isPlaying) {
         return (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-xl text-white my-8 max-w-2xl mx-auto text-center border-2 border-slate-700 shadow-2xl">
                <h2 className="text-4xl font-black mb-2 text-amber-400 flex items-center gap-2">Cálculo Veloz ⚡</h2>
                <p className="text-sm font-semibold tracking-wider text-slate-400 mb-6 uppercase">Entrenamiento de mente ágil</p>

                {studentProfile && (
                    <div className="bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-full mb-6 text-sm text-slate-300">
                        Jugador activo: <span className="font-bold text-amber-400">{studentProfile.name}</span>
                    </div>
                )}

                <p className="text-lg mb-4 text-slate-300 max-w-md mx-auto">
                    Resuelve tantas operaciones matemáticas como puedas en <span className="text-amber-300 font-bold">60 segundos</span>. ¡La dificultad subirá junto con tu puntaje!
                </p>
                
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm py-2 px-4 rounded-lg mb-8 max-w-md">
                     Las respuestas incorrectas restan 3 segundos al temporizador.
                </div>

                {highScore > 0 && (
                    <div className="text-slate-400 text-md mb-8">
                        Mejor puntuación grabada: <span className="text-emerald-400 font-black text-xl">{highScore} puntos</span>
                    </div>
                )}

                <div className="flex gap-4 w-full justify-center">
                    <Button onClick={startGame} variant="special" className="text-xl px-8 py-4">¡Empezar a Jugar!</Button>
                    <Button onClick={onBack} variant="secondary" className="text-xl px-8 py-4">Volver</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-8 bg-slate-800 rounded-xl shadow-2xl my-8 relative overflow-hidden border-2 border-slate-700 select-none">
            {/* Top header stats bar */}
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Puntos</span>
                    <span className="text-emerald-400 font-black text-3xl">{score}</span>
                </div>

                {/* Level / rank tracker badge */}
                <div className={`px-4 py-1 text-xs sm:text-sm font-black rounded-full border ${level.color} transition-all duration-300`}>
                    {level.name}
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Tiempo</span>
                    <span className={`text-3xl font-mono font-black ${timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-amber-400'}`}>
                        {timeLeft}s
                    </span>
                </div>
            </div>

            <button 
                onClick={onBack} 
                className="absolute top-3 right-4 text-slate-500 hover:text-slate-300 transition-colors text-xs font-bold uppercase tracking-wider"
            >
                Salir
            </button>

            {/* Arithmetic stage */}
            <div className="flex flex-col items-center justify-center min-h-[300px]">
                <AnimatePresence mode="wait">
                    {currentProblem && (
                        <motion.div 
                            key={`${currentProblem.a}${currentProblem.op}${currentProblem.b}`}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.05, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="w-full relative"
                        >
                            {/* Question displays */}
                            <div className={`text-6xl sm:text-7xl font-black text-center mb-10 transition-colors duration-200 tracking-tight font-mono ${feedback === 'correct' ? 'text-emerald-400 animate-pulse' : feedback === 'incorrect' ? 'text-rose-500' : 'text-white'}`}>
                                {currentProblem.a} <span className="text-slate-400 font-sans mx-2">{currentProblem.op === '*' ? '×' : currentProblem.op === '/' ? '÷' : currentProblem.op}</span> {currentProblem.b}
                            </div>
                            
                            {/* Options bento items */}
                            <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto">
                                {currentProblem.options.map((opt, i) => (
                                    <Button 
                                        key={opt + '-' + i} 
                                        onClick={() => handleAnswer(opt)}
                                        variant="primary"
                                        className={`text-3xl font-mono py-5 sm:py-6 transition-all duration-100 flex items-center justify-center border-b-4 ${feedback !== null ? 'opacity-50' : 'hover:scale-[1.03] active:scale-[0.98]'}`}
                                        disabled={feedback !== null}
                                    >
                                        {opt}
                                    </Button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Float bouncing indicators */}
            <AnimatePresence>
                {feedback === 'incorrect' && (
                    <motion.div 
                        initial={{ scale: 0.5, y: -20, opacity: 0 }}
                        animate={{ scale: 1.3, y: -80, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute left-1/2 transform -translate-x-1/2 text-rose-500 font-extrabold text-5xl pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] z-50 text-center"
                    >
                        -3s ⚠️
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {feedback === 'correct' && (
                    <motion.div 
                        initial={{ scale: 0.5, y: -20, opacity: 0 }}
                        animate={{ scale: 1.3, y: -80, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute left-1/2 transform -translate-x-1/2 text-emerald-400 font-extrabold text-5xl pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] z-50 text-center"
                    >
                        +1 ⭐
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
