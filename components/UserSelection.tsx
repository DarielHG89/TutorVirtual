import React, { useState, useRef, useMemo, useEffect } from 'react';
import type { StudentProfile } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { ImageCropper } from './common/ImageCropper';
import { generateAvatarFromText, generateAvatarFromPhoto } from '../services/aiService';
import { playClickSound } from '../utils/sounds';

interface UserSelectionProps {
  users: StudentProfile[];
  onSelectUser: (userId: string) => void;
  onAddNewUser: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenDashboard: (user: StudentProfile) => void;
}

export const UserSelection: React.FC<UserSelectionProps> = ({ users, onSelectUser, onAddNewUser, theme, onToggleTheme, onOpenDashboard }) => {
    
  const getAvatar = (user: StudentProfile) => {
    const avatarContent = user.avatar || (user.gender === 'boy' ? '👦' : '👧');
    
    if (avatarContent.startsWith('data:image')) {
        return <img src={avatarContent} alt={user.name} className="w-24 h-24 rounded-full object-cover mb-2" />;
    }
    
    return <span className="text-7xl mb-2">{avatarContent}</span>;
  };

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center p-8 text-center min-h-full relative">
      <button 
        onClick={() => { playClickSound(); onToggleTheme(); }} 
        title="Cambiar tema" 
        className="absolute top-4 right-4 z-10 p-1 w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        <span className="text-xl" role="img" aria-label="Cambiar Tema">{theme === 'light' ? '🌙' : '☀️'}</span>
      </button>
      <h1 className="font-title text-5xl sm:text-7xl text-slate-800 mb-4 text-gradient">¿Quién está jugando?</h1>
      <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">Elige tu perfil para continuar o crea uno nuevo.</p>
      
      <div className="flex flex-wrap justify-center gap-6 max-w-3xl">
        {users.map((user, index) => (
          <Card 
            key={user.id} 
            onClick={() => onSelectUser(user.id)} 
            className="flex flex-col items-center justify-center p-4 h-48 w-40 animate-staggered-fade-in"
            style={{ animationDelay: `${index * 75}ms` }}
          >
            <div className="absolute top-1 right-1">
              <button 
                onClick={(e) => { e.stopPropagation(); playClickSound(); onOpenDashboard(user); }} 
                className="p-1 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-colors" 
                title={`Ver progreso de ${user.name}`}
              >
                <span role="img" aria-label="Progreso" className="text-xl">📊</span>
              </button>
            </div>
            {getAvatar(user)}
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 break-words w-full">{user.name}</h2>
          </Card>
        ))}
        <Card 
            onClick={onAddNewUser} 
            className="flex flex-col items-center justify-center p-4 h-48 w-40 !bg-green-100/70 !border-green-400 hover:!bg-green-200/80 dark:!bg-green-900/40 dark:!border-green-700 dark:hover:!bg-green-800/50 animate-staggered-fade-in"
            style={{ animationDelay: `${users.length * 75}ms` }}
        >
            <span className="text-7xl mb-2">➕</span>
            <h2 className="text-xl font-bold text-green-800 dark:text-green-300">Nuevo Perfil</h2>
        </Card>
      </div>

    </div>
  );
};


// --- NEW COMPONENT FOR EDITING PROFILE ---

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedData: Partial<Omit<StudentProfile, 'id'>>) => void;
    currentUser: StudentProfile;
}

const boyAvatars = ['🧑‍🚀', '🦸', '🥷', '🤖', '🦖'];
const girlAvatars = ['🧜‍♀️', '🦸‍♀️', '🥷', '🤖', '🦄'];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onSave, currentUser }) => {
    const [name, setName] = useState(currentUser.name);
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(currentUser.avatar || null);
    const [userUploadedAvatars, setUserUploadedAvatars] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);
    const [showAiTools, setShowAiTools] = useState(false);
    const [avatarDescription, setAvatarDescription] = useState('');
    const [uploadedPhoto, setUploadedPhoto] = useState<{data: string; mimeType: string;} | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    
    const geminiFileInputRef = useRef<HTMLInputElement>(null);
    const manualFileInputRef = useRef<HTMLInputElement>(null);
    
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [cropTarget, setCropTarget] = useState<'manual' | 'gemini' | null>(null);

    useEffect(() => {
        if (isOpen) {
            setName(currentUser.name);
            setSelectedAvatar(currentUser.avatar || null);
            setError(null);
            // Reset other states
            setIsAvatarSelectorOpen(false);
            setShowAiTools(false);
            setIsGenerating(false);
        }
    }, [isOpen, currentUser]);
    
    if (!isOpen) return null;

    const handleSave = () => {
        setError(null);
        if (name.trim().length < 2) {
            setError('¡Tu nombre debe tener al menos 2 letras!');
            return;
        }
        if (name.trim().length > 15) {
            setError('Tu nombre es muy largo. ¡Usa un apodo corto!');
            return;
        }
        
        const finalAvatar = selectedAvatar || (currentUser.gender === 'boy' ? '👦' : '👧');
        onSave({ name: name.trim(), avatar: finalAvatar });
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
            setSelectedAvatar(newAvatar);
            setIsAvatarSelectorOpen(false);
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

        const profileInfo = { name: name.trim(), age: currentUser.age, gender: currentUser.gender };

        try {
            let newAvatar: string;
            if (uploadedPhoto) {
                newAvatar = await generateAvatarFromPhoto(uploadedPhoto.data, uploadedPhoto.mimeType, profileInfo);
            } else {
                newAvatar = await generateAvatarFromText(avatarDescription, profileInfo);
            }
            setUserUploadedAvatars(prev => [newAvatar, ...prev]);
            setSelectedAvatar(newAvatar);
            setIsAvatarSelectorOpen(false);
        } catch (err) {
            console.error(err);
            const errorMessage = (err instanceof Error) ? err.message : '¡Oh no! No se pudo generar el avatar. Inténtalo de nuevo.';
            setError(errorMessage);
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleAvatarSelect = (avatar: string) => {
        playClickSound();
        setSelectedAvatar(avatar);
        setIsAvatarSelectorOpen(false);
    };
    
    const currentAvatarList = currentUser.gender === 'boy' ? boyAvatars : girlAvatars;

    const displayedAvatar = useMemo(() => {
        const current = selectedAvatar || (currentUser.gender === 'boy' ? '👦' : '👧');
        if (current.startsWith('data:image')) {
            return <img src={current} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />;
        }
        return <span className="text-7xl">{current}</span>;
    }, [selectedAvatar, currentUser.gender]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            {imageToCrop && <ImageCropper imageUrl={imageToCrop} onCrop={handleCropComplete} onCancel={handleCropCancel} />}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl w-full max-w-md m-4 animate-modal-scale-in flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 text-center mb-6">Editar Perfil</h2>
                
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="text-lg font-bold text-slate-700 dark:text-slate-200 block mb-1">Nombre</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="p-3 text-lg border-2 border-slate-300 dark:border-slate-600 rounded-lg text-center w-full text-black bg-white dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                     <div className="text-center">
                        <label className="text-lg font-bold text-slate-700 dark:text-slate-200 block mb-2">Avatar</label>
                        <button onClick={() => { playClickSound(); setIsAvatarSelectorOpen(true); }} className="p-2 border-4 border-dashed border-slate-300 dark:border-slate-500 rounded-full inline-block hover:border-blue-500 transition-colors">
                            {displayedAvatar}
                        </button>
                    </div>
                </div>

                {error && <p className="text-red-500 font-bold text-center mb-4">{error}</p>}
                
                <div className="flex justify-center gap-4 mt-auto">
                    <Button onClick={onClose} variant="secondary">Cancelar</Button>
                    <Button onClick={handleSave} variant="primary">Guardar Cambios</Button>
                </div>
            </div>

            {isAvatarSelectorOpen && (
                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setIsAvatarSelectorOpen(false)}>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl w-full max-w-xl m-4 animate-modal-scale-in flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                         <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 text-center mb-4 flex-shrink-0">Elige tu Avatar</h3>
                        <div className="overflow-y-auto pr-2">
                             <div className="flex justify-center gap-4 flex-wrap bg-slate-100 dark:bg-slate-700 p-3 rounded-lg mb-4">
                                 <button type="button" onClick={() => handleAvatarSelect(currentUser.gender === 'boy' ? '👦' : '👧')} className={`p-1 border-4 rounded-full transition-transform transform hover:scale-110 ${selectedAvatar === (currentUser.gender === 'boy' ? '👦' : '👧') || selectedAvatar === null ? 'border-blue-500 scale-110' : 'border-transparent'}`}><span className="text-5xl">{currentUser.gender === 'boy' ? '👦' : '👧'}</span></button>
                                {currentAvatarList.map(avatar => (
                                    <button key={avatar} type="button" onClick={() => handleAvatarSelect(avatar)} className={`p-1 border-4 rounded-full transition-transform transform hover:scale-110 ${selectedAvatar === avatar ? 'border-blue-500 scale-110' : 'border-transparent'}`}><span className="text-5xl">{avatar}</span></button>
                                ))}
                                {userUploadedAvatars.map((avatar) => (
                                    <button key={avatar} type="button" onClick={() => handleAvatarSelect(avatar)} className={`p-1 border-4 rounded-full transition-transform transform hover:scale-110 ${selectedAvatar === avatar ? 'border-blue-500 scale-110' : 'border-transparent'}`}><img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover" /></button>
                                ))}
                                <button type="button" onClick={() => { playClickSound(); manualFileInputRef.current?.click(); }} className="p-1 border-4 border-dashed border-slate-300 dark:border-slate-500 rounded-full transition-transform transform hover:scale-110 w-[72px] h-[72px] flex items-center justify-center bg-slate-200 dark:bg-slate-600" title="Subir foto"><span className="text-4xl text-slate-500 dark:text-slate-400">🖼️+</span></button>
                                <input type="file" accept="image/*" ref={manualFileInputRef} onChange={(e) => handleFileSelected(e, 'manual')} className="hidden" />
                            </div>
                            <div className="w-full p-4 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-lg bg-purple-50 dark:bg-purple-900/30">
                                <button type="button" onClick={() => { playClickSound(); setShowAiTools(prev => !prev); }} className="font-bold text-purple-700 dark:text-purple-300 w-full text-lg">Crear Avatar con IA 🤖 {showAiTools ? '▴' : '▾'}</button>
                                {showAiTools && (
                                    <div className="mt-4 space-y-4">
                                        <input type="text" value={avatarDescription} onChange={(e) => { setAvatarDescription(e.target.value); if (e.target.value) setUploadedPhoto(null); }} placeholder="Ej: un astronauta con un gato" className="p-3 text-base border-2 border-purple-200 dark:border-purple-600 rounded-lg text-center w-full text-black bg-white dark:bg-slate-700 dark:text-white" disabled={isGenerating} />
                                        <div className="text-center font-bold text-slate-500 dark:text-slate-400">O</div>
                                        <input type="file" accept="image/*" ref={geminiFileInputRef} onChange={(e) => handleFileSelected(e, 'gemini')} className="hidden" />
                                        <Button type="button" variant="secondary" onClick={() => geminiFileInputRef.current?.click()} className="w-full !py-2 !text-base" disabled={isGenerating}>{uploadedPhoto ? "Foto para IA seleccionada ✔️" : "Subir foto para transformar 🖼️"}</Button>
                                        <Button type="button" variant="special" onClick={handleGenerateAvatar} className="w-full !py-2" disabled={isGenerating || (!avatarDescription && !uploadedPhoto)}>{isGenerating ? "Generando..." : "¡Generar Avatar!"}</Button>
                                        {isGenerating && <div className="text-center text-purple-700 dark:text-purple-300">Creando magia... ✨</div>}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="text-center mt-6 flex-shrink-0">
                            <Button onClick={() => setIsAvatarSelectorOpen(false)} variant="primary">Aceptar</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};