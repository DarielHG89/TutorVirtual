import React, { useState } from 'react';
import { Button } from './common/Button';
import { processUserFeedback } from '../services/aiService';
import { playClickSound } from '../utils/sounds';

interface FeedbackModalProps {
  onClose: () => void;
}

type FeedbackStatus = 'idle' | 'sending' | 'sent';

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose }) => {
    const [feedbackText, setFeedbackText] = useState('');
    const [status, setStatus] = useState<FeedbackStatus>('idle');
    const [aiResponse, setAiResponse] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (feedbackText.trim().length < 10) {
            setError('Por favor, escribe un comentario un poco más largo.');
            return;
        }
        setError('');
        setStatus('sending');
        try {
            const response = await processUserFeedback(feedbackText);
            setAiResponse(response);
            setStatus('sent');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Ocurrió un error.';
            setError(`Error al enviar: ${message}`);
            setStatus('idle');
        }
    };

    const handleClose = () => {
        // Reset state on close
        setFeedbackText('');
        setStatus('idle');
        setAiResponse('');
        setError('');
        onClose();
    };
    
    const handleOverlayClick = () => {
        playClickSound();
        handleClose();
    }

    const renderContent = () => {
        switch (status) {
            case 'sent':
                return (
                    <div className="text-center">
                        <p className="text-4xl mb-4">🎉</p>
                        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">¡Gracias por tu ayuda!</p>
                        <div className="mt-4 bg-slate-100 dark:bg-slate-700 p-3 rounded-lg text-slate-600 dark:text-slate-400 text-left">
                            <p>{aiResponse}</p>
                        </div>
                    </div>
                );
            case 'sending':
                return (
                    <div className="text-center p-8">
                        <div role="status" className="flex justify-center items-center">
                            <svg aria-hidden="true" className="w-8 h-8 text-slate-200 animate-spin dark:text-slate-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span className="sr-only">Enviando...</span>
                        </div>
                        <p className="mt-4 text-slate-600 dark:text-slate-400">Enviando tu mensaje al Maestro Digital...</p>
                    </div>
                );
            case 'idle':
            default:
                return (
                    <>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">¿Tienes alguna idea para mejorar la aplicación? ¿Encontraste algún error? ¡Cuéntanos! Tu opinión es muy importante.</p>
                        <textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            className="w-full h-32 p-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Escribe tu sugerencia aquí..."
                        />
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </>
                );
        }
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            onClick={handleOverlayClick}
        >
            <div 
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl w-full max-w-md m-4 animate-modal-scale-in"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 text-center mb-4">Enviar Sugerencias</h2>
                <div className="text-slate-600 mb-6 text-left dark:text-slate-400">
                    {renderContent()}
                </div>
                 <div className="flex justify-center gap-4">
                    <Button onClick={handleClose} variant="secondary">
                        {status === 'sent' ? 'Cerrar' : 'Cancelar'}
                    </Button>
                    {/* FIX: Changed condition from 'status === "idle"' to 'status !== "sent"' to correctly handle the button's display and state during 'idle' and 'sending' statuses, resolving the type overlap error. */}
                    {status !== 'sent' && (
                        <Button onClick={handleSubmit} variant="primary" disabled={status === 'sending' || feedbackText.trim().length < 10}>
                            {status === 'sending' ? 'Enviando...' : 'Enviar'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};