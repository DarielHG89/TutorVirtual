import React, { forwardRef } from 'react';
import { playClickSound } from '../../utils/sounds';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'special' | 'warning';
    className?: string;
    disableSound?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, variant = 'primary', className = '', onClick, disableSound, ...props }, ref) => {
    // Base classes for the glassmorphism effect, layout, and transitions.
    // 'group' enables hover effects on children. 'overflow-hidden' contains the reflection animation.
    const baseClasses = 'group relative px-6 py-3 text-base font-black uppercase tracking-wider rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none disabled:pointer-events-none focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 backdrop-blur-md border dark:shadow-black/40 overflow-hidden';

    // Variant classes control the semi-transparent background colors and text for the glass effect.
    const variantClasses = {
        primary: 'bg-blue-400/40 border-blue-500/30 text-blue-800 hover:bg-blue-400/50 dark:bg-blue-500/40 dark:border-blue-400/30 dark:text-blue-200 dark:hover:bg-blue-500/50 focus-visible:ring-blue-500/50',
        secondary: 'bg-purple-400/40 border-purple-500/30 text-purple-800 hover:bg-purple-400/50 dark:bg-purple-500/40 dark:border-purple-400/30 dark:text-purple-200 dark:hover:bg-purple-500/50 focus-visible:ring-purple-500/50',
        special: 'bg-green-400/40 border-green-500/30 text-green-800 hover:bg-green-400/50 dark:bg-green-500/40 dark:border-green-400/30 dark:text-green-200 dark:hover:bg-green-500/50 focus-visible:ring-green-500/50',
        warning: 'bg-yellow-400/40 border-yellow-500/30 text-yellow-800 hover:bg-yellow-400/50 dark:bg-yellow-400/40 dark:border-yellow-300/30 dark:text-yellow-200 dark:hover:bg-yellow-400/50 focus-visible:ring-orange-500/50',
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disableSound) {
            playClickSound();
        }
        if (onClick) {
            onClick(e);
        }
    };
    
    return (
        <button ref={ref} className={`${baseClasses} ${variantClasses[variant]} ${className}`} onClick={handleClick} {...props}>
            {/* Reflection span: animates across the button on group hover */}
            <span className="absolute inset-0 -translate-x-full transform skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full"></span>
            {/* Content span: ensures text is above the reflection */}
            <span className="relative z-10">{children}</span>
        </button>
    );
});

Button.displayName = 'Button';