import React, { useState, useEffect } from 'react';
import type { StudentProfile, GameState } from '../types';
import { loadGameStateForUser } from '../utils/gameState';
import { StudentDashboard } from './StudentDashboard';
import { playClickSound } from '../utils/sounds';

interface DashboardModalProps {
    user: StudentProfile;
    onClose: () => void;
}

export const DashboardModal: React.FC<DashboardModalProps> = ({ user, onClose }) => {
    const [gameState, setGameState] = useState<GameState | null>(null);

    useEffect(() => {
        setGameState(loadGameStateForUser(user.id));
    }, [user]);

    const handleOverlayClick = () => {
        playClickSound();
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            onClick={handleOverlayClick}
        >
            <div 
                className="bg-white/95 dark:bg-slate-800/95 p-4 sm:p-6 rounded-2xl shadow-2xl w-full max-w-5xl m-4 animate-modal-scale-in flex flex-col h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex-shrink-0 flex justify-between items-center border-b-2 border-slate-200 dark:border-slate-700 pb-3 mb-4">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Panel de Progreso de {user.name}</h2>
                     <button onClick={handleOverlayClick} className="text-3xl text-slate-500 hover:text-red-500 transition-colors">&times;</button>
                </header>
                <main className="flex-grow overflow-y-auto pr-2">
                    {gameState ? (
                        <StudentDashboard studentProfile={user} gameState={gameState} />
                    ) : (
                        <p>Cargando datos...</p>
                    )}
                </main>
            </div>
        </div>
    );
};