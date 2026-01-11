import React from 'react';
import { playClickSound } from '../../utils/sounds';

interface CardProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    // FIX: Added style prop to allow for inline styles, used for animations.
    style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, onClick, className = '', style }) => {
    const cursorClass = onClick ? 'cursor-pointer' : '';
    const hoverClass = onClick ? 'hover:transform hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02]' : '';
    const focusClass = onClick ? 'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2' : '';

    const handleClick = () => {
        if (onClick) {
            playClickSound();
            onClick();
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (onClick && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            playClickSound();
            onClick();
        }
    };

    return (
        <div 
            className={`group relative overflow-hidden backdrop-blur-sm bg-slate-50/60 dark:bg-slate-700/40 p-4 rounded-xl shadow-lg dark:shadow-slate-900/50 transition-all duration-300 ease-in-out border border-slate-200/80 dark:border-slate-600/50 ${cursorClass} ${hoverClass} ${focusClass} ${className}`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            style={style}
        >
            <span className="absolute inset-0 -translate-x-full transform skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-full"></span>
            {children}
        </div>
    );
};