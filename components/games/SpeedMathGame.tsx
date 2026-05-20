import React, { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { playCorrectSound, playIncorrectSound, playClickSound } from '../../utils/sounds';

interface SpeedMathGameProps {
    onBack: () => void;
}

type Operation = '+' | '-' | '*' | '/';

interface Problem {
    a: number;
    b: number;
    op: Operation;
    answer: number;
    options: number[];
}

const generateProblem = (): Problem => {
    const ops: Operation[] = ['+', '-', '*', '/'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a=0, b=0, answer=0;

    switch (op) {
        case '+':
            a = Math.floor(Math.random() * 50) + 1;
            b = Math.floor(Math.random() * 50) + 1;
            answer = a + b;
            break;
        case '-':
            a = Math.floor(Math.random() * 50) + 20;
            b = Math.floor(Math.random() * a);
            answer = a - b;
            break;
        case '*':
            a = Math.floor(Math.random() * 10) + 2;
            b = Math.floor(Math.random() * 10) + 2;
            answer = a * b;
            break;
        case '/':
            b = Math.floor(Math.random() * 10) + 2;
            answer = Math.floor(Math.random() * 10) + 2;
            a = b * answer;
            break;
    }

    const optionsSet = new Set<number>();
    optionsSet.add(answer);
    while (optionsSet.size < 4) {
        const offset = Math.floor(Math.random() * 10) - 5;
        if (offset !== 0 && answer + offset >= 0) {
            optionsSet.add(answer + offset);
        } else {
             optionsSet.add(answer + Math.floor(Math.random() * 10) + 1);
        }
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    return { a, b, op, answer, options };
};

export const SpeedMathGame: React.FC<SpeedMathGameProps> = ({ onBack }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [score, setScore] = useState(0);
    const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const startGame = () => {
        setIsPlaying(true);
        setTimeLeft(60);
        setScore(0);
        setGameOver(false);
        setCurrentProblem(generateProblem());
        setFeedback(null);
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
        }
        return () => clearInterval(timer);
    }, [isPlaying, timeLeft]);

    const handleAnswer = (selected: number) => {
        if (!currentProblem || !isPlaying) return;

        if (selected === currentProblem.answer) {
            setScore(s => s + 1);
            setFeedback('correct');
            playCorrectSound();
            setTimeout(() => {
                setFeedback(null);
                setCurrentProblem(generateProblem());
            }, 300);
        } else {
            setFeedback('incorrect');
            playIncorrectSound();
            setTimeLeft(curr => Math.max(0, curr - 3)); // Penalty
            setTimeout(() => {
                setFeedback(null);
            }, 300);
        }
    };

    if (gameOver) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-xl text-white my-8 max-w-2xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-4 text-amber-400">¡Tiempo Agotado!</h2>
                <div className="text-6xl mb-4">🏆</div>
                <p className="text-2xl mb-8">Puntuación Final: <span className="font-black text-4xl">{score}</span></p>
                <div className="flex gap-4">
                    <Button onClick={startGame} variant="special" className="text-xl px-6 py-3">Jugar de Nuevo</Button>
                    <Button onClick={onBack} variant="secondary" className="text-xl px-6 py-3">Volver a Juegos</Button>
                </div>
            </div>
        );
    }

    if (!isPlaying) {
         return (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-xl text-white my-8 max-w-2xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-4 text-amber-400">Cálculo Veloz ⚡</h2>
                <p className="text-xl mb-6 text-slate-300">
                    Resuelve tantas operaciones como puedas en 60 segundos. 
                </p>
                <p className="text-md mb-8 text-rose-400">
                    ¡Cuidado! Las respuestas incorrectas restan 3 segundos.
                </p>
                <div className="flex gap-4">
                    <Button onClick={startGame} variant="special" className="text-xl px-8 py-4">¡Empezar!</Button>
                    <Button onClick={onBack} variant="secondary" className="text-xl px-8 py-4">Volver</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-8 bg-slate-800 rounded-xl shadow-2xl my-8 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
                <div className="text-2xl font-bold text-slate-200">
                    Puntos: <span className="text-emerald-400 font-black text-3xl">{score}</span>
                </div>
                <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-amber-400'}`}>
                    ⏱️ {timeLeft}s
                </div>
                <button onClick={onBack} className="absolute top-2 right-4 text-slate-400 hover:text-white font-bold text-sm">Salir</button>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[300px]">
                <AnimatePresence mode="wait">
                    {currentProblem && (
                        <motion.div 
                            key={`${currentProblem.a}${currentProblem.op}${currentProblem.b}`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.1, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full relative"
                        >
                            <div className={`text-7xl font-black text-center mb-12 transition-colors duration-200 ${feedback === 'correct' ? 'text-emerald-400' : feedback === 'incorrect' ? 'text-rose-500' : 'text-white'}`}>
                                {currentProblem.a} <span className="text-slate-400">{currentProblem.op === '*' ? '×' : currentProblem.op === '/' ? '÷' : currentProblem.op}</span> {currentProblem.b}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto">
                                {currentProblem.options.map((opt, i) => (
                                    <Button 
                                        key={opt + '-' + i} 
                                        onClick={() => handleAnswer(opt)}
                                        variant="primary"
                                        className="text-3xl py-6 hover:scale-105 active:scale-95 flex items-center justify-center border-b-4"
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
            {feedback === 'incorrect' && (
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-rose-500 font-black text-5xl animate-bounce pointer-events-none drop-shadow-lg z-50">
                    -3s
                </div>
            )}
        </div>
    );
};
