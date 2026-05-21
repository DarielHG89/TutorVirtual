import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './common/Button';
import { useSpeech } from '../context/SpeechContext';
import { playClickSound, playMilestoneSound } from '../utils/sounds';

interface TourStep {
  selector?: string;
  title: string;
  text: string;
  icon: string;
  position: 'top' | 'bottom' | 'center';
}

const TOUR_STEPS: TourStep[] = [
  {
    title: '¡Bienvenido a tu Panel de Estudio!',
    text: '¡Hola! Soy tu Maestro Digital de matemáticas. He creado esta divertida guía para que conozcas cómo usar tu panel principal y sacarle el máximo provecho a nuestro viaje juntos. ¿Comenzamos?',
    icon: '👋',
    position: 'center'
  },
  {
    selector: '#subject-selector',
    title: 'Elige tu Asignatura',
    text: 'En esta sección puedes ver tu Grado actual y elegir la Asignatura que deseas estudiar. ¡Tenemos lecciones y prácticas maravillosas listas para ti!',
    icon: '📚',
    position: 'bottom'
  },
  {
    selector: '#study-area-btn',
    title: '🗺️ Modo Historia',
    text: '¡Este es tu camino de aprendizaje! Aquí encontrarás lecciones interactivas ordenadas paso a paso. Completa las lecciones y cuestionarios para avanzar y abrir nuevos retos.',
    icon: '🗺️',
    position: 'bottom'
  },
  {
    selector: '#mini-games-btn',
    title: '🕹️ Juegos Rápidos',
    text: '¿Quieres divertirte y agilizar tu mente? Juega a Number Ninja, Memory Math o Speed Math. ¡Los juegos ideales para entrenar tu cerebro saltando y jugando!',
    icon: '🕹️',
    position: 'bottom'
  },
  {
    selector: '#ai-chat-btn',
    title: '🤖 Charla con el Maestro (IA)',
    text: '¡Hablemos en vivo! En esta sección puedes chatear conmigo por texto o hablando usando tu micrófono. ¡Puedo responder tus preguntas matemáticas o contarte chistes divertidos!',
    icon: '🤖',
    position: 'bottom'
  },
  {
    selector: '#practice-modes-grid',
    title: '🤸 Modos de Práctica',
    text: 'A medida que completes lecciones del Modo Historia, desbloquearás prácticas específicas aquí. ¡Si logras puntajes perfectos (10/10), ganarás una copa de oro de Maestría para tu vitrina!',
    icon: '🏆',
    position: 'top'
  },
  {
    selector: '#other-modes-section',
    title: '📝 Exámenes y Repaso IA',
    text: '¿Listo para un súper reto? Puedes tomar un Examen Semanal de todo lo aprendido, o pedirme un práctico Repaso IA personalizado según tus respuestas previas.',
    icon: '🧠',
    position: 'top'
  },
  {
    selector: '#parent-settings-btn',
    title: '🔑 Panel de Padres y Configuración',
    text: 'Esta es el área segura para tus papás o tutores. Aquí ellos pueden ver tus estadísticas de tiempo de estudio, precisión, gestionar contenidos de estudio y configurar mi conexión de Inteligencia Artificial.',
    icon: '⚙️',
    position: 'top'
  },
  {
    title: '¡Todo Listo para Aprender!',
    text: 'Has conocido todos los rincones de tu panel. ¡Disfruta el aprendizaje, recuerda que equivocarse es parte de mejorar, y nos vemos en las lecciones! ¡A divertirse!',
    icon: '🚀',
    position: 'center'
  }
];

interface GuidedTourProps {
  onFinish: () => void;
  userName: string;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({ onFinish, userName }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const { speak } = useSpeech();
  const observerRef = useRef<ResizeObserver | null>(null);

  const currentStep = useMemo(() => TOUR_STEPS[currentStepIndex], [currentStepIndex]);

  // Handle TTS speech trigger for each step
  useEffect(() => {
    let textToSpeak = currentStep.text;
    if (currentStepIndex === 0) {
      textToSpeak = `¡Hola, ${userName}! ¡Bienvenido a tu Panel de Estudio! ${textToSpeak}`;
    }
    // Boost the welcome & goodbye steps with celebratory/enthusiastic voice!
    const isSpecialStep = currentStepIndex === 0 || currentStepIndex === TOUR_STEPS.length - 1;
    speak(textToSpeak, { enthusiastic: isSpecialStep });
  }, [currentStepIndex, speak, userName]);

  // Update highlight position relative to current targeted DOM element
  const updateHighlightPosition = () => {
    if (currentStep.selector) {
      const el = document.querySelector(currentStep.selector);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
  };

  useEffect(() => {
    // 1. If has selector, scroll into view smoothly first
    if (currentStep.selector) {
      const el = document.querySelector(currentStep.selector);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // 2. Schedule calculation slight delay to allow smooth scrolling to finalize
    const timer = setTimeout(() => {
      updateHighlightPosition();
    }, 500);

    // 3. Set up event listeners for resize & scroll
    window.addEventListener('resize', updateHighlightPosition);
    window.addEventListener('scroll', updateHighlightPosition, true);

    // 4. Setup ResizeObserver for layout changes
    if (currentStep.selector) {
      const el = document.querySelector(currentStep.selector);
      if (el && 'ResizeObserver' in window) {
        observerRef.current = new ResizeObserver(() => {
          updateHighlightPosition();
        });
        observerRef.current.observe(el);
      }
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateHighlightPosition);
      window.removeEventListener('scroll', updateHighlightPosition, true);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [currentStepIndex, currentStep.selector]);

  const handleNext = () => {
    playClickSound();
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      playMilestoneSound();
      onFinish();
    }
  };

  const handleBack = () => {
    playClickSound();
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleSkip = () => {
    playClickSound();
    playMilestoneSound();
    onFinish();
  };

  // Compute absolute positioning bounds for Spotlight overlay clipping mask (using border overlays)
  const overlays = useMemo(() => {
    if (!targetRect) return null;
    
    // Add extra padding around the highlighted area for visual breathing room
    const padding = 6;
    const top = Math.max(0, targetRect.top - padding);
    const left = Math.max(0, targetRect.left - padding);
    const width = targetRect.width + (padding * 2);
    const height = targetRect.height + (padding * 2);

    return {
      top: { top: 0, left: 0, right: 0, height: top },
      left: { top, left: 0, width: left, height },
      right: { top, left: left + width, right: 0, height },
      bottom: { top: top + height, left: 0, right: 0, bottom: 0 }
    };
  }, [targetRect]);

  // Compute popover relative positioning coords based on rect placement options
  const popoverStyle = useMemo(() => {
    if (!targetRect) {
      return {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 100
      };
    }

    const padding = 16;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let popoverTop = 0;
    let popoverLeft = 0;

    // Default positioning logic depending on position preference: 'top' vs 'bottom'
    if (currentStep.position === 'top') {
      popoverTop = targetRect.top - 230; // approx height of popover
      popoverLeft = targetRect.left + (targetRect.width / 2) - 170; // center popover
      
      // Keep within bounds
      if (popoverTop < padding) {
        popoverTop = targetRect.bottom + padding; // Flip to bottom if clipping top
      }
    } else {
      // Bottom positioning
      popoverTop = targetRect.bottom + padding;
      popoverLeft = targetRect.left + (targetRect.width / 2) - 170; // center popover

      // Keep within bounds
      if (popoverTop + 230 > viewportHeight) {
        popoverTop = targetRect.top - 230 - padding; // Flip to top if clipping bottom
      }
    }

    // Horizontal boundaries protection
    if (popoverLeft < padding) popoverLeft = padding;
    if (popoverLeft + 340 > viewportWidth) popoverLeft = viewportWidth - 340 - padding;

    return {
      position: 'fixed' as const,
      top: `${Math.max(padding, popoverTop)}px`,
      left: `${popoverLeft}px`,
      zIndex: 100
    };
  }, [targetRect, currentStep.position]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[999] id-guided-tour-overlay">
      {/* 1. Backdrop Masks */}
      <AnimatePresence>
        {overlays ? (
          <>
            {/* Top panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                ...overlays.top,
                background: 'rgba(15, 23, 42, 0.7)',
                pointerEvents: 'auto'
              }}
              className="backdrop-blur-[2px]"
            />
            {/* Left panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                ...overlays.left,
                background: 'rgba(15, 23, 42, 0.7)',
                pointerEvents: 'auto'
              }}
              className="backdrop-blur-[2px]"
            />
            {/* Right panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                ...overlays.right,
                background: 'rgba(15, 23, 42, 0.7)',
                pointerEvents: 'auto'
              }}
              className="backdrop-blur-[2px]"
            />
            {/* Bottom panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                ...overlays.bottom,
                background: 'rgba(15, 23, 42, 0.7)',
                pointerEvents: 'auto'
              }}
              className="backdrop-blur-[2px]"
            />
          </>
        ) : (
          /* Full screen backdrop for non-targeted welcome/goodbye screens */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/75 backdrop-blur-[3px] pointer-events-auto"
          />
        )}
      </AnimatePresence>

      {/* 2. Highlight box cutout animation around elements */}
      <AnimatePresence>
        {targetRect && (
          <motion.div
            key={`highlight-${currentStepIndex}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              boxShadow: [
                "0 0 15px rgba(251,191,36,0.5)", 
                "0 0 30px rgba(251,191,36,0.85)", 
                "0 0 15px rgba(251,191,36,0.5)"
              ]
            }}
            exit={{ opacity: 0, scale: 1.05 }}
            style={{
              position: 'fixed',
              top: targetRect.top - 8,
              left: targetRect.left - 8,
              width: targetRect.width + 16,
              height: targetRect.height + 16,
            }}
            className="border-4 border-dashed border-amber-400 dark:border-amber-400 rounded-2xl pointer-events-none z-[1000] shadow-[0_0_24px_rgba(251,191,36,0.7)]"
            transition={{ opacity: { duration: 0.2 }, scale: { duration: 0.2 }, boxShadow: { repeat: Infinity, duration: 2 } }}
          />
        )}
      </AnimatePresence>

      {/* 3. Guided Popover Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          key={`popover-${currentStepIndex}`}
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -10 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          style={popoverStyle}
          className="w-[340px] md:w-[360px] bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl border-4 border-indigo-400 dark:border-indigo-500 relative pointer-events-auto flex flex-col justify-between"
        >
          {/* Step content */}
          <div>
            {/* Header / Info Badge */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-slate-700/50 px-3 py-1.5 rounded-full">
                Guía Paso a Paso • {currentStepIndex + 1}/{TOUR_STEPS.length}
              </span>
              <button 
                onClick={handleSkip}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Saltar Tutorial"
              >
                Saltar
              </button>
            </div>

            {/* Title & Icon */}
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-2 mb-2">
              <span className="text-2xl" role="img" aria-label="Icono etapa">{currentStep.icon}</span>
              <span>
                {currentStepIndex === 0 ? `¡Hola, ${userName}! 👋` : currentStep.title}
              </span>
            </h3>

            {/* Description Text */}
            <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300 mb-5">
              {currentStep.text}
            </p>
          </div>

          {/* Nav Dots & Control Buttons */}
          <div>
            <div className="flex justify-center gap-1.5 mb-4">
              {TOUR_STEPS.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === currentStepIndex ? 'w-5 bg-indigo-500' : 'w-2 bg-slate-200 dark:bg-slate-700'}`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
              {currentStepIndex > 0 ? (
                <Button 
                  onClick={handleBack} 
                  variant="secondary"
                  className="!py-2 !px-4 text-sm font-bold"
                >
                  Atrás
                </Button>
              ) : (
                <div />
              )}

              <Button 
                onClick={handleNext} 
                variant={currentStepIndex === TOUR_STEPS.length - 1 ? 'special' : 'primary'}
                className="!py-2 !px-5 text-sm font-bold ml-auto"
              >
                {currentStepIndex === TOUR_STEPS.length - 1 ? '¡Explorar Panel! 🚀' : 'Siguiente'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
