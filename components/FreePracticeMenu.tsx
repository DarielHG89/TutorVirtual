import React from 'react';
import type { CategoryId, StudentProfile } from '../types';
import { contentManager } from '../utils/contentManager';
import { Card } from './common/Card';
import { categoryNames } from '../utils/constants';

interface FreePracticeMenuProps {
    onSelectCategory: (categoryId: CategoryId) => void;
    subjectId?: string;
    studentProfile?: StudentProfile | null;
}

const categoryIcons: Record<CategoryId, string> = {
    numeros: '🔢',
    suma_resta: '➕',
    multi_divi: '✖️',
    problemas: '🧠',
    geometria: '📐',
    medidas: '📏',
    reloj: '⏰'
};

export const FreePracticeMenu: React.FC<FreePracticeMenuProps> = ({ onSelectCategory, subjectId, studentProfile }) => {
    const taxonomy = contentManager.getTaxonomy();
    
    // Improve filtering to ensure we only show categories appropriate for the current subject
    // If no subjectId is provided, we should identify which subjects are available and filter by them
    let categories: CategoryId[] = [];
    
    let activeSubject = subjectId;
    if (!activeSubject) {
        const userGrade = studentProfile?.gradeId || taxonomy.grades[0]?.id;
        activeSubject = taxonomy.subjects.find(s => s.gradeId === userGrade)?.id || taxonomy.subjects[0]?.id;
    }
    
    if (activeSubject) {
        categories = taxonomy.categories
            .filter(c => c.subjectId === activeSubject)
            .map(c => c.id as CategoryId);
    } else {
        categories = Object.keys(contentManager.getQuestions()) as CategoryId[];
    }

    const activeSubjectName = activeSubject ? taxonomy.subjects.find(s => s.id === activeSubject)?.name : '';

    return (
        <div className="animate-fade-in text-center">
            {activeSubjectName && <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{activeSubjectName}</h2>}
            <p className="text-slate-600 dark:text-slate-300 mb-6">Elige una categoría para practicar sin límites. ¡Todos los niveles están desbloqueados!</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((id, index) => (
                    <Card 
                        key={id} 
                        onClick={() => onSelectCategory(id)}
                        className="animate-staggered-fade-in" 
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <h3 className="font-black text-slate-800 dark:text-slate-200 text-lg capitalize flex items-center justify-center gap-2">
                            <span className="text-2xl">{categoryIcons[id]}</span>
                            <span>{categoryNames[id]}</span>
                        </h3>
                    </Card>
                ))}
            </div>
        </div>
    );
};