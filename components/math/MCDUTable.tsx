import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Plus, Minus } from 'lucide-react';

interface MCDUTableProps {
    onValueChange?: (value: number) => void;
    initialValue?: number;
}

type ColumnKey = 'M' | 'C' | 'D' | 'U';

const COLUMNS: { key: ColumnKey; label: string; color: string; multiplier: number; description: string }[] = [
    { key: 'M', label: 'M', color: 'bg-amber-500', multiplier: 1000, description: 'Unidades de Millar' },
    { key: 'C', label: 'C', color: 'bg-blue-500', multiplier: 100, description: 'Centenas' },
    { key: 'D', label: 'D', color: 'bg-red-500', multiplier: 10, description: 'Decenas' },
    { key: 'U', label: 'U', color: 'bg-green-500', multiplier: 1, description: 'Unidades' },
];

export const MCDUTable: React.FC<MCDUTableProps> = ({ onValueChange, initialValue = 0 }) => {
    // Initialize units from initialValue
    const [counts, setCounts] = useState<Record<ColumnKey, number>>(() => {
        const val = Math.min(9999, Math.max(0, initialValue));
        return {
            M: Math.floor(val / 1000),
            C: Math.floor((val % 1000) / 100),
            D: Math.floor((val % 100) / 10),
            U: val % 10,
        };
    });

    const totalValue = counts.M * 1000 + counts.C * 100 + counts.D * 10 + counts.U;

    const updateCount = useCallback((key: ColumnKey, delta: number) => {
        setCounts(prev => {
            const nextValue = Math.max(0, Math.min(9, prev[key] + delta));
            if (nextValue === prev[key]) return prev;
            const newCounts = { ...prev, [key]: nextValue };
            const newValue = newCounts.M * 1000 + newCounts.C * 100 + newCounts.D * 10 + newCounts.U;
            onValueChange?.(newValue);
            return newCounts;
        });
    }, [onValueChange]);

    const reset = () => {
        setCounts({ M: 0, C: 0, D: 0, U: 0 });
        onValueChange?.(0);
    };

    return (
        <div id="mcdu-table-container" className="flex flex-col items-center gap-6 p-6 bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-700 shadow-2xl max-w-2xl mx-auto">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-white tracking-widest font-sans italic">TABLA MCDU</h2>
                <p className="text-slate-400 text-sm">Sistema de Posición Decimal</p>
            </div>

            {/* Display Number */}
            <div className="flex items-center justify-center p-4 bg-slate-950 rounded-2xl border border-blue-500/30 shadow-inner w-full">
                <div className="text-5xl font-mono font-bold tracking-tighter text-blue-400">
                    {totalValue.toLocaleString('es-CU')}
                </div>
            </div>

            {/* Main Table Layout */}
            <div className="grid grid-cols-4 gap-4 w-full h-80">
                {COLUMNS.map((col) => (
                    <div 
                        key={col.key} 
                        className="flex flex-col h-full bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden relative group"
                    >
                        {/* Header */}
                        <div className={`${col.color} p-2 text-center text-white font-black text-xl shadow-lg relative z-10`}>
                            {col.label}
                        </div>

                        {/* Interaction Area (Buckets) */}
                        <div 
                            className="flex-1 flex flex-col-reverse justify-start items-center p-3 gap-1 overflow-hidden cursor-pointer hover:bg-slate-700/30 transition-colors"
                            onClick={() => updateCount(col.key, 1)}
                        >
                            <AnimatePresence>
                                {[...Array(counts[col.key])].map((_, i) => (
                                    <motion.div
                                        key={`${col.key}-${i}`}
                                        initial={{ y: -100, scale: 0.5, opacity: 0 }}
                                        animate={{ y: 0, scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className={`w-full aspect-square max-h-[22px] ${col.color} rounded-full border-2 border-white/20 shadow-sm`}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Controls Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-2 flex justify-between items-center bg-gradient-to-t from-slate-900 to-transparent">
                            <button 
                                onClick={(e) => { e.stopPropagation(); updateCount(col.key, -1); }}
                                className="p-1 hover:bg-slate-700 rounded-lg text-slate-400 disabled:opacity-30"
                                disabled={counts[col.key] <= 0}
                            >
                                <Minus size={18} />
                            </button>
                            <span className="text-sm font-bold text-slate-300">{counts[col.key]}</span>
                            <button 
                                onClick={(e) => { e.stopPropagation(); updateCount(col.key, 1); }}
                                className="p-1 hover:bg-slate-700 rounded-lg text-slate-400 disabled:opacity-30"
                                disabled={counts[col.key] >= 9}
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Decomposition Info */}
            <div className="w-full space-y-3 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                <div className="flex flex-wrap justify-center gap-2 text-sm font-mono text-slate-300">
                    {COLUMNS.map((col, idx) => {
                        const val = counts[col.key] * col.multiplier;
                        if (val === 0 && counts[col.key] === 0) return null;
                        return (
                            <React.Fragment key={col.key}>
                                {idx > 0 && <span className="opacity-40">+</span>}
                                <span className={col.multiplier >= 1000 ? 'text-amber-400' : col.multiplier >= 100 ? 'text-blue-400' : col.multiplier >= 10 ? 'text-red-400' : 'text-green-400'}>
                                    {val.toLocaleString('es-CU')}
                                </span>
                            </React.Fragment>
                        );
                    })}
                    <span className="opacity-40">=</span>
                    <span className="font-bold text-white">{totalValue.toLocaleString('es-CU')}</span>
                </div>
                
                <div className="text-[10px] text-center text-slate-500 uppercase tracking-tighter">
                    {counts.M > 0 && `${counts.M} Unidades de Millar `}
                    {counts.C > 0 && `${counts.C} Centenas `}
                    {counts.D > 0 && `${counts.D} Decenas `}
                    {counts.U > 0 && `${counts.U} Unidades`}
                </div>
            </div>

            {/* Global Actions */}
            <button 
                onClick={reset}
                className="flex items-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-full font-bold transition-all active:scale-95 shadow-lg border border-slate-500/30"
            >
                <RotateCcw size={18} />
                RESETEAR
            </button>
        </div>
    );
};
