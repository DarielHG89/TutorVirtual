import React, { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { playCorrectSound, playIncorrectSound, playClickSound } from '../../utils/sounds';

interface MemoryMathGameProps {
    onBack: () => void;
}

type CardState = 'hidden' | 'visible' | 'matched';

interface MemoryCard {
    id: number;
    content: string;
    matchId: number;
    state: CardState;
}

const generateCards = (): MemoryCard[] => {
    const generateDynamicPairs = () => {
        const generated = [];
        const ops = [
            () => { const a=Math.floor(Math.random()*9)+2, b=Math.floor(Math.random()*9)+2; return { op: `${a} × ${b}`, res: `${a*b}` } },
            () => { const a=Math.floor(Math.random()*20)+10, b=Math.floor(Math.random()*10)+5; return { op: `${a} + ${b}`, res: `${a+b}` } },
            () => { const a=Math.floor(Math.random()*50)+20, b=Math.floor(Math.random()*15)+5; return { op: `${a} - ${b}`, res: `${a-b}` } },
            () => { const b=Math.floor(Math.random()*8)+2, res=Math.floor(Math.random()*8)+2; return { op: `${b*res} ÷ ${b}`, res: `${res}` } },
        ];
        
        let i = 0;
        const resSet = new Set<string>();
        // Check to not run forever
        let attempts = 0;
        while(generated.length < 6 && attempts < 100) {
           const p = ops[i % ops.length]();
           if(!resSet.has(p.res)) {
               resSet.add(p.res);
               generated.push(p);
           }
           i++;
           attempts++;
        }
        return generated;
    }

    const dynamicPairs = generateDynamicPairs();
    let cards: MemoryCard[] = [];
    dynamicPairs.forEach((p, index) => {
        cards.push({ id: index * 2, content: p.op, matchId: index, state: 'hidden' });
        cards.push({ id: index * 2 + 1, content: p.res, matchId: index, state: 'hidden' });
    });

    return cards.sort(() => Math.random() - 0.5);
};

export const MemoryMathGame: React.FC<MemoryMathGameProps> = ({ onBack }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [cards, setCards] = useState<MemoryCard[]>([]);
    const [firstPick, setFirstPick] = useState<number | null>(null);
    const [secondPick, setSecondPick] = useState<number | null>(null);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timeElapsed, setTimeElapsed] = useState(0);

    const startGame = () => {
        setIsPlaying(true);
        setCards(generateCards());
        setFirstPick(null);
        setSecondPick(null);
        setMoves(0);
        setMatches(0);
        setGameOver(false);
        setIsChecking(false);
        setStartTime(Date.now());
        setTimeElapsed(0);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && !gameOver && startTime) {
            interval = setInterval(() => {
                setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, gameOver, startTime]);

    const handleCardClick = (id: number) => {
        if (!isPlaying || isChecking) return;
        
        const clickedCard = cards.find(c => c.id === id);
        if (!clickedCard || clickedCard.state !== 'hidden') return;

        playClickSound();

        setCards(prev => prev.map(c => c.id === id ? { ...c, state: 'visible' } : c));

        if (firstPick === null) {
            setFirstPick(id);
        } else {
            setSecondPick(id);
            setMoves(m => m + 1);
            setIsChecking(true);
        }
    };

    useEffect(() => {
        if (firstPick !== null && secondPick !== null) {
            const card1 = cards.find(c => c.id === firstPick);
            const card2 = cards.find(c => c.id === secondPick);

            if (card1 && card2 && card1.matchId === card2.matchId) {
                // Match!
                setTimeout(() => {
                    playCorrectSound();
                    setCards(prev => prev.map(c => 
                        c.matchId === card1.matchId ? { ...c, state: 'matched' } : c
                    ));
                    setMatches(m => m + 1);
                    setFirstPick(null);
                    setSecondPick(null);
                    setIsChecking(false);
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    playIncorrectSound();
                    setCards(prev => prev.map(c => 
                        (c.id === firstPick || c.id === secondPick) ? { ...c, state: 'hidden' } : c
                    ));
                    setFirstPick(null);
                    setSecondPick(null);
                    setIsChecking(false);
                }, 1000);
            }
        }
    }, [firstPick, secondPick]);

    useEffect(() => {
        if (isPlaying && matches === 6) { 
            setGameOver(true);
            playCorrectSound();
        }
    }, [matches, isPlaying]);

    if (gameOver) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-xl text-white my-8 max-w-2xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-4 text-emerald-400">¡Reto Completado!</h2>
                <div className="text-6xl mb-4">🏆</div>
                <p className="text-2xl mb-2">Completado en: <span className="font-black text-3xl">{timeElapsed} segundos</span></p>
                <p className="text-xl mb-8">Movimientos: <span className="font-black text-2xl">{moves}</span></p>
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
                <h2 className="text-4xl font-bold mb-4 text-teal-400">Memoria Matemática 🧩</h2>
                <p className="text-xl mb-8 text-slate-300 max-w-md">
                    Encuentra las parejas que corresponden a la misma operación y su resultado. ¡Hazlo en la menor cantidad de movimientos!
                </p>
                <div className="flex gap-4">
                    <Button onClick={startGame} variant="special" className="text-xl px-8 py-4">¡Empezar!</Button>
                    <Button onClick={onBack} variant="secondary" className="text-xl px-8 py-4">Volver</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-8 bg-slate-800 rounded-xl shadow-2xl my-8 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
                <div className="text-xl font-bold text-slate-200">
                    Movimientos: <span className="text-white font-black">{moves}</span>
                </div>
                <div className="text-xl font-bold text-teal-400">
                    ⏱️ {timeElapsed}s
                </div>
                <button onClick={onBack} className="absolute top-2 right-4 text-slate-400 hover:text-white font-bold text-sm">Salir</button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 w-full">
                {cards.map(card => (
                    <motion.div
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        className={`aspect-square sm:aspect-[4/3] rounded-xl flex items-center justify-center text-center p-2 cursor-pointer transition-all ${card.state === 'hidden' ? 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_6px_0_#4f46e5]' : card.state === 'visible' ? 'bg-white text-slate-800 shadow-inner' : 'bg-emerald-500 text-white opacity-60'}`}
                        animate={{ rotateY: card.state === 'hidden' ? 0 : 180 }}
                        transition={{ duration: 0.3 }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <div 
                            style={{ backfaceVisibility: 'hidden', transform: card.state === 'hidden' ? 'rotateY(0deg)' : 'rotateY(180deg)' }}
                            className={`w-full h-full flex items-center justify-center`}
                        >
                           {card.state !== 'hidden' ? (
                               <span className="text-2xl sm:text-3xl font-black" style={{ transform: 'rotateY(180deg)' }}>
                                   {card.content}
                               </span>
                           ) : (
                               <span className="text-4xl opacity-50">?</span>
                           )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
