import { CheckCircle } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';

export interface Step {
  id: number;
  title: string;
  description: string;
}

interface BranchFormStepperProps {
  steps: Step[];
  currentStep: number;
}

export function BranchFormStepper({ steps, currentStep }: BranchFormStepperProps) {
  const { theme } = useTheme();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep > step.id
                  ? 'bg-green-500 text-white'
                  : currentStep === step.id
                  ? 'bg-amber-400 text-gray-900'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-400'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircle size={20} />
                ) : (
                  step.id
                )}
              </div>
              <p className={`text-xs mt-2 text-center ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 ${
                currentStep > step.id
                  ? 'bg-green-500'
                  : theme === 'dark'
                  ? 'bg-gray-700'
                  : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

