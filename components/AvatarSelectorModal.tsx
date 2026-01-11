import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Button } from './common/Button';
import type { StudentProfile } from '../types';
import { generateAvatarFromText, generateAvatarFromPhoto } from '../services/aiService';
import { ImageCropper } from './common/ImageCropper';
import { playClickSound } from '../utils/sounds';


const boyAvatars = ['🧑‍🚀', '🦸', '🥷', '🤖', '🦖'];
const girlAvatars = ['🧜‍♀️', '🦸‍♀️', '🥷', '🤖', '🦄'];

export interface AvatarSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAvatarSelect: (avatar: string) => void;
    gender: 'boy' | 'girl' | null;
    age: number;
    name: string;
    selectedAvatar: string | null;
}

export const AvatarSelectorModal: React.FC<AvatarSelectorModalProps> = ({ 
    isOpen,
    onClose,
    onAvatarSelect,
    gender,
    age,
    name,
    selectedAvatar
}) => {
    // Internal state for the modal's functionality
    const [userUploadedAvatars, setUserUploadedAvatars] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showAiTools, setShowAiTools] = useState(false);
    const [avatarDescription, setAvatarDescription] = useState('');
    const [uploadedPhoto, setUploadedPhoto] = useState<{data: string; mimeType: string;} | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    
    const geminiFileInputRef = useRef<HTMLInputElement>(null);
    const manualFileInputRef = useRef<HTMLInputElement>(null);
    
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [cropTarget, setCropTarget] = useState<'manual' | 'gemini' | null>(null);

    // Reset internal state when the modal is reopened
    useEffect(() => {
        if (isOpen) {
            setError(null);
            setShowAiTools(false);
            setAvatarDescription('');
            setUploadedPhoto(null);
            setIsGenerating(false);
            setImageToCrop(null);
            setCropTarget(null);
        }
    }, [isOpen]);
    
    if (!isOpen) return null;

    const handleAvatarClick = (avatar: string) => {
        playClickSound();
        onAvatarSelect(avatar);
    };

    const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>, target: 'manual' | 'gemini') => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                const imageUrl = loadEvent.target?.result as string;
                setImageToCrop(imageUrl);
                setCropTarget(target);
            };
            reader.readAsDataURL(file);
        }
        event.target.value = '';
    };

    const handleCropComplete = (croppedDataUrl: string) => {
        if (cropTarget === 'manual') {
            const newAvatar = croppedDataUrl;
            setUserUploadedAvatars(prev => [newAvatar, ...prev]);
            onAvatarSelect(newAvatar);
        } else if (cropTarget === 'gemini') {
            setUploadedPhoto({ data: croppedDataUrl, mimeType: 'image/png' });
            setAvatarDescription('');
        }
        setImageToCrop(null);
        setCropTarget(null);
    };

    const handleCropCancel = () => {
        setImageToCrop(null);
        setCropTarget(null);
    };
    
    const handleGenerateAvatar = async () => {
        if (!avatarDescription && !uploadedPhoto) {
            setError('Escribe una descripción o sube una foto para generar tu avatar.');
            return;
        }
        setError(null);
        setIsGenerating(true);

        const profileInfo = { name, age, gender };

        try {
            let newAvatar: string;
            if (uploadedPhoto) {
                newAvatar = await generateAvatarFromPhoto(uploadedPhoto.data, uploadedPhoto.mimeType, profileInfo);
            } else {
                newAvatar = await generateAvatarFromText(avatarDescription, profileInfo);
            }
            setUserUploadedAvatars(prev => [newAvatar, ...prev]);
            onAvatarSelect(newAvatar);
        } catch (err) {
            console.error(err);
            const errorMessage = (err instanceof Error) ? err.message : '¡Oh no! No se pudo generar el avatar. Inténtalo de nuevo.';
            setError(errorMessage);
        } finally {
            setIsGenerating(false);
        }
    };
    
    const currentAvatarList = useMemo(() => {
        if (!gender) return [];
        return gender === 'boy' ? boyAvatars : girlAvatars;
    }, [gender]);

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            {imageToCrop && <ImageCropper imageUrl={imageToCrop} onCrop={handleCropComplete} onCancel={handleCropCancel} />}
            <div 
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl w-full max-w-xl m-4 animate-modal-scale-in flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 text-center mb-4 flex-shrink-0">Elige tu Avatar</h3>
                <div className="overflow-y-auto pr-2">
                        <div className="flex justify-center gap-4 flex-wrap bg-slate-100 dark:bg-slate-700 p-3 rounded-lg mb-4">
                        <button 
                            type="button" 
                            onClick={() => handleAvatarClick(gender === 'boy' ? '👦' : '👧')} 
                            className={`p-1 border-4 rounded-full transition-transform transform hover:scale-110 ${selectedAvatar === (gender === 'boy' ? '👦' : '👧') || selectedAvatar === null ? 'border-blue-500 scale-110 bg-blue-100 dark:bg-blue-900/50' : 'border-transparent'}`}
                        >
                            <span className="text-5xl">{gender === 'boy' ? '👦' : '👧'}</span>
                        </button>
                        {currentAvatarList.map(avatar => (
                            <button 
                                key={avatar}
                                type="button" 
                                onClick={() => handleAvatarClick(avatar)} 
                                className={`p-1 border-4 rounded-full transition-transform transform hover:scale-110 ${selectedAvatar === avatar ? 'border-blue-500 scale-110 bg-blue-100 dark:bg-blue-900/50' : 'border-transparent'}`}
                            >
                                <span className="text-5xl">{avatar}</span>
                            </button>
                        ))}
                        {userUploadedAvatars.map((avatar) => (
                            <button 
                                key={avatar}
                                type="button" 
                                onClick={() => handleAvatarClick(avatar)} 
                                className={`p-1 border-4 rounded-full transition-transform transform hover:scale-110 ${selectedAvatar === avatar ? 'border-blue-500 scale-110 bg-blue-100 dark:bg-blue-900/50' : 'border-transparent'}`}
                            >
                                <img src={avatar} alt="Avatar personalizado" className="w-16 h-16 rounded-full object-cover" />
                            </button>
                        ))}
                        <button 
                            type="button" 
                            onClick={() => { playClickSound(); manualFileInputRef.current?.click(); }} 
                            className={`p-1 border-4 border-dashed border-slate-300 dark:border-slate-500 rounded-full transition-transform transform hover:scale-110 hover:border-blue-500 flex items-center justify-center w-[72px] h-[72px] bg-slate-200 dark:bg-slate-600`}
                            title="Subir foto como avatar"
                        >
                            <span className="text-4xl text-slate-500 dark:text-slate-400">🖼️+</span>
                        </button>
                        <input type="file" accept="image/*" ref={manualFileInputRef} onChange={(e) => handleFileSelected(e, 'manual')} className="hidden" />
                    </div>
                    
                    <div className="w-full p-4 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-lg bg-purple-50 dark:bg-purple-900/30">
                        <button type="button" onClick={() => { playClickSound(); setShowAiTools(prev => !prev); }} className="font-bold text-purple-700 dark:text-purple-300 w-full text-lg">
                            Crear Avatar con IA 🤖 {showAiTools ? '▴' : '▾'}
                        </button>
                        {showAiTools && (
                            <div className="mt-4 space-y-4">
                                <input
                                    type="text"
                                    value={avatarDescription}
                                    onChange={(e) => {
                                        setAvatarDescription(e.target.value);
                                        if (e.target.value) setUploadedPhoto(null);
                                    }}
                                    placeholder="Ej: un astronauta con un gato"
                                    className="p-3 text-base border-2 border-purple-200 dark:border-purple-600 rounded-lg text-center w-full text-black bg-white dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                                    disabled={isGenerating}
                                />
                                <div className="text-center font-bold text-slate-500 dark:text-slate-400">O</div>
                                <input type="file" accept="image/*" ref={geminiFileInputRef} onChange={(e) => handleFileSelected(e, 'gemini')} className="hidden" />
                                <Button type="button" variant="secondary" onClick={() => geminiFileInputRef.current?.click()} className="w-full !py-2 !text-base" disabled={isGenerating}>
                                    {uploadedPhoto ? "Foto para IA seleccionada ✔️" : "Subir foto para transformar 🖼️"}
                                </Button>
                                {error && <p className="text-red-500 font-bold text-sm text-center">{error}</p>}
                                <Button type="button" variant="special" onClick={handleGenerateAvatar} className="w-full !py-2" disabled={isGenerating || (!avatarDescription && !uploadedPhoto)}>
                                    {isGenerating ? "Generando..." : "¡Generar Avatar!"}
                                </Button>
                                {isGenerating && <div className="text-center text-purple-700 dark:text-purple-300">Creando magia... ✨</div>}
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-center mt-6 flex-shrink-0">
                    <Button onClick={onClose} variant="primary">
                        Aceptar
                    </Button>
                </div>
            </div>
        </div>
    );
};
