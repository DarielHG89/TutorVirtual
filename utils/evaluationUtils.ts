
export type QualitativeEvaluation = 'E' | 'MB' | 'B' | 'R' | 'I';

export interface EvaluationInfo {
    grade: QualitativeEvaluation;
    label: string;
    description: string;
    color: string;
    textColor: string;
}

export const EVALUATIONS: Record<QualitativeEvaluation, EvaluationInfo> = {
    E: { 
        grade: 'E', 
        label: 'Excelente', 
        description: 'Dominio excepcional de los contenidos.',
        color: 'bg-green-500',
        textColor: 'text-green-600'
    },
    MB: { 
        grade: 'MB', 
        label: 'Muy Bien', 
        description: 'Dominio sólido de los contenidos.',
        color: 'bg-blue-500',
        textColor: 'text-blue-600'
    },
    B: { 
        grade: 'B', 
        label: 'Bien', 
        description: 'Muestra un dominio adecuado, con pequeños errores.',
        color: 'bg-yellow-500',
        textColor: 'text-yellow-600'
    },
    R: { 
        grade: 'R', 
        label: 'Regular', 
        description: 'Conocimiento básico, requiere práctica adicional.',
        color: 'bg-orange-500',
        textColor: 'text-orange-600'
    },
    I: { 
        grade: 'I', 
        label: 'Insuficiente', 
        description: 'No cumple con los objetivos mínimos, requiere refuerzo.',
        color: 'bg-red-500',
        textColor: 'text-red-600'
    }
};

/**
 * Calculates the qualitative evaluation based on a percentage (0-100)
 */
export const getQualitativeEvaluation = (percent: number): EvaluationInfo => {
    if (percent >= 90) return EVALUATIONS.E;
    if (percent >= 80) return EVALUATIONS.MB;
    if (percent >= 70) return EVALUATIONS.B;
    if (percent >= 60) return EVALUATIONS.R;
    return EVALUATIONS.I;
};
