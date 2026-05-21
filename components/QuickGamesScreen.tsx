import React, { useState } from 'react';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { SpeedMathGame } from './games/SpeedMathGame';
import { MemoryMathGame } from './games/MemoryMathGame';
import { NumberNinjaGame } from './games/NumberNinjaGame';
import { motion } from 'framer-motion';
import type { StudentProfile } from '../types';

interface QuickGamesScreenProps {
    onBack: () => void;
    studentProfile?: StudentProfile | null;
}

export const QuickGamesScreen: React.FC<QuickGamesScreenProps> = ({ onBack, studentProfile }) => {

    const games = [
        { id: 'speed-math', title: 'Cálculo Veloz', description: 'Resuelve la mayor cantidad de operaciones en 60 segundos.', icon: '⚡' },
        { id: 'memory-math', title: 'Memoria Matemática', description: 'Encuentra las parejas de la operación y su resultado.', icon: '🧩' },
        { id: 'number-ninja', title: 'Ninja de Números', description: 'Corta los números pares e ignora los impares.', icon: '🥷' }
    ];

    const [activeGame, setActiveGame] = useState<string | null>(null);

    if (activeGame === 'speed-math') {
        return <SpeedMathGame studentProfile={studentProfile} onBack={() => setActiveGame(null)} />;
    }
    
    if (activeGame === 'memory-math') {
        return <MemoryMathGame onBack={() => setActiveGame(null)} />;
    }

    if (activeGame === 'number-ninja') {
        return <NumberNinjaGame onBack={() => setActiveGame(null)} />;
    }

    if (activeGame) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-xl text-white my-8 max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold mb-4">{games.find(g => g.id === activeGame)?.title}</h2>
                <div className="text-6xl mb-8 animate-bounce">{games.find(g => g.id === activeGame)?.icon}</div>
                <p className="text-xl mb-8 text-center max-w-md">
                    ¡El minijuego interactivo está en construcción! Muy pronto podrás jugar y conseguir puntos extra.
                </p>
                <Button onClick={() => setActiveGame(null)} variant="primary">Volver a los Juegos</Button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <h2 className="text-4xl font-black text-slate-800 dark:text-slate-100 text-center mb-10">Juegos Rápidos 🕹️</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map(game => (
                    <Card key={game.id} className="text-center flex flex-col items-center p-8 border-t-8 border-t-indigo-500 hover:scale-105 transition-transform cursor-pointer shadow-xl" onClick={() => setActiveGame(game.id)}>
                        <div className="text-7xl mb-6 bg-slate-100 dark:bg-slate-800 w-32 h-32 flex items-center justify-center rounded-full shadow-inner">{game.icon}</div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3 leading-tight">{game.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 flex-grow text-center text-sm mb-6">{game.description}</p>
                        <Button className="mt-auto w-full text-lg py-3" onClick={(e) => { e.stopPropagation(); setActiveGame(game.id); }}>Jugar Ahora</Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};
