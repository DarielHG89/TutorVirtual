import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = (): [Theme, () => void] => {
    const [theme, setTheme] = useState<Theme>(() => {
        try {
            const savedTheme = window.localStorage.getItem('maestroDigitalTheme');
            if (savedTheme === 'dark' || savedTheme === 'light') {
                return savedTheme;
            }
            // Check for system preference if no theme is saved
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        } catch (error) {
            console.warn('Could not access localStorage to get theme', error);
        }
        return 'light'; // Default to light theme
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        try {
            window.localStorage.setItem('maestroDigitalTheme', theme);
        } catch (error) {
            console.warn('Could not save theme to localStorage', error);
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    }, []);

    return [theme, toggleTheme];
};
