
import React, { useMemo, useEffect, useState } from 'react';

export type BackgroundTheme = 'default' | 'math' | 'geometry' | 'measurements';

interface DynamicBackgroundProps {
    theme: BackgroundTheme;
}

// Configuración de temas: Símbolos y colores enriquecidos
const THEME_CONFIG = {
    math: {
        symbols: ['+', '-', '×', '÷', '=', '1', '2', '3', '4', '5', '8', '9', 'π', '√', '%', '∞', 'x', 'y', 'z', '≠', '0'],
        colors: ['#fbbf24', '#60a5fa', '#f87171', '#a78bfa', '#34d399', '#f472b6'], 
        baseColor: 'bg-slate-900',
        overlayColor: 'bg-slate-900/30'
    },
    geometry: {
        symbols: ['△', '◯', '□', '⬡', '📐', '📏', '◈', '⬠', '▱', '∠', '∥', '⟂', '✏️', '🔷', '🔴'],
        colors: ['#14b8a6', '#3b82f6', '#6366f1', '#ec4899', '#8b5cf6', '#0ea5e9'],
        baseColor: 'bg-slate-50 dark:bg-slate-900',
        overlayColor: 'bg-teal-50/40 dark:bg-slate-900/60'
    },
    measurements: {
        symbols: ['⚖️', '🕰️', '🌡️', '⏲️', '🥛', '📏', 'kg', 'L', 'm', 'cm', 'g', '°C', '💰', '🏁'],
        colors: ['#f97316', '#84cc16', '#06b6d4', '#f43f5e', '#eab308', '#d946ef'],
        baseColor: 'bg-orange-50 dark:bg-slate-800',
        overlayColor: 'bg-orange-100/30 dark:bg-slate-900/50'
    },
    default: {
        symbols: ['✨', '🌟', '🎈', '🎨', '🚀', '💡', '🧩', '🎵', '⭐', '🎯', '🏆', '🌈', '🦄'],
        colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444'],
        baseColor: 'bg-slate-50 dark:bg-slate-900',
        overlayColor: 'bg-white/50 dark:bg-slate-900/50'
    }
};

// Función para generar partículas con más propiedades aleatorias
const generateParticles = (count: number, symbols: string[], colors: string[], minDuration: number, maxDuration: number) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        left: Math.random() * 100, // Posición horizontal %
        duration: Math.random() * (maxDuration - minDuration) + minDuration,
        delay: -(Math.random() * maxDuration), // Iniciar en punto aleatorio
        animationName: Math.random() > 0.5 ? 'floatA' : 'floatB', // Variedad de movimiento
        sizeVariance: Math.random() * 0.5 + 0.75, // Factor de escala aleatorio (0.75x a 1.25x)
    }));
};

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ theme }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Capturar movimiento del mouse para efecto parallax
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: (e.clientY / window.innerHeight) * 2 - 1,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const activeConfig = THEME_CONFIG[theme] || THEME_CONFIG.default;

    // Generar capas de partículas
    const layers = useMemo(() => {
        const { symbols, colors } = activeConfig;
        
        // Capa 1: Fondo (Lejana) - Pequeños, Lentos, Muchos, Borrosos
        const back = generateParticles(20, symbols, colors, 45, 70).map(p => ({
            ...p, 
            baseSize: 14, 
            opacity: 0.15, 
            blur: '2px'
        }));

        // Capa 2: Medio (Normal) - Medianos
        const mid = generateParticles(12, symbols, colors, 30, 50).map(p => ({
            ...p, 
            baseSize: 24, 
            opacity: 0.3, 
            blur: '0.5px'
        }));

        // Capa 3: Frente (Cercana) - Grandes, Rápidos, Pocos
        const front = generateParticles(7, symbols, colors, 20, 35).map(p => ({
            ...p, 
            baseSize: 45, 
            opacity: 0.5, 
            blur: '0px'
        }));

        return { back, mid, front };
    }, [activeConfig]);

    const renderLayer = (items: typeof layers.back, depth: number) => {
        const moveX = mousePos.x * depth * 25; 
        const moveY = mousePos.y * depth * 25; 

        return items.map(item => (
            <div
                key={item.id}
                className="absolute will-change-transform transition-transform duration-300 ease-out"
                style={{
                    left: `${item.left}%`,
                    top: '110%',
                    transform: `translate(${moveX}px, ${moveY}px)`
                }}
            >
                <div 
                    style={{
                        fontSize: `${item.baseSize * item.sizeVariance}px`,
                        color: item.color,
                        opacity: item.opacity,
                        filter: `blur(${item.blur})`,
                        textShadow: theme === 'math' ? '0 0 12px rgba(255,255,255,0.4)' : 'none',
                        animation: `${item.animationName} ${item.duration}s infinite linear`,
                        animationDelay: `${item.delay}s`
                    }}
                >
                    {item.symbol}
                </div>
            </div>
        ));
    };

    // Estrellas fugaces mejoradas (Solo para tema 'math')
    const shootingStars = useMemo(() => {
        if (theme !== 'math') return null;
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute h-[2px] bg-gradient-to-l from-transparent via-blue-100 to-transparent opacity-0 rounded-full"
                        style={{
                            width: Math.random() * 100 + 100 + 'px',
                            top: `${Math.random() * 70}%`,
                            left: `${Math.random() * 100}%`,
                            transform: 'rotate(-45deg)',
                            boxShadow: '0 0 15px 2px rgba(255, 255, 255, 0.6)',
                            animation: `shootingStar ${4 + Math.random() * 5}s linear infinite ${Math.random() * 15}s`
                        }}
                    />
                ))}
            </div>
        );
    }, [theme]);

    const gridPattern = theme === 'geometry' ? (
        <div 
            className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{
                backgroundImage: `
                    linear-gradient(to right, #0ea5e9 1px, transparent 1px),
                    linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px'
            }}
        />
    ) : null;

    return (
        <div className={`fixed inset-0 -z-10 w-full h-full overflow-hidden pointer-events-none transition-colors duration-1000 ease-in-out ${activeConfig.baseColor}`}>
            <style>
                {`
                    /* Animación A: Oscilación suave y rotación horaria */
                    @keyframes floatA {
                        0% { transform: translate(0, 0) rotate(0deg); }
                        25% { transform: translate(15px, -30vh) rotate(45deg); }
                        50% { transform: translate(-10px, -60vh) rotate(180deg); }
                        75% { transform: translate(10px, -90vh) rotate(270deg); }
                        100% { transform: translate(0, -120vh) rotate(360deg); }
                    }
                    
                    /* Animación B: Oscilación opuesta y rotación anti-horaria */
                    @keyframes floatB {
                        0% { transform: translate(0, 0) rotate(0deg); }
                        25% { transform: translate(-15px, -30vh) rotate(-45deg); }
                        50% { transform: translate(10px, -60vh) rotate(-180deg); }
                        75% { transform: translate(-5px, -90vh) rotate(-270deg); }
                        100% { transform: translate(0, -120vh) rotate(-360deg); }
                    }

                    @keyframes shootingStar {
                        0% { transform: translateX(0) translateY(0) rotate(-45deg) scale(0.5); opacity: 0; }
                        10% { opacity: 0.8; }
                        20% { opacity: 0; }
                        100% { transform: translateX(-800px) translateY(800px) rotate(-45deg) scale(1); opacity: 0; }
                    }
                `}
            </style>
            
            {gridPattern}

            <div className="absolute inset-0 z-0">{renderLayer(layers.back, 0.2)}</div>
            <div className="absolute inset-0 z-0">{renderLayer(layers.mid, 0.6)}</div>
            <div className="absolute inset-0 z-0">{renderLayer(layers.front, 1.2)}</div>

            {shootingStars}
            
            <div className={`absolute inset-0 w-full h-full transition-colors duration-1000 ease-in-out ${activeConfig.overlayColor}`} />
        </div>
    );
};
