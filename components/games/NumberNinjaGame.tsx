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
    const [showLifeBonus, setShowLifeBonus] = useState(false);
    
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

            const scoreScore = scoreRef.current;
            // Base speed multiplier starts at 1.0 and increases very gently (capped at 1.4x)
            const speedMultiplier = 1.0 + Math.min(0.4, scoreScore * 0.01);

            const spawnInterval = Math.max(700, 1800 - scoreScore * 35);
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
                    vx: ((Math.random() - 0.5) * 0.4) * speedMultiplier,
                    vy: -(Math.random() * 0.4 + 1.1) * speedMultiplier, // Slower, more controllable ascent
                    isEven,
                    isCut: false,
                    isMissed: false,
                    rotation: Math.random() * 360,
                    rotV: (Math.random() - 0.5) * 4,
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
                
                // Gentler gravity so they float elegantly and stay on screen longer
                const gravityVal = 0.016 * speedMultiplier;
                num.vy += gravityVal; 

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
            setScore(s => {
                const newScore = s + 1;
                if (newScore > 0 && newScore % 15 === 0) {
                    setLives(l => {
                        if (l < 5) {
                            setShowLifeBonus(true);
                            setTimeout(() => setShowLifeBonus(false), 2000);
                            return l + 1;
                        }
                        return l;
                    });
                }
                return newScore;
            });
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
                    <p className="text-lg mb-4 text-slate-200">
                        Ignora los números <span className="font-bold text-rose-400">IMPARES</span> 🔴
                    </p>
                    <p className="text-sm font-semibold text-emerald-300 mb-4 bg-emerald-950/40 p-2 rounded-lg border border-emerald-900/30">
                        🎁 ¡Cada 15 cortes correctos recibes +1 ❤️ de vida extra! (Mínimo 3 iniciales, máximo 5)
                    </p>
                    <p className="text-sm text-slate-400 italic">
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
            {/* Life Bonus Floating Animation */}
            <AnimatePresence>
                {showLifeBonus && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.3, y: 50 }}
                        animate={{ opacity: 1, scale: 1.1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -80 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute inset-x-0 top-1/3 flex justify-center items-center z-25 pointer-events-none"
                    >
                        <div className="bg-emerald-500/95 text-white shadow-2xl rounded-2xl py-3 px-6 text-center border-4 border-emerald-400 font-black animate-pulse flex items-center gap-3">
                            <span className="text-4xl">❤️</span>
                            <div className="flex flex-col text-left">
                                <span className="text-xl font-extrabold text-white tracking-widest uppercase leading-none">¡VIDA EXTRA!</span>
                                <span className="text-xs text-emerald-100 font-normal mt-0.5">¡Ganaste +1 vida por racha de cortes! 🥷✨</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header / HUD */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 pointer-events-none bg-gradient-to-b from-slate-900/80 to-transparent">
                <div className="text-3xl font-black text-white drop-shadow-md">
                    <span className="text-emerald-400">{score}</span> <span className="text-lg text-slate-300 opacity-80 uppercase tracking-widest">Puntos</span>
                </div>
                <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className={`text-4xl transition-all duration-300 ${i < lives ? '' : 'opacity-20 grayscale scale-75'}`}>
                            ❤️
                        </div>
                    ))}
                </div>
                <button onClick={onBack} className="pointer-events-auto absolute top-2 right-4 text-slate-500 hover:text-white font-bold text-sm bg-slate-800/80 px-3 py-1 rounded-full uppercase tracking-wider">Salir</button>
            </div>

            {/* Game Canvas / Playground */}
            <div className="w-full h-full relative overflow-hidden bg-slate-950 cursor-crosshair touch-none" onContextMenu={(e) => e.preventDefault()}>
                {/* Dojo Shoji Screen Background */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Shoji translucent paper screen */}
                    <div className="absolute inset-0 bg-[#1e202e]" />
                    {/* Dark Wood lattice frames (Grid lines) */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#11131c_3px,transparent_3px),linear-gradient(to_bottom,#11131c_3px,transparent_3px)] bg-[size:64px_80px] opacity-70" />
                    {/* Red lacquer trim lines (traditional Dojo touch) */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-rose-900 opacity-60" />
                    <div className="absolute inset-x-0 bottom-0 h-3 bg-[#11131c]" />
                    {/* Ambient light glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/40 via-transparent to-rose-900/10 opacity-70" />
                    {/* Big stylized background watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-25">
                        <span className="text-[28rem] font-black select-none drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">🥷</span>
                    </div>
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
                        className={`absolute w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center rounded-2xl sm:rounded-[2rem] shadow-xl shadow-black/50 select-none touch-none hover:shadow-2xl hover:brightness-110 active:brightness-125 transition-transform duration-75
                            ${num.isCut ? (num.isEven ? 'bg-emerald-400/90 text-white border-2 border-white' : 'bg-rose-500/90 text-white border-2 border-white') : 'bg-slate-100 text-slate-800 border-b-8 border-slate-300'}
                        `}
                        style={{
                            left: `${num.x}%`,
                            top: `${num.y}%`,
                            transform: `translate(-50%, -50%) rotate(${num.rotation}deg) scale(${num.scale})`,
                            opacity: num.opacity,
                            transition: 'background-color 0.1s', // only background transitions
                            fontSize: num.isCut ? '4.5rem' : '4rem',
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
