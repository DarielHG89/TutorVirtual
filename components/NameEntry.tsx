import React, { useState, useMemo } from 'react';
import { Button } from './common/Button';
import type { StudentProfile } from '../types';
import type { AvatarSelectorModalProps } from './AvatarSelectorModal';
import { playClickSound } from '../utils/sounds';

interface NameEntryProps {
    onProfileSubmit: (profile: Omit<StudentProfile, 'id'>) => void;
    showBackButton?: boolean;
    onBack?: () => void;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
    setAvatarSelectorProps: (props: Omit<AvatarSelectorModalProps, 'isOpen'> | null) => void;
}

export const NameEntry: React.FC<NameEntryProps> = ({ onProfileSubmit, showBackButton, onBack, theme, onToggleTheme, setAvatarSelectorProps }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState(8);
    const [gender, setGender] = useState<'boy' | 'girl' | null>(null);
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (name.trim().length < 2) {
            setError('¡Tu nombre debe tener al menos 2 letras!');
            return;
        }
        if (name.trim().length > 15) {
            setError('Tu nombre es muy largo. ¡Usa un apodo corto!');
            return;
        }
        if (!gender) {
            setError('Por favor, selecciona si eres niño o niña.');
            return;
        }
        
        const finalAvatar = selectedAvatar || (gender === 'boy' ? '👦' : '👧');
        
        onProfileSubmit({ name: name.trim(), age, gender, avatar: finalAvatar });
    };
    
    const openAvatarSelector = (currentGender: 'boy' | 'girl' | null) => {
        playClickSound();
        setAvatarSelectorProps({
            onClose: () => setAvatarSelectorProps(null),
            onAvatarSelect: (avatar: string) => {
                setSelectedAvatar(avatar);
                setAvatarSelectorProps(null);
            },
            gender: currentGender,
            age,
            name,
            selectedAvatar,
        });
    };

    const handleGenderSelect = (newGender: 'boy' | 'girl') => {
        playClickSound();
        setGender(newGender);
        
        // If gender is changing and current avatar is an emoji (not a custom one), reset it.
        if (gender !== newGender && selectedAvatar && !selectedAvatar.startsWith('data:image')) {
            setSelectedAvatar(null);
        }
        
        // Open the modal with the new gender context
        // We use a timeout to allow the state update to be processed before reading it in openAvatarSelector
        setTimeout(() => openAvatarSelector(newGender), 0);
    };

    const displayedAvatar = useMemo(() => {
        const current = selectedAvatar || (gender === 'boy' ? '👦' : (gender === 'girl' ? '👧' : '👤'));
        if (current.startsWith('data:image')) {
            return <img src={current} alt="Avatar seleccionado" className="w-20 h-20 rounded-full object-cover" />;
        }
        const placeholderClass = !gender ? 'opacity-40' : '';
        return <span className={`text-6xl ${placeholderClass}`}>{current}</span>;
    }, [selectedAvatar, gender]);


    return (
        <div className="animate-fade-in flex flex-col items-center justify-center h-full relative gap-3">
            {!showBackButton && (
                <button 
                    onClick={() => { playClickSound(); onToggleTheme(); }} 
                    title="Cambiar tema" 
                    className="absolute top-0 right-0 z-10 p-1 w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <span className="text-xl" role="img" aria-label="Cambiar Tema">{theme === 'light' ? '🌙' : '☀️'}</span>
                </button>
            )}

            {showBackButton && onBack && (
                <button onClick={() => { playClickSound(); onBack(); }} className="absolute top-0 left-0 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-800 dark:hover:text-slate-200 transition-colors text-lg">
                    &larr; Volver
                </button>
            )}

            <div className="text-center">
                <h1 className="font-title text-4xl sm:text-5xl text-slate-800 text-gradient">¡Bienvenido/a!</h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">Soy tu Maestro Digital. Para empezar, ¡vamos a crear tu perfil!</p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 w-full max-w-sm">
                
                <div className="w-full">
                    <label className="text-base font-bold text-slate-700 dark:text-slate-200 block mb-1">¿Cómo te llamas?</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Escribe tu nombre aquí"
                        className="p-3 text-lg border-2 border-slate-300 dark:border-slate-600 rounded-lg text-center w-full text-black bg-white dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                        autoFocus
                    />
                </div>

                <div className="w-full">
                    <label className="text-base font-bold text-slate-700 dark:text-slate-200 block mb-1">¿Cuántos años tienes?</label>
                     <select 
                        value={age} 
                        onChange={(e) => { playClickSound(); setAge(parseInt(e.target.value)); }}
                        className="p-3 text-lg border-2 border-slate-300 dark:border-slate-600 rounded-lg text-center w-full bg-white dark:bg-slate-700 text-black dark:text-white"
                    >
                        {Array.from({ length: 8 }, (_, i) => i + 5).map(a => (
                            <option key={a} value={a}>{a} años</option>
                        ))}
                    </select>
                </div>
                
                <div className="w-full">
                    <label className="text-base font-bold text-slate-700 dark:text-slate-200 block mb-1">Género:</label>
                    <div className="flex justify-center gap-2">
                        {(['boy', 'girl'] as const).map(g => (
                            <button 
                                key={g}
                                type="button" 
                                onClick={() => handleGenderSelect(g)} 
                                className={`p-2 border-4 rounded-full transition-colors ${gender === g ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/50' : 'border-transparent bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                            >
                               <span className="text-4xl">{g === 'boy' ? '👦' : '👧'}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full text-center flex flex-col justify-start items-center">
                    <label className="text-base font-bold text-slate-700 dark:text-slate-200 block mb-1">Tu Avatar:</label>
                    <div
                        className="p-2 border-4 border-dashed border-slate-300 dark:border-slate-500 rounded-full inline-block"
                    >
                        {displayedAvatar}
                    </div>
                </div>
                
                {error && <p className="text-red-500 font-bold animate-pulse">{error}</p>}
            </form>

            <div className="w-full max-w-sm pb-2">
                <Button onClick={handleSubmit} type="submit" variant="primary" className="w-full text-xl !py-3">
                    ¡A Aprender!
                </Button>
            </div>
        </div>
    );
};