import React, { useState } from 'react';
import type { Question, CategoryId, AppTaxonomy, LessonContent } from '../../types';
import { Button } from '../common/Button';

interface QuestionsPanelProps {
    questions: Record<CategoryId, Record<number, Question[]>>;
    taxonomy: AppTaxonomy;
    lessons: LessonContent[];
    onChange: (q: Record<CategoryId, Record<number, Question[]>>) => void;
}

export const QuestionsPanel: React.FC<QuestionsPanelProps> = ({ questions, taxonomy, lessons, onChange }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>(taxonomy.categories[0]?.id || '');
    const [selectedLevel, setSelectedLevel] = useState<number>(1);
    
    // We'll just manage the list of questions for the selected category and level
    const currentQuestions = questions[selectedCategory]?.[selectedLevel] || [];

    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

    const handleAdd = () => {
        setEditingIndex(currentQuestions.length);
        setEditingQuestion({
            type: 'mcq',
            question: '',
            options: ['', '', ''],
            answer: '',
            hints: [''],
            explanation: ''
        } as Question);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingQuestion || editingIndex === null) return;
        
        const newQuestions = [...currentQuestions];
        newQuestions[editingIndex] = editingQuestion;

        const updatedData = { ...questions };
        if (!updatedData[selectedCategory]) updatedData[selectedCategory] = {};
        updatedData[selectedCategory][selectedLevel] = newQuestions;
        
        onChange(updatedData);
        setEditingQuestion(null);
        setEditingIndex(null);
    };

    const handleDelete = (index: number) => {
        if(confirm("¿Seguro que deseas eliminar esta pregunta?")) {
            const newQuestions = currentQuestions.filter((_, i) => i !== index);
            const updatedData = { ...questions };
            updatedData[selectedCategory][selectedLevel] = newQuestions;
            onChange(updatedData);
        }
    };

    const isMCQ = editingQuestion?.type === 'mcq' || editingQuestion?.type === 'math_mcq' || editingQuestion?.type === 'image_mcq' || editingQuestion?.type === 'choose_operation';

    if (editingQuestion) {
        return (
            <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow space-y-4 overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xl dark:text-white">Formulario de Pregunta</h3>
                    <Button variant="secondary" onClick={() => {setEditingQuestion(null); setEditingIndex(null)}}>Cancelar</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Lección Asociada (Opcional)</label>
                        <select value={editingQuestion.lessonId || ''} onChange={e => setEditingQuestion({...editingQuestion, lessonId: e.target.value || undefined})} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                            <option value="">Ninguna (General)</option>
                            {lessons.map(l => <option key={l.id} value={l.id}>{l.title} (ID: {l.id})</option>)}
                        </select>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo de Pregunta</label>
                        <select required value={editingQuestion.type} onChange={e => {
                            const newType = e.target.value as any;
                            // Initialize default fields for new types to avoid crashes
                            let newQ = {...editingQuestion, type: newType};
                            if (newType === 'match-pairs' && !('pairs' in newQ)) newQ = {...newQ, title: '', pairs: [{term: '', definition: ''}]} as any;
                            if (newType === 'fill-in-the-blanks' && !('textWithBlanks' in newQ)) newQ = {...newQ, title: '', textWithBlanks: '', blanks: []} as any;
                            if (newType === 'fill-in-the-text' && !('textWithInputs' in newQ)) newQ = {...newQ, title: '', textWithInputs: '', correctAnswers: []} as any;
                            if (newType === 'number-line' && !('min' in newQ)) newQ = {...newQ, title: '', min: 0, max: 10, items: []} as any;
                            if (newType === 'choose-the-operation' && !('problems' in newQ)) newQ = {...newQ, title: '', problems: []} as any;
                            setEditingQuestion(newQ);
                        }} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                            <option value="mcq">Selecciones Múltiples (MCQ)</option>
                            <option value="input">Entrada de Texto Libre (Input)</option>
                            <option value="match-pairs">Parear (Match Pairs)</option>
                            <option value="fill-in-the-blanks">Rellenar Huecos (Opciones)</option>
                            <option value="fill-in-the-text">Rellenar Texto (Entrada Libre)</option>
                            <option value="number-line">Línea Numérica</option>
                            <option value="choose-the-operation">Elegir Operación (+, -, x, ÷)</option>
                        </select>
                    </div>

                    {(editingQuestion.type === 'mcq' || editingQuestion.type === 'input') ? (
                        <>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Pregunta Principal</label>
                                <textarea required value={(editingQuestion as any).question || ''} onChange={e => setEditingQuestion({...editingQuestion, question: e.target.value})} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                            </div>

                            {isMCQ && (
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Opciones</label>
                                    {((editingQuestion as any).options || []).map((opt: any, i: number) => (
                                        <div key={i} className="flex gap-2">
                                             <input value={typeof opt === 'string' ? opt : opt.text} onChange={e => {
                                                 const newOpts = [...((editingQuestion as any).options||[])];
                                                 newOpts[i] = typeof newOpts[i] === 'string' ? e.target.value : { ...newOpts[i], text: e.target.value };
                                                 setEditingQuestion({...editingQuestion, options: newOpts} as any);
                                             }} className="flex-1 p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder={`Opción ${i+1}`} />
                                             <button type="button" onClick={() => {
                                                 const newOpts = [...((editingQuestion as any).options||[])];
                                                 newOpts.splice(i, 1);
                                                 setEditingQuestion({...editingQuestion, options: newOpts} as any);
                                             }} className="px-3 bg-red-100 text-red-600 rounded">X</button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => setEditingQuestion({...editingQuestion, options: [...((editingQuestion as any).options||[]), '']} as any)} className="text-sm text-blue-500 font-bold">+ Añadir opción</button>
                                </div>
                            )}

                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">URL de Imagen (Opcional)</label>
                                <input type="url" value={(editingQuestion as any).imageUrl || ''} onChange={e => setEditingQuestion({...editingQuestion, imageUrl: e.target.value} as any)} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="https://ejemplo.com/imagen.png" />
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Respuesta Correcta</label>
                                <input required value={(editingQuestion as any).answer || ''} onChange={e => setEditingQuestion({...editingQuestion, answer: e.target.value} as any)} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="Debe coincidir con una de las opciones si es MCQ" />
                            </div>
                        </>
                    ) : (
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Configuración Avanzada (JSON)</label>
                            <p className="text-xs text-slate-500 mb-2">Edita las propiedades específicas ({editingQuestion.type}) en formato JSON. Mantén el tipo y los id intactos.</p>
                            <textarea 
                                rows={8} 
                                value={JSON.stringify(editingQuestion, null, 2)} 
                                onChange={e => {
                                    try {
                                        const parsed = JSON.parse(e.target.value);
                                        setEditingQuestion(parsed);
                                    } catch (err) {
                                        // Ignore Invalid JSON while typing
                                    }
                                }} 
                                className="w-full p-2 border rounded font-mono text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" 
                            />
                        </div>
                    )}

                    <div className="col-span-1 md:col-span-2 space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Pistas (Hints)</label>
                        {(editingQuestion.hints || []).map((hint, i) => (
                            <div key={i} className="flex gap-2">
                                    <input value={hint} onChange={e => {
                                        const newHints = [...(editingQuestion.hints||[])];
                                        newHints[i] = e.target.value;
                                        setEditingQuestion({...editingQuestion, hints: newHints});
                                    }} className="flex-1 p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder={`Pista ${i+1} (Emoji incluido)`} />
                                    <button type="button" onClick={() => {
                                        const newHints = [...(editingQuestion.hints||[])];
                                        newHints.splice(i, 1);
                                        setEditingQuestion({...editingQuestion, hints: newHints});
                                    }} className="px-3 bg-red-100 text-red-600 rounded">X</button>
                            </div>
                        ))}
                        <button type="button" onClick={() => setEditingQuestion({...editingQuestion, hints: [...(editingQuestion.hints||[]), '']})} className="text-sm text-green-500 font-bold">+ Añadir pista</button>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Explicación (Feedback al fallar)</label>
                        <textarea value={editingQuestion.explanation || ''} onChange={e => setEditingQuestion({...editingQuestion, explanation: e.target.value})} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                    </div>
                </div>
                
                <div className="flex justify-end pt-4">
                    <Button type="submit" variant="primary">Guardar Pregunta</Button>
                </div>
            </form>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex gap-4 w-full sm:w-auto overflow-x-auto">
                    <div className="flex flex-col flex-shrink-0">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Categoría</label>
                        <select 
                            className="p-2 border rounded bg-slate-50 dark:bg-slate-900 dark:text-white dark:border-slate-600 min-w-[150px]"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {taxonomy.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col flex-shrink-0">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Nivel</label>
                        <select 
                            className="p-2 border rounded bg-slate-50 dark:bg-slate-900 dark:text-white dark:border-slate-600 min-w-[100px]"
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(parseInt(e.target.value))}
                        >
                            {[1, 2, 3].map(l => <option key={l} value={l}>Nivel {l}</option>)}
                        </select>
                    </div>
                </div>
                <Button variant="special" onClick={handleAdd}>+ Añadir Pregunta</Button>
            </div>

            <div className="overflow-x-auto flex-1 bg-white dark:bg-slate-800 rounded-lg shadow">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 dark:bg-slate-700">
                        <tr>
                            <th className="p-3 border-b dark:border-slate-600 dark:text-white font-bold w-12 text-center">#</th>
                            <th className="p-3 border-b dark:border-slate-600 dark:text-white font-bold">Pregunta</th>
                            <th className="p-3 border-b dark:border-slate-600 dark:text-white font-bold w-48">Lección</th>
                            <th className="p-3 border-b dark:border-slate-600 dark:text-white font-bold w-32">Tipo</th>
                            <th className="p-3 border-b dark:border-slate-600 dark:text-white font-bold text-right w-40">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentQuestions.map((question, index) => (
                            <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="p-3 border-b dark:border-slate-700 dark:text-slate-400 font-bold text-center">{index + 1}</td>
                                <td className="p-3 border-b dark:border-slate-700 dark:text-slate-300 font-medium truncate max-w-xs" title={question.question}>{question.question}</td>
                                <td className="p-3 border-b dark:border-slate-700 dark:text-slate-400 text-xs truncate max-w-[150px]" title={question.lessonId || 'General'}>{question.lessonId ? lessons.find(l => l.id === question.lessonId)?.title || question.lessonId : 'General'}</td>
                                <td className="p-3 border-b dark:border-slate-700 dark:text-slate-400 text-sm">{question.type}</td>
                                <td className="p-3 border-b dark:border-slate-700 text-right space-x-2">
                                    <button onClick={() => {setEditingIndex(index); setEditingQuestion(question)}} className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-bold">Editar</button>
                                    <button onClick={() => handleDelete(index)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-bold">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                        {currentQuestions.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">No hay preguntas para esta categoría y nivel.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
