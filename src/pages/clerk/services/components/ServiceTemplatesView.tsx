import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import type { ServiceTemplate } from '../../../../types';

interface ServiceTemplatesViewProps {
  templates: ServiceTemplate[];
  onTemplateSelect: (template: ServiceTemplate) => void;
  onBack: () => void;
  onViewAgentServices: () => void;
  isLoading: boolean;
}

export function ServiceTemplatesView({
  templates,
  onTemplateSelect,
  onBack,
  onViewAgentServices,
  isLoading,
}: ServiceTemplatesViewProps) {
  const { theme } = useTheme();

  return (
    <div className={`rounded-lg border p-6 ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`p-2 rounded-md border flex items-center justify-center transition-colors ${
              theme === 'dark'
                ? 'border-gray-600 bg-transparent hover:bg-gray-700 text-gray-300'
                : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700'
            }`}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className={`text-lg font-semibold m-0 ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Select a Service Template
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                Read-Only
              </span>
            </div>
            <p className={`text-xs m-0 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Templates are platform-owned. Select one to configure pricing for your branch.
            </p>
          </div>
        </div>
        <button
          onClick={onViewAgentServices}
          className={`px-4 py-2 rounded-md border transition-colors ${
            theme === 'dark'
              ? 'border-gray-600 bg-transparent hover:bg-gray-700 text-gray-300'
              : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700'
          } text-sm font-medium`}
        >
          View All Services
        </button>
      </div>
      {isLoading ? (
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Loading templates...
        </p>
      ) : templates.length === 0 ? (
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          No service templates available
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => onTemplateSelect(template)}
              className={`p-5 rounded-lg border text-left transition-all duration-200 flex flex-col gap-3 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-600 hover:border-amber-400 hover:bg-gray-700/50'
                  : 'bg-white border-gray-200 hover:border-amber-400 hover:bg-amber-50/50'
              }`}
            >
              <h3 className={`text-base font-semibold m-0 mb-2 ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
              }`}>
                {template.name}
              </h3>
              {template.description && (
                <p className={`text-sm m-0 mb-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {template.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  theme === 'dark'
                    ? 'bg-amber-400/20 text-amber-300'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {template.measurementUnit}
                </span>
                {template.supportsColor && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    theme === 'dark'
                      ? 'bg-amber-400/20 text-amber-300'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    Color
                  </span>
                )}
                {template.supportsFrontBack && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    theme === 'dark'
                      ? 'bg-amber-400/20 text-amber-300'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    Front/Back
                  </span>
                )}
                {template.supportsPrintCut && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    theme === 'dark'
                      ? 'bg-amber-400/20 text-amber-300'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    Print & Cut
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

