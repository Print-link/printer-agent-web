import { Plus } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import type { ServiceTemplate } from '../../../../types';

interface ServiceTemplatesViewProps {
  templates: ServiceTemplate[];
  onTemplateSelect: (template: ServiceTemplate) => void;
  onBack: () => void;
  onViewAgentServices: (template: ServiceTemplate) => void;
  isLoading?: boolean;
  onAddCustomTemplate: () => void;
  onEditTemplate: (template: ServiceTemplate) => void;
  onDeleteTemplate: (template: ServiceTemplate) => void;
}

export function ServiceTemplatesView({
  templates,
  onTemplateSelect,
  onBack,
  // onViewAgentServices,
  isLoading,
  onAddCustomTemplate,
  onEditTemplate,
  onDeleteTemplate,
}: ServiceTemplatesViewProps) {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={onBack}
            className={`text-sm font-medium mb-2 hover:underline transition-colors ${
              theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
            }`}
          >
            &larr; Back to Sub-Categories
          </button>
          <h2 className={`text-2xl font-bold m-0 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Service Templates
          </h2>
          <p className={`text-sm mt-1 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Select a template to configure pricing for your branch
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAddCustomTemplate}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Plus size={18} />
            Create Custom Template
          </button>
          <button
            onClick={onBack}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
        </div>
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
            <div
              key={template.id}
              className={`p-5 rounded-lg border text-left transition-all duration-200 flex flex-col gap-3 relative group ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-600 hover:border-amber-400'
                  : 'bg-white border-gray-200 hover:border-amber-400'
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className={`text-base font-semibold m-0 mb-2 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {template.name}
                </h3>
                {template.branchId ? (
                   <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    Custom
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                    Platform
                  </span>
                )}
              </div>
              {template.description && (
                <p className={`text-sm m-0 mb-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {template.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mb-2">
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

              <div className="mt-auto flex gap-2">
                <button
                  onClick={() => onTemplateSelect(template)}
                  className={`flex-1 py-1.5 rounded text-xs font-medium text-center transition-colors ${
                    theme === 'dark'
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                >
                  Add Pricing
                </button>
                {template.branchId && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEditTemplate(template)}
                      className={`px-2 py-1.5 rounded text-xs transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteTemplate(template)}
                      className={`px-2 py-1.5 rounded text-xs transition-colors ${
                        theme === 'dark'
                          ? 'bg-red-900/30 hover:bg-red-900/50 text-red-400'
                          : 'bg-red-50 hover:bg-red-100 text-red-600'
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
