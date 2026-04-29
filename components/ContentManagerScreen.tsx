import React, { useState } from 'react';
import type { LessonContent, CategoryId, Question, AppTaxonomy } from '../types';
import { contentManager } from '../utils/contentManager';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { TaxonomyPanel } from './cms/TaxonomyPanel';
import { LessonsPanel } from './cms/LessonsPanel';
import { QuestionsPanel } from './cms/QuestionsPanel';

interface ContentManagerScreenProps {
    onBack: () => void;
}

export const ContentManagerScreen: React.FC<ContentManagerScreenProps> = ({ onBack }) => {
    // Structural state
    const [taxonomy, setTaxonomy] = useState<AppTaxonomy>(contentManager.getTaxonomy());
    const [lessons, setLessons] = useState<LessonContent[]>(contentManager.getLessons());
    const [questions, setQuestions] = useState<Record<CategoryId, Record<number, Question[]>>>(contentManager.getQuestions());
    
    // Raw JSON bindings
    const [lessonsText, setLessonsText] = useState(JSON.stringify(lessons, null, 2));
    const [questionsText, setQuestionsText] = useState(JSON.stringify(questions, null, 2));
    
    // UI state
    const [activeTab, setActiveTab] = useState<'taxonomy' | 'lessons' | 'questions' | 'raw_json'>('taxonomy');
    const [rawSubTab, setRawSubTab] = useState<'lessons' | 'questions'>('lessons');
    
    const [isTaxonomyCustomized, setIsTaxonomyCustomized] = useState(contentManager.isCustomized('taxonomy'));
    const [isLessonsCustomized, setIsLessonsCustomized] = useState(contentManager.isCustomized('lessons'));
    const [isQuestionsCustomized, setIsQuestionsCustomized] = useState(contentManager.isCustomized('questions'));
    
    const [viewSource, setViewSource] = useState<'local' | 'server'>(
        contentManager.isCustomized('taxonomy') || contentManager.isCustomized('lessons') || contentManager.isCustomized('questions') ? 'local' : 'server'
    );

    const handleSourceToggle = (newSource: 'local' | 'server') => {
        if (newSource === viewSource) return;
        
        if (newSource === 'server') {
            const defaults = contentManager.getOriginalDefaults();
            setTaxonomy(defaults.taxonomy);
            setLessons(defaults.lessons);
            setQuestions(defaults.questions);
            setLessonsText(JSON.stringify(defaults.lessons, null, 2));
            setQuestionsText(JSON.stringify(defaults.questions, null, 2));
        } else {
            setTaxonomy(contentManager.getTaxonomy());
            setLessons(contentManager.getLessons());
            setQuestions(contentManager.getQuestions());
            setLessonsText(JSON.stringify(contentManager.getLessons(), null, 2));
            setQuestionsText(JSON.stringify(contentManager.getQuestions(), null, 2));
        }
        setViewSource(newSource);
    };

    const handleSave = async () => {
        try {
            // Unify state if in raw mode
            let toSaveLessons = lessons;
            let toSaveQuestions = questions;

            if (activeTab === 'raw_json') {
                toSaveLessons = JSON.parse(lessonsText);
                toSaveQuestions = JSON.parse(questionsText);
                setLessons(toSaveLessons);
                setQuestions(toSaveQuestions);
            }

            await contentManager.saveTaxonomy(taxonomy, viewSource);
            await contentManager.saveLessons(toSaveLessons, viewSource);
            await contentManager.saveQuestions(toSaveQuestions, viewSource);
            
            // Update customization status
            setIsTaxonomyCustomized(contentManager.isCustomized('taxonomy'));
            setIsLessonsCustomized(contentManager.isCustomized('lessons'));
            setIsQuestionsCustomized(contentManager.isCustomized('questions'));

            alert(`Contenido guardado correctamente en ${viewSource === 'local' ? 'el almacenamiento LOCAL (Navegador)' : 'el SERVIDOR (Archivos persistentes)'}.`);
        } catch(e: any) {
            alert("Error al guardar. " + e.message);
        }
    };

    const handleReset = () => {
        if(confirm("¿Estás seguro de que quieres eliminar TODOS tus cambios locales y volver a los datos originales del sistema?")) {
            contentManager.resetToDefault();
            
            const defaults = contentManager.getOriginalDefaults();
            setTaxonomy(defaults.taxonomy);
            setLessons(defaults.lessons);
            setQuestions(defaults.questions);
            setLessonsText(JSON.stringify(defaults.lessons, null, 2));
            setQuestionsText(JSON.stringify(defaults.questions, null, 2));
            
            setIsTaxonomyCustomized(false);
            setIsLessonsCustomized(false);
            setIsQuestionsCustomized(false);
            
            setViewSource('server');
            console.log("Reset all local storage and state to server defaults.");
            alert("Aplicación restablecida a los valores originales.");
        }
    };

    const handleResetSection = (section: 'taxonomy' | 'lessons' | 'questions') => {
        if(confirm(`¿Deseas eliminar tus cambios locales de "${section === 'taxonomy' ? 'Estructura' : section === 'lessons' ? 'Lecciones' : 'Preguntas'}" y volver al original?`)) {
            contentManager.resetSection(section);
            
            const defaults = contentManager.getOriginalDefaults();
            if (section === 'taxonomy') {
                setTaxonomy(defaults.taxonomy);
                setIsTaxonomyCustomized(false);
                console.log("Taxonomy reset to defaults.");
            }
            if (section === 'lessons') {
                setLessons(defaults.lessons);
                setLessonsText(JSON.stringify(defaults.lessons, null, 2));
                setIsLessonsCustomized(false);
                console.log("Lessons reset to defaults.");
            }
            if (section === 'questions') {
                setQuestions(defaults.questions);
                setQuestionsText(JSON.stringify(defaults.questions, null, 2));
                setIsQuestionsCustomized(false);
                console.log("Questions reset to defaults.");
            }
            
            // Force view source to server if no more local customizations exist
            const stillCustomized = (section !== 'taxonomy' && contentManager.isCustomized('taxonomy')) ||
                                  (section !== 'lessons' && contentManager.isCustomized('lessons')) ||
                                  (section !== 'questions' && contentManager.isCustomized('questions'));
            
            if (!stillCustomized) {
                setViewSource('server');
            }
            
            alert("Los cambios locales de esta sección han sido eliminados.");
        }
    };

    const updateFromDefault = () => {
        const defTax = contentManager.getTaxonomy();
        const defLess = contentManager.getLessons();
        const defQues = contentManager.getQuestions();
        
        setTaxonomy(defTax);
        setLessons(defLess);
        setQuestions(defQues);
        setLessonsText(JSON.stringify(defLess, null, 2));
        setQuestionsText(JSON.stringify(defQues, null, 2));
        
        setIsTaxonomyCustomized(contentManager.isCustomized('taxonomy'));
        setIsLessonsCustomized(contentManager.isCustomized('lessons'));
        setIsQuestionsCustomized(contentManager.isCustomized('questions'));
    };

    const handleExport = () => {
        try {
            const dataToExport = activeTab === 'raw_json' ? { 
                taxonomy,
                lessons: JSON.parse(lessonsText), 
                questions: JSON.parse(questionsText) 
            } : {
                taxonomy,
                lessons,
                questions
            };
            const dataStr = JSON.stringify(dataToExport, null, 2);
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `contenidos_maestro_digital_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch(e) {
            alert("Repara los errores en el JSON antes de exportar.");
        }
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                const data = JSON.parse(text);
                
                if (data.lessons && data.questions) {
                    if (data.taxonomy) setTaxonomy(data.taxonomy);
                    setLessons(data.lessons);
                    setQuestions(data.questions);
                    setLessonsText(JSON.stringify(data.lessons, null, 2));
                    setQuestionsText(JSON.stringify(data.questions, null, 2));
                    alert("Importación exitosa. Revisa el contenido y haz clic en Guardar para aplicar los cambios.");
                } else {
                    alert("El archivo no tiene el formato correcto.");
                }
            } catch(e) {
                alert("Error al importar el archivo.");
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // Reset
    };

    const navItems = [
        { id: 'taxonomy', label: '1. Asignaturas y Grados', icon: '🏛️' },
        { id: 'lessons', label: '2. Lecciones y Teoría', icon: '📖' },
        { id: 'questions', label: '3. Preguntas de Quiz', icon: '❓' },
        { id: 'raw_json', label: 'Avanzado (JSON)', icon: '⚙️' },
    ];

    return (
        <div className="animate-fade-in p-2 md:p-6 bg-slate-100 min-h-screen dark:bg-slate-900 rounded-xl relative overflow-hidden flex flex-col h-full max-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 flex-shrink-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-200">Panel CMS de Contenidos</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Gestiona la estructura escolar, lecciones y preguntas de forma óptima.</p>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                     <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-lg mr-2 border border-slate-300 dark:border-slate-600">
                        <button 
                            onClick={() => handleSourceToggle('local')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewSource === 'local' ? 'bg-white dark:bg-slate-500 shadow-sm text-blue-600 dark:text-blue-100' : 'text-slate-500 hover:text-slate-700'}`}
                            title="Editar copia local guardada en el navegador"
                        >
                            🏠 Local
                        </button>
                        <button 
                            onClick={() => handleSourceToggle('server')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewSource === 'server' ? 'bg-white dark:bg-slate-500 shadow-sm text-blue-600 dark:text-blue-100' : 'text-slate-500 hover:text-slate-700'}`}
                            title="Editar archivos base del servidor (Persisistentes)"
                        >
                            ☁️ Servidor
                        </button>
                    </div>
                     <Button variant="secondary" onClick={onBack}>Volver</Button>
                     <Button variant="warning" onClick={handleReset}>Restaurar Orig.</Button>
                     <Button 
                        variant="primary" 
                        onClick={handleSave}
                        className={viewSource === 'server' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg' : ''}
                     >
                        {viewSource === 'local' ? 'Guardar Todo' : 'Persistir en Servidor'}
                     </Button>
                </div>
            </div>

            {/* Quick Actions Base */}
            <Card className="mb-4 !p-3 flex flex-col sm:flex-row justify-between items-center gap-4 border-l-4 border-l-blue-500 flex-shrink-0">
                <div className="text-sm text-slate-700 dark:text-slate-300">
                     <strong>Exportar / Importar Base de Datos</strong>: Haz respaldos de tus contenidos personalizados.
                </div>
                <div className="flex gap-2">
                    <Button variant="special" onClick={handleExport} className="!py-1.5 !px-3 text-sm">📥 Descargar Backup</Button>
                    <label className="bg-slate-600 text-white text-sm font-bold py-1.5 px-3 rounded shadow hover:bg-slate-700 active:scale-95 cursor-pointer">
                        📤 Cargar Backup
                        <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                    </label>
                </div>
            </Card>

            {/* View Switching Navigation */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 flex-shrink-0 scrollbar-hide">
                {navItems.map(nav => (
                    <button 
                        key={nav.id}
                        onClick={() => setActiveTab(nav.id as any)} 
                        className={`px-4 py-3 font-bold rounded-lg border flex-shrink-0 flex gap-2 items-center transition-transform active:scale-95 ${activeTab === nav.id ? 'bg-white dark:bg-slate-800 text-blue-600 border border-blue-500 shadow-sm' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                    >
                        <span>{nav.icon}</span> <span>{nav.label}</span>
                    </button>
                ))}
            </div>
            
            {/* Main Content Area */}
            <div className="bg-slate-200 dark:bg-slate-900 rounded-lg flex-grow flex flex-col min-h-0 overflow-y-auto p-4">
                {/* Source Indicator Bar */}
                {activeTab !== 'raw_json' && (
                    <div className="flex justify-between items-center bg-white/70 dark:bg-slate-800/70 p-2.5 rounded-lg mb-4 border border-slate-300 dark:border-slate-700 shadow-sm">
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estado de Edición:</span>
                            {viewSource === 'local' ? (
                                <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 px-2 py-1 rounded text-[11px] font-black border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
                                    <span className="animate-pulse">●</span> EDITANDO LOCAL (Navegador)
                                </span>
                            ) : (
                                <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-1 rounded text-[11px] font-black border border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
                                    ☁️ EDITANDO SERVIDOR (Directo)
                                </span>
                            )}
                            
                            {/* Warning if there's a local override while viewing server */}
                            {viewSource === 'server' && (activeTab === 'taxonomy' ? isTaxonomyCustomized : activeTab === 'lessons' ? isLessonsCustomized : isQuestionsCustomized) && (
                                <span className="text-[10px] text-red-500 font-bold italic animate-pulse">
                                    ⚠️ VISUALIZANDO BASE (Existen cambios locales ocultos)
                                </span>
                            )}
                         </div>
                         {(activeTab === 'taxonomy' ? isTaxonomyCustomized : activeTab === 'lessons' ? isLessonsCustomized : isQuestionsCustomized) && (
                             <button 
                                onClick={() => handleResetSection(activeTab as any)}
                                className="text-[11px] font-bold bg-white dark:bg-slate-700 border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2 transition-all active:scale-95"
                                title="Elimina la copia de este navegador y vuelve a los archivos del servidor"
                             >
                                 🗑️ Eliminar Local / Restaurar Source
                             </button>
                         )}
                    </div>
                )}

                {activeTab === 'taxonomy' && (
                    <TaxonomyPanel taxonomy={taxonomy} onChange={setTaxonomy} />
                )}
                {activeTab === 'lessons' && (
                    <LessonsPanel lessons={lessons} taxonomy={taxonomy} onChange={setLessons} />
                )}
                {activeTab === 'questions' && (
                    <QuestionsPanel questions={questions} taxonomy={taxonomy} lessons={lessons} onChange={setQuestions} />
                )}
                {activeTab === 'raw_json' && (
                    <div className="flex flex-col flex-grow bg-white dark:bg-slate-800 p-4 rounded-lg shadow h-full">
                        <div className="flex gap-4 mb-4">
                            <button onClick={() => setRawSubTab('lessons')} className={`font-bold pb-2 ${rawSubTab === 'lessons' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-slate-400'}`}>lessons.json</button>
                            <button onClick={() => setRawSubTab('questions')} className={`font-bold pb-2 ${rawSubTab === 'questions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>questions.json</button>
                        </div>
                        <textarea 
                            className="w-full flex-grow bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs md:text-sm p-4 rounded text-slate-800 dark:text-green-300 resize-none outline-none focus:ring-2 focus:ring-blue-500" 
                            value={rawSubTab === 'lessons' ? lessonsText : questionsText}
                            onChange={(e) => rawSubTab === 'lessons' ? setLessonsText(e.target.value) : setQuestionsText(e.target.value)}
                            spellCheck={false}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
