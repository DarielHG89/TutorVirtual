import React, { useState, useRef, useEffect } from 'react';
import type { GameState, StudentProfile, CategoryId } from '../types';
import { contentManager } from '../utils/contentManager';
import { categoryNames } from '../utils/constants';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { playClickSound } from '../utils/sounds';

interface ParentDashboardProps {
    studentProfile: StudentProfile | null;
    gameState: GameState;
    onUnlockNextLevel: (key: string) => void;
    onResetProgress: (key: string) => void;
    onUnlockAll: () => void;
    onResetAll: () => void;
    showModal: (title: string, message: string, onConfirm?: () => void, confirmVariant?: 'primary' | 'warning') => void;
    onOpenFeedbackModal: () => void;
    onGoToContentManager: () => void;
    onUpdateProfile: (updatedData: Partial<Omit<StudentProfile, 'id'>>) => void;
    subjectId?: string;
}

const AccordionItem: React.FC<{
    title: string;
    id: string;
    openId: string | null;
    setOpenId: (id: string | null) => void;
    children: React.ReactNode;
}> = ({ title, id, openId, setOpenId, children }) => {
    const isOpen = openId === id;
    return (
        <Card className="!p-0 overflow-hidden bg-slate-50 dark:bg-slate-800">
            <button
                onClick={() => { playClickSound(); setOpenId(isOpen ? null : id); }}
                className="w-full text-left p-4 flex justify-between items-center"
                aria-expanded={isOpen}
                aria-controls={`accordion-content-${id}`}
            >
                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">{title}</h2>
                <span className={`transform transition-transform duration-300 text-2xl text-blue-500 ${isOpen ? 'rotate-180' : ''}`}>
                    ▾
                </span>
            </button>
            <div
                id={`accordion-content-${id}`}
                className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
                <div className={`overflow-hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 delay-150' : 'opacity-0'}`}>
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                        {children}
                    </div>
                </div>
            </div>
        </Card>
    );
};


const ProgressItem: React.FC<{
    itemKey: string;
    name: string;
    type: 'category' | 'lesson';
    progress: GameState[string];
    onUnlockNextLevel: (key: string) => void;
    onResetProgress: () => void;
}> = ({ itemKey, name, type, progress, onUnlockNextLevel, onResetProgress }) => {
    
    if (!progress) return null;

    let maxLevel = 0;
    if (type === 'category') {
        maxLevel = Object.keys(contentManager.getQuestions()[itemKey as CategoryId] || {}).length;
    } else {
        const lesson = contentManager.getLessons().find(l => l.id === itemKey);
        if (lesson) maxLevel = Object.keys(lesson.practice).length;
    }
    
    const highScoresText = Object.entries(progress.highScores)
        .map(([level, score]) => `Nivel ${level}: ${score}/10`)
        .join(', ');

    return (
        <Card className="!p-4 bg-white dark:bg-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-1">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{name}</h3>
                </div>
                <div className="md:col-span-1">
                    <p className="dark:text-slate-300"><strong className="font-semibold dark:text-slate-200">Nivel desbloqueado:</strong> {progress.unlockedLevel} / {maxLevel}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate" title={highScoresText || 'Sin puntuaciones'}>
                        <strong className="font-semibold dark:text-slate-300">Mejores Puntuaciones:</strong> {highScoresText || 'Aún no hay'}
                    </p>
                </div>
                <div className="md:col-span-1 flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2 justify-end">
                    <Button
                        onClick={() => onUnlockNextLevel(itemKey)}
                        disabled={progress.unlockedLevel >= maxLevel}
                        className="text-sm !py-1.5 !px-3 w-full"
                        variant="secondary"
                    >
                        Desbloquear Nivel
                    </Button>
                    <Button
                        onClick={onResetProgress}
                        className="text-sm !py-1.5 !px-3 w-full"
                        variant="warning"
                    >
                        Reiniciar
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ studentProfile, gameState, onUnlockNextLevel, onResetProgress, onUnlockAll, onResetAll, showModal, onOpenFeedbackModal, onGoToContentManager, onUpdateProfile, subjectId }) => {
    const taxonomy = contentManager.getTaxonomy();

    const initialGrade = studentProfile?.gradeId || taxonomy.grades[0]?.id || '';
    const initialSubject = subjectId || taxonomy.subjects.find(s => s.gradeId === initialGrade)?.id || '';

    const [selectedGrade, setSelectedGrade] = useState<string>(initialGrade);
    const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject || '');
    const [openAccordion, setOpenAccordion] = useState<string | null>('profile');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [editName, setEditName] = useState(studentProfile?.name || '');
    const [editAge, setEditAge] = useState(studentProfile?.age || 8);
    const [editGradeId, setEditGradeId] = useState(studentProfile?.gradeId || taxonomy.grades[0]?.id || '');

    const hasChanges = editName !== studentProfile?.name || editAge !== studentProfile?.age || editGradeId !== studentProfile?.gradeId;

    const handleSaveProfile = () => {
        if (!editName.trim()) return;
        onUpdateProfile({
            name: editName.trim(),
            age: editAge,
            gradeId: editGradeId
        });
        showModal('Éxito', 'Perfil actualizado correctamente.');
    };

    const activeSubjectCategories = selectedSubject
        ? new Set(taxonomy.categories.filter(c => c.subjectId === selectedSubject).map(c => c.id))
        : null;

    const lessonItems = contentManager.getLessons()
        .filter(lesson => !activeSubjectCategories || activeSubjectCategories.has(lesson.categoryId))
        .map(lesson => ({ key: lesson.id, name: lesson.title, type: 'lesson' as 'lesson' }));
    
    const categoryItems = (Object.keys(contentManager.getQuestions()) as CategoryId[])
        .filter(catId => !activeSubjectCategories || activeSubjectCategories.has(catId))
        .map(key => ({ key, name: categoryNames[key] || key, type: 'category' as 'category' }));

    const handleExport = () => {
        if (!studentProfile) return;
        
        try {
            const dataToExport = {
                profile: studentProfile,
                progress: gameState
            };
            const dataStr = JSON.stringify(dataToExport, null, 2);
            const dataBlob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `maestro_digital_backup_${studentProfile.name.toLowerCase().replace(' ','_')}_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            showModal('Éxito', 'Los datos del estudiante se han exportado correctamente.');
        } catch (error) {
            console.error('Error exporting data:', error);
            showModal('Error', 'No se pudieron exportar los datos.', undefined, 'warning');
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !studentProfile) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("File content is not text");
                
                const importedData = JSON.parse(text);

                if (!importedData.profile || !importedData.progress || importedData.profile.id !== studentProfile.id) {
                    throw new Error("El archivo no es compatible o no pertenece a este estudiante.");
                }
                
                showModal(
                    'Confirmar Importación',
                    `¿Estás seguro de que quieres sobreescribir TODO el progreso de ${studentProfile.name} con los datos del archivo? Esta acción es irreversible. La aplicación se recargará.`,
                    () => {
                        localStorage.setItem(`maestroDigitalProgress_${studentProfile.id}`, JSON.stringify(importedData.progress));
                        window.location.reload();
                    },
                    'warning'
                );

            } catch (error) {
                const message = error instanceof Error ? error.message : "Error al procesar el archivo.";
                showModal('Error de Importación', message, undefined, 'warning');
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    };

    useEffect(() => {
        if (taxonomy.grades.length > 0 && !taxonomy.grades.find(g => g.id === selectedGrade)) {
            setSelectedGrade(studentProfile?.gradeId || taxonomy.grades[0].id);
        }
    }, [taxonomy.grades, selectedGrade, studentProfile?.gradeId]);

    useEffect(() => {
        const subjectsForGrade = taxonomy.subjects.filter(s => s.gradeId === selectedGrade);
        if (subjectsForGrade.length > 0 && !subjectsForGrade.find(s => s.id === selectedSubject)) {
            setSelectedSubject(subjectsForGrade[0].id);
        } else if (subjectsForGrade.length === 0) {
            setSelectedSubject('');
        }
    }, [selectedGrade, taxonomy.subjects, selectedSubject]);

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-slate-800 dark:text-slate-200 mb-2">Panel de Padres</h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Gestionando <strong className="font-bold">{studentProfile?.name || 'Estudiante'}</strong>.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Grado:</span>
                        <select
                            value={selectedGrade}
                            onChange={(e) => {
                                playClickSound();
                                setSelectedGrade(e.target.value);
                            }}
                            className="p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold"
                        >
                            {taxonomy.grades.map(g => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Asignatura:</span>
                        <select
                            value={selectedSubject}
                            onChange={(e) => {
                                playClickSound();
                                setSelectedSubject(e.target.value);
                            }}
                            className="p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold"
                        >
                            {taxonomy.subjects.filter(s => s.gradeId === selectedGrade).map(subject => (
                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                            ))}
                            {taxonomy.subjects.filter(s => s.gradeId === selectedGrade).length === 0 && (
                                <option value="">Sin asignaturas</option>
                            )}
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <AccordionItem id="profile" title="👤 Perfil del Estudiante" openId={openAccordion} setOpenId={setOpenAccordion}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre</label>
                            <input 
                                type="text" 
                                value={editName} 
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Edad</label>
                            <select 
                                value={editAge} 
                                onChange={(e) => setEditAge(parseInt(e.target.value))}
                                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            >
                                {Array.from({ length: 8 }, (_, i) => i + 5).map(a => (
                                    <option key={a} value={a}>{a} años</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Grado Escolar</label>
                            <select 
                                value={editGradeId} 
                                onChange={(e) => setEditGradeId(e.target.value)}
                                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            >
                                {taxonomy.grades.map(grade => (
                                    <option key={grade.id} value={grade.id}>{grade.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button onClick={handleSaveProfile} disabled={!hasChanges || !editName.trim()} variant="primary">
                            Guardar Cambios del Perfil
                        </Button>
                    </div>
                </AccordionItem>

                <AccordionItem id="global" title="🔧 Herramientas Globales" openId={openAccordion} setOpenId={setOpenAccordion}>
                     <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
                        <Button onClick={onGoToContentManager} variant="primary" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                             📚 Administrar Contenido de Estudio
                        </Button>
                        <Button onClick={onOpenFeedbackModal} variant="primary" className="w-full sm:w-auto">
                            ✉️ Enviar Sugerencias
                        </Button>
                        <Button onClick={() => showModal('Confirmar', '¿Desbloquear todos los niveles de todas las lecciones y prácticas? El progreso y las puntuaciones se mantendrán.', onUnlockAll)} variant="special" className="w-full sm:w-auto">
                            🔓 Desbloquear Todo
                        </Button>
                        <Button onClick={() => showModal('¡ATENCIÓN!', '¿Borrar TODO el progreso de este usuario? Se perderán todos los niveles y puntuaciones. Esta acción es irreversible.', onResetAll, 'warning')} variant="warning" className="w-full sm:w-auto">
                            🔄 Reiniciar Todo el Progreso
                        </Button>
                    </div>
                </AccordionItem>
                
                 <AccordionItem id="data" title="💾 Gestión de Datos" openId={openAccordion} setOpenId={setOpenAccordion}>
                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={handleExport} variant="primary" className="w-full sm:w-auto">
                            📥 Exportar Datos
                        </Button>
                        <Button onClick={handleImportClick} variant="secondary" className="w-full sm:w-auto">
                            📤 Importar Datos
                        </Button>
                        <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileImport} className="hidden" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">Guarda o restaura el progreso del estudiante. El archivo importado debe corresponder al perfil actual.</p>
                </AccordionItem>

                <AccordionItem id="lessons" title="📘 Progreso en Lecciones" openId={openAccordion} setOpenId={setOpenAccordion}>
                     <div className="space-y-4">
                        {lessonItems.map(item => (
                            <ProgressItem
                                key={item.key}
                                itemKey={item.key}
                                name={item.name}
                                type={item.type}
                                progress={gameState[item.key]}
                                onUnlockNextLevel={onUnlockNextLevel}
                                onResetProgress={() => showModal('Confirmar', `¿Reiniciar todo el progreso de "${item.name}"?`, () => onResetProgress(item.key), 'warning')}
                            />
                        ))}
                    </div>
                </AccordionItem>

                <AccordionItem id="practice" title="🤸 Progreso en Práctica" openId={openAccordion} setOpenId={setOpenAccordion}>
                    <div className="space-y-4">
                        {categoryItems.map(item => (
                             <ProgressItem
                                key={item.key}
                                itemKey={item.key}
                                name={item.name}
                                type={item.type}
                                progress={gameState[item.key]}
                                onUnlockNextLevel={onUnlockNextLevel}
                                onResetProgress={() => showModal('Confirmar', `¿Reiniciar todo el progreso de "${item.name}"?`, () => onResetProgress(item.key), 'warning')}
                            />
                        ))}
                    </div>
                </AccordionItem>
            </div>
        </div>
    );
};