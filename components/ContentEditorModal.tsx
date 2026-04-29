
import React, { useState } from 'react';
import { Modal } from './common/Modal';
import { Card } from './common/Card';

interface ContentEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    initialValue: string;
    onSave: (newValue: string) => void | Promise<void>;
    type?: 'text' | 'html' | 'json';
}

export const ContentEditorModal: React.FC<ContentEditorModalProps> = ({ 
    isOpen, 
    onClose, 
    title, 
    initialValue, 
    onSave,
    type = 'text'
}) => {
    const [value, setValue] = useState(initialValue);

    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sync value when initialValue changes or modal opens
    React.useEffect(() => {
        if (isOpen) {
            setValue(initialValue);
            setError(null);
            setIsSaving(false);
            setIsSaved(false);
        }
    }, [initialValue, isOpen]);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setError(null);
            await onSave(value);
            setIsSaved(true);
            setIsSaving(false);
            // Wait 1.5 seconds to show success message
            await new Promise(resolve => setTimeout(resolve, 1500));
            // Modal will close automatically because Modal.tsx awaits handleSave and then calls onClose()
        } catch (err) {
            console.error(err);
            if (err instanceof SyntaxError) {
                setError("Error de formato JSON: " + err.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Error al guardar. Inténtalo de nuevo.");
            }
            setIsSaving(false);
            setIsSaved(false);
            throw err; // Rethrow to prevent Modal from closing
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={isSaving || isSaved ? () => {} : onClose} 
            title={title} 
            maxWidth="max-w-2xl"
            onConfirm={handleSave}
            confirmText={isSaved ? "¡GUARDADO! ✅" : isSaving ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
            confirmVariant={isSaved ? "special" : "primary"}
        >
            <div className="space-y-4 min-w-[300px] md:min-w-[500px] relative">
                {isSaved && (
                    <div className="fixed inset-x-0 top-1/2 transform -translate-y-1/2 z-50 flex justify-center pointer-events-none">
                        <div className="bg-green-600 text-white p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4 animate-modal-scale-in border-4 border-white">
                            <span className="text-6xl animate-bounce">✅</span>
                            <span className="text-xl font-black uppercase tracking-widest text-center px-4">¡Guardado con éxito!</span>
                        </div>
                    </div>
                )}
                
                {isSaving && (
                    <div className="absolute inset-0 z-40 bg-white/50 dark:bg-slate-800/50 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">GUARDANDO...</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-bold">
                        {error}
                    </div>
                )}
                
                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md border border-amber-200 dark:border-amber-800">
                    <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                        {type === 'html' ? '💡 Editando HTML/Teoría. Usa etiquetas como <b>, <p>, etc.' : 
                         type === 'json' ? '💡 Editando JSON. Asegúrate de mantener la estructura válida.' : 
                         '💡 Editando texto directo.'}
                    </p>
                </div>
                
                {type === 'json' ? (
                    <textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full h-96 p-4 font-mono text-sm border-2 border-blue-200 dark:border-slate-700 rounded-lg dark:bg-slate-900 focus:border-blue-500 outline-none transition-all dark:text-slate-200 shadow-inner"
                        spellCheck={false}
                        disabled={isSaving}
                    />
                ) : (
                    <textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full h-80 p-4 border-2 border-blue-200 dark:border-slate-700 rounded-lg dark:bg-slate-900 focus:border-blue-500 outline-none transition-all dark:text-slate-200 shadow-inner"
                        disabled={isSaving}
                    />
                )}
            </div>
        </Modal>
    );
};
