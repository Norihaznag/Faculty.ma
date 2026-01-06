import React from 'react';

interface StepperProps {
  steps: string[];
  currentStep: number; // 0-indexed
  onStepClick?: (step: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps): React.ReactNode {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((label, index) => (
        <div key={index} className="flex items-center flex-1">
          <button
            onClick={() => onStepClick?.(index)}
            disabled={index > currentStep}
            className={`
              flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
              font-semibold text-sm transition-all duration-200
              ${
                index < currentStep
                  ? 'bg-green-600 text-white'
                  : index === currentStep
                    ? 'bg-slate-900 text-white ring-2 ring-slate-900 ring-offset-2'
                    : 'bg-slate-200 text-slate-600'
              }
              ${index > currentStep ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
            `}
          >
            {index + 1}
          </button>
          <div className="hidden sm:block text-xs font-medium text-slate-600 ml-2 mb-6">
            {label}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`
                flex-1 h-1 mx-2 transition-colors duration-200
                ${index < currentStep ? 'bg-green-600' : 'bg-slate-200'}
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
}
