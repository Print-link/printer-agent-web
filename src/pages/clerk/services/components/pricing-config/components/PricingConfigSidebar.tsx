import { CheckCircle2 } from 'lucide-react';

interface PricingConfigSidebarProps {
  currentStep: number;
  steps: {
    id: number;
    title: string;
    description: string;
    icon: React.ElementType;
  }[];
  theme: 'dark' | 'light';
  onStepClick: (stepId: number) => void;
}

export function PricingConfigSidebar({
  currentStep,
  steps,
  theme,
  onStepClick,
}: PricingConfigSidebarProps) {
  return (
    <div
      className={`h-full flex flex-col p-4 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      <div className="space-y-4">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              onClick={() => (isCompleted || isActive) && onStepClick(step.id)}
              className={`relative flex items-center gap-3 p-2 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'
                  : 'hover:bg-gray-800/30'
              } ${isCompleted || isActive ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : isCompleted
                    ? 'text-blue-500'
                    : theme === 'dark'
                    ? 'text-gray-600'
                    : 'text-gray-400'
                }`}
              >
                {isCompleted ? <CheckCircle2 size={16} /> : <Icon size={16} />}
              </div>

              <span
                className={`text-xs font-bold tracking-wide transition-colors ${
                  isActive
                    ? theme === 'dark' ? 'text-white' : 'text-blue-600'
                    : isCompleted
                    ? theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    : theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`}
              >
                {step.title}
              </span>

              {isActive && (
                <div className="absolute right-2 w-1 h-4 bg-blue-500 rounded-full" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
