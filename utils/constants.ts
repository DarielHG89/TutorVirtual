import type { CategoryId } from '../types';
import { contentManager } from './contentManager';

export const categoryNames: Record<CategoryId, string> = new Proxy({}, {
    get: (target, prop) => {
        const _map = contentManager.getCategoryNamesMap();
        return _map[prop as string] || prop;
    }
}) as Record<CategoryId, string>;
