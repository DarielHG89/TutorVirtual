import React from 'react';
import { Button } from './Button';
import { playClickSound } from '../../utils/sounds';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'secondary' | 'special' | 'warning';
}

export const Modal: React.FC<ModalProps> = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    onConfirm, 
    confirmText = 'Confirmar', 
    cancelText = 'Cancelar',
    confirmVariant = 'primary'
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const handleOverlayClick = () => {
    playClickSound();
    onClose();
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
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 text-center mb-4">{title}</h2>
        <div className="text-slate-600 dark:text-slate-400 mb-6 text-center">
          {children}
        </div>
        <div className="flex justify-center gap-4">
          <Button onClick={onClose} variant="secondary">
            {cancelText}
          </Button>
          {onConfirm && (
            <Button onClick={handleConfirm} variant={confirmVariant}>
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};