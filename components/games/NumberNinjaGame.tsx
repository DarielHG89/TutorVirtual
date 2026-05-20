import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { playCorrectSound, playIncorrectSound, playClickSound } from '../../utils/sounds';

interface NumberNinjaGameProps {
    onBack: () => void;
}

interface NinjaNumber {
    id: number;
    value: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    isEven: boolean;
    isCut: boolean;
    isMissed: boolean;
    rotation: number;
    rotV: number;
    scale: number;
    opacity: number;
}

export const NumberNinjaGame: React.FC<NumberNinjaGameProps> = ({ onBack }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('ninjaHighScore') || '0'));
    
    const numbersRef = useRef<NinjaNumber[]>([]);
    const lastSpawnTimeRef = useRef<number>(0);
    const requestRef = useRef<number>(0);
    
    const scoreRef = useRef(score);
    useEffect(() => { scoreRef.current = score; }, [score]);

    const livesRef = useRef(lives);
    useEffect(() => { livesRef.current = lives; }, [lives]);

    const isPlayingRef = useRef(isPlaying);
    useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

    const [, setTick] = useState(0);

    const handleGameOver = () => {
        setIsPlaying(false);
        setGameOver(true);
        if (scoreRef.current > highScore) {
            setHighScore(scoreRef.current);
            localStorage.setItem('ninjaHighScore', scoreRef.current.toString());
        }
    };

    const startGame = () => {
        setIsPlaying(true);
        setGameOver(false);
        setScore(0);
        setLives(3);
        numbersRef.current = [];
        lastSpawnTimeRef.current = performance.now();
        playClickSound();
    };

    useEffect(() => {
        const loop = (time: number) => {
            if (!isPlayingRef.current) return;

            const spawnInterval = Math.max(500, 1500 - scoreRef.current * 30);
            if (time - lastSpawnTimeRef.current > spawnInterval) {
                lastSpawnTimeRef.current = time;
                
                const isEven = Math.random() > 0.4;
                let value = Math.floor(Math.random() * 98) + 1;
                if ((isEven && value % 2 !== 0) || (!isEven && value % 2 === 0)) {
                    value += 1;
                }

                numbersRef.current.push({
                    id: Date.now() + Math.random(),
                    value,
                    x: 15 + Math.random() * 70, // 15% to 85%
                    y: 110,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: -(Math.random() * 1.0 + 2.0),
                    isEven,
                    isCut: false,
                    isMissed: false,
                    rotation: Math.random() * 360,
                    rotV: (Math.random() - 0.5) * 5,
                    scale: 1,
                    opacity: 1
                });
            }

            let lostLife = false;

            numbersRef.current.forEach(num => {
                if (num.isCut) {
                    num.scale += Math.max(0, 0.05); // scale up when cut
                    num.opacity = Math.max(0, num.opacity - 0.08); // fade out rapidly
                }

                num.x += num.vx;
                num.y += num.vy;
                num.rotation += num.rotV;
                num.vy += 0.035; // gravity

                if (num.y > 115 && num.vy > 0 && !num.isMissed && !num.isCut) {
                    num.isMissed = true;
                    if (num.isEven) {
                        lostLife = true;
                    }
                }
            });

            if (lostLife) {
                playIncorrectSound();
                setLives(l => {
                    const newL = l - 1;
                    if (newL <= 0) handleGameOver();
                    return newL;
                });
            }

            numbersRef.current = numbersRef.current.filter(num => num.y < 130 && num.opacity > 0);

            setTick(t => t + 1);
            
            requestRef.current = requestAnimationFrame(loop);
        };

        if (isPlaying) {
            requestRef.current = requestAnimationFrame(loop);
        }

        return () => cancelAnimationFrame(requestRef.current);
    }, [isPlaying, highScore]); // Ensure deps don't cause infinite clear/set

    const handleSlash = (id: number) => {
        if (!isPlayingRef.current) return;
        
        const num = numbersRef.current.find(n => n.id === id);
        if (!num || num.isCut || num.isMissed) return;

        num.isCut = true;
        // make it jump/scatter slightly
        num.vx = (Math.random() - 0.5) * 3;
        num.vy = -(Math.random() * 1.5 + 1);
        num.rotV = (Math.random() - 0.5) * 20;

        if (num.isEven) {
            playCorrectSound();
            setScore(s => s + 1);
        } else {
            playIncorrectSound();
            setLives(l => {
                const newL = l - 1;
                if (newL <= 0) handleGameOver();
                return newL;
            });
        }
    };

    if (gameOver) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-xl text-white my-8 max-w-2xl mx-auto text-center border-4 border-indigo-500 shadow-2xl">
                <h2 className="text-5xl font-black mb-4 text-rose-500 uppercase tracking-wider">¡Juego Terminado!</h2>
                <div className="text-7xl mb-6">🥷</div>
                <p className="text-2xl mb-2 text-slate-300">Puntuación: <span className="font-black text-4xl text-white">{score}</span></p>
                <p className="text-xl mb-10 text-amber-500">Récord: <span className="font-bold">{highScore}</span></p>
                <div className="flex gap-4">
                    <Button onClick={startGame} variant="special" className="text-xl px-8 py-4">Jugar de Nuevo</Button>
                    <Button onClick={onBack} variant="secondary" className="text-xl px-8 py-4">Volver</Button>
                </div>
            </div>
        );
    }

    if (!isPlaying) {
         return (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-xl text-white my-8 max-w-2xl mx-auto text-center border-4 border-indigo-500 shadow-2xl">
                <h2 className="text-5xl font-black mb-4 text-indigo-400 uppercase tracking-widest leading-tight">Ninja de<br/>Números 🥷</h2>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8 max-w-md">
                    <p className="text-lg mb-4 text-slate-200">
                        Corta (toca) los números <span className="font-bold text-emerald-400">PARES</span> 🟢
                    </p>
                    <p className="text-lg text-slate-200">
                        Ignora los números <span className="font-bold text-rose-400">IMPARES</span> 🔴
                    </p>
                    <p className="text-sm mt-4 text-slate-400 italic">
                        Pierdes una vida si cortas un impar, o si dejas caer un par.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button onClick={startGame} variant="special" className="text-xl px-10 py-5">¡Cortar!</Button>
                    <Button onClick={onBack} variant="secondary" className="text-xl px-8 py-5">Volver</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl shadow-2xl my-4 overflow-hidden border-4 border-indigo-900 relative h-[600px]">
            {/* Header / HUD */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 pointer-events-none bg-gradient-to-b from-slate-900/80 to-transparent">
                <div className="text-3xl font-black text-white drop-shadow-md">
                    <span className="text-emerald-400">{score}</span> <span className="text-lg text-slate-300 opacity-80 uppercase tracking-widest">Puntos</span>
                </div>
                <div className="flex gap-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={`text-4xl transition-all duration-300 ${i < lives ? '' : 'opacity-20 grayscale scale-75'}`}>
                            ❤️
                        </div>
                    ))}
                </div>
                <button onClick={onBack} className="pointer-events-auto absolute top-2 right-4 text-slate-500 hover:text-white font-bold text-sm bg-slate-800/80 px-3 py-1 rounded-full uppercase tracking-wider">Salir</button>
            </div>

            {/* Game Canvas / Playground */}
            <div className="w-full h-full relative cursor-crosshair active:cursor-[url('/slash.png'),_crosshair] touch-none" onContextMenu={(e) => e.preventDefault()}>
                {/* Background Decor */}
                <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
                    <span className="text-[20rem] font-black text-indigo-500">🥷</span>
                </div>

                {numbersRef.current.map(num => (
                    <div
                        key={num.id}
                        onPointerDown={(e) => {
                            e.preventDefault(); // prevent selection/scrolling
                            handleSlash(num.id);
                        }}
                        onPointerEnter={(e) => {
                            if (e.buttons === 1) { // slash by dragging
                                handleSlash(num.id);
                            }
                        }}
                        className={`absolute w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center rounded-2xl sm:rounded-3xl shadow-xl shadow-black/50 select-none touch-none hover:shadow-2xl hover:brightness-110 active:brightness-125
                            ${num.isCut ? (num.isEven ? 'bg-emerald-400/90 text-white border-2 border-white' : 'bg-rose-500/90 text-white border-2 border-white') : 'bg-slate-100 text-slate-800 border-b-8 border-slate-300'}
                        `}
                        style={{
                            left: `${num.x}%`,
                            top: `${num.y}%`,
                            transform: `translate(-50%, -50%) rotate(${num.rotation}deg) scale(${num.scale})`,
                            opacity: num.opacity,
                            transition: 'background-color 0.1s', // only background transitions
                            fontSize: num.isCut ? '4rem' : '3.5rem',
                            fontWeight: 900
                        }}
                    >
                        {num.value}
                    </div>
                ))}
            </div>
        </div>
    );
};
