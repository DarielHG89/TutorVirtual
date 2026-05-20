export function shuffleArray<T,>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export function selectDistributedQuestions<T extends { question: any }>(pool: T[], count: number): T[] {
    const groups: Record<string, T[]> = {};
    for (const item of pool) {
        const key = item.question?.lessonId || 'general';
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
    }

    const keys = Object.keys(groups);
    // Mezclamos cada grupo internamente
    for (const k of keys) {
        groups[k] = shuffleArray(groups[k]);
    }

    const result: T[] = [];
    let added = true;
    let i = 0;
    while (result.length < count && added) {
        added = false;
        // Turnos entre las distintas lecciones para asegurar distribución equitativa
        for (let j = 0; j < keys.length; j++) {
            if (result.length >= count) break;
            const key = keys[(i + j) % keys.length];
            if (groups[key].length > 0) {
                result.push(groups[key].shift() as T);
                added = true;
            }
        }
        i++;
    }
    
    // Mezclamos el resultado final para que no salgan ordenados por lección
    return shuffleArray(result);
}
