import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    onConfirm, 
    confirmText = 'Confirmar', 
    cancelText = 'Cancelar',
    confirmVariant = 'primary',
    maxWidth = 'max-w-md'
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleConfirm = async () => {
    if (onConfirm) {
      try {
        await onConfirm();
        onClose();
      } catch (err) {
        // Do not close if there's an error
        console.error("Modal confirmation failed:", err);
      }
    } else {
      onClose();
    }
  };

  const handleOverlayClick = () => {
    playClickSound();
    onClose();
  };

  const modalContent = (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[9999] animate-fade-in p-2 sm:p-4"
        onClick={handleOverlayClick}
    >
      <div 
        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[95vh] flex flex-col m-auto animate-modal-scale-in relative border border-white/20 dark:border-slate-700/50 overflow-hidden`}
        onClick={e => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 truncate pr-8">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Cerrar"
          >
            ✕
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 text-slate-600 dark:text-slate-400">
          {children}
        </div>
        
        {/* Fixed Footer */}
        {(onConfirm || cancelText) && (
          <div className="px-6 py-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-2">
            <button 
              onClick={onClose} 
              className="px-3 py-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 uppercase tracking-widest transition-colors"
            >
              {cancelText}
            </button>
            {onConfirm && (
              <Button onClick={handleConfirm} variant={confirmVariant} className="px-4 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm">
                {confirmText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
