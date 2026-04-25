import React, { useState } from 'react';
import type { LessonContent, AppTaxonomy } from '../../types';
import { Button } from '../common/Button';

interface LessonsPanelProps {
    lessons: LessonContent[];
    taxonomy: AppTaxonomy;
    onChange: (lessons: LessonContent[]) => void;
}

export const LessonsPanel: React.FC<LessonsPanelProps> = ({ lessons, taxonomy, onChange }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [editingLesson, setEditingLesson] = useState<LessonContent | null>(null);

    const filteredLessons = selectedCategory ? lessons.filter(l => l.categoryId === selectedCategory) : lessons;

    const handleAdd = () => {
        setEditingLesson({
            id: 'nueva_leccion_' + Date.now(),
            title: 'Nueva Lección',
            period: 1,
            categoryId: selectedCategory || (taxonomy.categories[0]?.id ?? 'default'),
            theory: '',
            practice: {}
        });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingLesson) return;
        
        const exists = lessons.find(l => l.id === editingLesson.id);
        if (exists) {
            onChange(lessons.map(l => l.id === editingLesson.id ? editingLesson : l));
        } else {
            onChange([...lessons, editingLesson]);
        }
        setEditingLesson(null);
    };

    const handleDelete = (id: string) => {
        if(confirm("¿Seguro que deseas eliminar esta lección?")) {
            onChange(lessons.filter(l => l.id !== id));
        }
    };

    if (editingLesson) {
        return (
            <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xl dark:text-white">Formulario de Lección</h3>
                    <Button variant="secondary" onClick={() => setEditingLesson(null)}>Cancelar</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">ID (Único)</label>
                        <input required value={editingLesson.id} onChange={e => setEditingLesson({...editingLesson, id: e.target.value})} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Título</label>
                        <input required value={editingLesson.title} onChange={e => setEditingLesson({...editingLesson, title: e.target.value})} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                    </div>
                    <div>
                         <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
                         <select required value={editingLesson.categoryId} onChange={e => setEditingLesson({...editingLesson, categoryId: e.target.value})} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                             {taxonomy.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                         </select>
                    </div>
                    <div>
                         <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Periodo (Trimestre)</label>
                         <input required type="number" min="1" max="10" value={editingLesson.period} onChange={e => setEditingLesson({...editingLesson, period: parseInt(e.target.value)})} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                    </div>
                </div>

                <div>
                     <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Teoría (Markdown)</label>
                     <textarea rows={6} value={editingLesson.theory} onChange={e => setEditingLesson({...editingLesson, theory: e.target.value})} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="Escribe el contenido teórico de la lección..." />
                </div>
                
                <div className="flex justify-end pt-4">
                    <Button type="submit" variant="primary">Guardar Lección</Button>
                </div>
            </form>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <select 
                    className="p-2 border rounded bg-white dark:bg-slate-800 dark:text-white dark:border-slate-600 w-full sm:w-auto min-w-[200px]"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">Todas las categorías</option>
                    {taxonomy.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <Button variant="special" onClick={handleAdd}>+ Añadir Lección</Button>
            </div>

            <div className="overflow-x-auto flex-1 bg-white dark:bg-slate-800 rounded-lg shadow">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 dark:bg-slate-700">
                        <tr>
                            <th className="p-3 border-b dark:border-slate-600 dark:text-white font-bold">Título</th>
                            <th className="p-3 border-b dark:border-slate-600 dark:text-white font-bold">Categoría</th>
                            <th className="p-3 border-b dark:border-slate-600 dark:text-white font-bold">Periodo</th>
                            <th className="p-3 border-b dark:border-slate-600 dark:text-white font-bold text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLessons.map(lesson => (
                            <tr key={lesson.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="p-3 border-b dark:border-slate-700 dark:text-slate-300 font-medium">{lesson.title}</td>
                                <td className="p-3 border-b dark:border-slate-700 dark:text-slate-400 text-sm">{taxonomy.categories.find(c => c.id === lesson.categoryId)?.name || lesson.categoryId}</td>
                                <td className="p-3 border-b dark:border-slate-700 dark:text-slate-400 text-sm">P. {lesson.period}</td>
                                <td className="p-3 border-b dark:border-slate-700 text-right space-x-2">
                                    <button onClick={() => setEditingLesson(lesson)} className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-bold">Editar</button>
                                    <button onClick={() => handleDelete(lesson.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-bold">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                        {filteredLessons.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500 dark:text-slate-400">No se encontraron lecciones.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
