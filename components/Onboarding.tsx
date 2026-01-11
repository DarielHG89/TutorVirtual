import React, { useState } from 'react';
import { Button } from './common/Button';
import type { StudentProfile } from '../types';

// Step definition
interface OnboardingStep {
  icon: string;
  title: string;
  text: string;
}

const steps: OnboardingStep[] = [
  {
    icon: '👋',
    title: '¡Bienvenido/a',
    text: 'Soy tu Maestro Digital, tu compañero de aventuras en el mundo de las matemáticas. ¡Estoy aquí para ayudarte a aprender y a divertirte!',
  },
  {
    icon: '📘',
    title: 'Área de Estudio',
    text: 'Este es tu camino principal. Sigue las lecciones en orden para aprender nuevos temas y desbloquear más prácticas. ¡Es como un videojuego!',
  },
  {
    icon: '🤸',
    title: 'Modos de Práctica',
    text: 'Usa la "Práctica Libre" para repasar lo que quieras y los "Exámenes" para poner a prueba tus conocimientos. ¡La práctica hace al maestro!',
  },
  {
    icon: '🤖',
    title: 'Tu Tutor con IA',
    text: 'Cuando te equivoques, te daré explicaciones y pistas. ¡También puedes hablar conmigo en "Charla con el Maestro" para practicar y divertirte!',
  },
  {
    icon: '🚀',
    title: '¡Todo listo!',
    text: 'Tu aventura está a punto de comenzar. ¡No tengas miedo a equivocarte, cada error es una oportunidad para aprender! ¿Listo/a?',
  },
];

interface OnboardingProps {
  user: StudentProfile;
  onFinish: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ user, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal animate-modal-scale-in">
        <div className="onboarding-icon">{step.icon}</div>
        <h2 className="onboarding-title">
          {step.title} {currentStep === 0 && user.name}!
        </h2>
        <p className="onboarding-text">{step.text}</p>
        
        <div className="onboarding-dots">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`onboarding-dot ${index === currentStep ? 'active' : ''}`}
            />
          ))}
        </div>

        <div className="onboarding-nav">
          {currentStep > 0 && (
            <Button onClick={handleBack} variant="secondary">
              Atrás
            </Button>
          )}
          <Button onClick={handleNext} variant={currentStep === steps.length - 1 ? 'special' : 'primary'}>
            {currentStep === steps.length - 1 ? '¡A Aprender!' : 'Siguiente'}
          </Button>
        </div>
      </div>
    </div>
  );
};
