import React, { useState } from 'react';
import type { AppTaxonomy } from '../../types';
import { Button } from '../common/Button';

interface TaxonomyPanelProps {
    taxonomy: AppTaxonomy;
    onChange: (t: AppTaxonomy) => void;
}

export const TaxonomyPanel: React.FC<TaxonomyPanelProps> = ({ taxonomy, onChange }) => {
    const [selectedGrade, setSelectedGrade] = useState<string | null>(taxonomy.grades[0]?.id || null);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    const [editingType, setEditingType] = useState<'grade' | 'subject' | 'category' | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    const handleSaveEdit = () => {
        if (!editValue.trim() || !editingType) {
            setEditingType(null);
            return;
        }

        const t = { ...taxonomy };
        const safeId = editValue.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        if (editingType === 'grade') {
            if (editingId) {
                t.grades = t.grades.map(g => g.id === editingId ? { ...g, name: editValue } : g);
            } else {
                t.grades = [...t.grades, { id: 'grado-' + safeId + '-' + Date.now().toString().slice(-4), name: editValue }];
            }
        } else if (editingType === 'subject' && selectedGrade) {
            if (editingId) {
                t.subjects = t.subjects.map(s => s.id === editingId ? { ...s, name: editValue } : s);
            } else {
                t.subjects = [...t.subjects, { id: 'asignatura-' + safeId + '-' + Date.now().toString().slice(-4), name: editValue, gradeId: selectedGrade }];
            }
        } else if (editingType === 'category' && selectedSubject) {
            if (editingId) {
                t.categories = t.categories.map(c => c.id === editingId ? { ...c, name: editValue } : c);
            } else {
                t.categories = [...t.categories, { id: editValue.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') + '_' + Date.now().toString().slice(-4), name: editValue, subjectId: selectedSubject }];
            }
        }

        onChange(t);
        setEditingType(null);
        setEditingId(null);
        setEditValue('');
    };

    const handleDelete = (type: 'grade' | 'subject' | 'category', id: string) => {
        if (!confirm("¿Eliminar este elemento?")) return;
        const t = { ...taxonomy };
        if (type === 'grade') t.grades = t.grades.filter(g => g.id !== id);
        if (type === 'subject') t.subjects = t.subjects.filter(s => s.id !== id);
        if (type === 'category') t.categories = t.categories.filter(c => c.id !== id);
        onChange(t);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 h-full">
            {/* Action Modal (Inline) */}
            {editingType && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="font-bold text-lg mb-4 dark:text-white">
                            {editingId ? 'Editar' : 'Añadir nuevo'}
                        </h3>
                        <input
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                            className="w-full p-2 border rounded mb-4 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            placeholder="Nombre..."
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="secondary" onClick={() => setEditingType(null)}>Cancelar</Button>
                            <Button variant="primary" onClick={handleSaveEdit}>Guardar</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Grades Column */}
            <div className="flex-1 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">1. Grados Escolares</h3>
                    <button onClick={() => { setEditingType('grade'); setEditingId(null); setEditValue(''); }} className="text-xl text-blue-500 hover:text-blue-600 font-bold">+</button>
                </div>
                <div className="space-y-2 overflow-auto flex-1">
                    {taxonomy.grades.map(g => (
                        <div 
                            key={g.id} 
                            onClick={() => { setSelectedGrade(g.id); setSelectedSubject(null); }}
                            className={`p-3 rounded cursor-pointer transition-colors border group ${selectedGrade === g.id ? 'bg-blue-100 border-blue-500 font-bold dark:bg-blue-900/30' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-slate-700 dark:border-slate-600'}`}
                        >
                            <div className="flex justify-between items-center">
                                <span>{g.name}</span>
                                <div className="hidden group-hover:flex gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); setEditingType('grade'); setEditingId(g.id); setEditValue(g.name); }} className="text-xs text-blue-600">✏️</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete('grade', g.id); }} className="text-xs text-red-600">🗑️</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {taxonomy.grades.length === 0 && <p className="text-sm text-slate-400">No hay grados. Añade uno.</p>}
                </div>
            </div>

            {/* Subjects Column */}
            <div className="flex-1 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">2. Asignaturas</h3>
                    <button onClick={() => { setEditingType('subject'); setEditingId(null); setEditValue(''); }} className="text-xl text-blue-500 hover:text-blue-600 font-bold" disabled={!selectedGrade}>+</button>
                </div>
                <div className="space-y-2 overflow-auto flex-1">
                    {!selectedGrade && <p className="text-sm text-slate-400">Selecciona un grado para ver asignaturas.</p>}
                    {selectedGrade && taxonomy.subjects.filter(s => s.gradeId === selectedGrade).map(s => (
                        <div 
                            key={s.id} 
                            onClick={() => setSelectedSubject(s.id)}
                            className={`p-3 rounded cursor-pointer transition-colors border group ${selectedSubject === s.id ? 'bg-purple-100 border-purple-500 font-bold dark:bg-purple-900/30' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-slate-700 dark:border-slate-600'}`}
                        >
                            <div className="flex justify-between items-center">
                                <span>{s.name}</span>
                                <div className="hidden group-hover:flex gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); setEditingType('subject'); setEditingId(s.id); setEditValue(s.name); }} className="text-xs text-blue-600">✏️</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete('subject', s.id); }} className="text-xs text-red-600">🗑️</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories Column */}
            <div className="flex-1 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">3. Categorías (Temas)</h3>
                    <button onClick={() => { setEditingType('category'); setEditingId(null); setEditValue(''); }} className="text-xl text-blue-500 hover:text-blue-600 font-bold" disabled={!selectedSubject}>+</button>
                </div>
                <div className="space-y-2 overflow-auto flex-1">
                    {!selectedSubject && <p className="text-sm text-slate-400">Selecciona una asignatura para ver categorías.</p>}
                    {selectedSubject && taxonomy.categories.filter(c => c.subjectId === selectedSubject).map(c => (
                        <div 
                            key={c.id} 
                            className="p-3 rounded bg-slate-50 border border-slate-200 dark:bg-slate-700 dark:border-slate-600 flex justify-between items-start flex-col sm:flex-row group"
                        >
                            <div className="flex-grow">
                                <span>{c.name}</span>
                                <div className="text-xs text-slate-400 font-mono mt-1 w-full truncate">ID: {c.id}</div>
                            </div>
                            <div className="hidden group-hover:flex gap-2 self-start mt-2 sm:mt-0">
                                <button onClick={() => { setEditingType('category'); setEditingId(c.id); setEditValue(c.name); }} className="text-xs text-blue-600">✏️</button>
                                <button onClick={() => handleDelete('category', c.id)} className="text-xs text-red-600">🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
