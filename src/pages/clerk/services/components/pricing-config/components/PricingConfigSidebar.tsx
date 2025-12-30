import { Layers, ListChecks, Settings, CheckCircle2 } from 'lucide-react';

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
      className={`w-64 flex-shrink-0 border-r p-4 ${
        theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'
      }`}
    >
      <div className="space-y-6">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              onClick={() => isCompleted && onStepClick(step.id)}
              className={`relative flex items-start gap-3 transition-colors ${
                isCompleted ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              {/* Connector Line */}
              {index !== steps.length - 1 && (
                <div
                  className={`absolute left-4 top-8 bottom-[-24px] w-0.5 ${
                    isCompleted
                      ? 'bg-blue-500'
                      : theme === 'dark'
                      ? 'bg-gray-700'
                      : 'bg-gray-200'
                  }`}
                />
              )}

              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                  isActive
                    ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : isCompleted
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : theme === 'dark'
                    ? 'border-gray-600 bg-gray-800 text-gray-500'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}
              >
                {isCompleted ? <CheckCircle2 size={16} /> : <Icon size={16} />}
              </div>

              <div className="pt-1">
                <p
                  className={`text-sm font-semibold leading-none mb-1 ${
                    isActive
                      ? theme === 'dark'
                        ? 'text-white'
                        : 'text-gray-900'
                      : isCompleted
                      ? theme === 'dark'
                        ? 'text-gray-200'
                        : 'text-gray-700'
                      : theme === 'dark'
                      ? 'text-gray-500'
                      : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </p>
                <p
                  className={`text-xs ${
                    isActive
                      ? 'text-blue-500'
                      : theme === 'dark'
                      ? 'text-gray-600'
                      : 'text-gray-500'
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
