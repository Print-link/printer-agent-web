import { Plus } from 'lucide-react';
import { BaseConfigurationCard } from './BaseConfigurationCard';
import type { BaseConfiguration } from '../../../../../../types';

interface BaseConfigurationsSectionProps {
  baseConfigurations: BaseConfiguration[];
  checkedIndices: Set<number>;
  theme: 'dark' | 'light';
  onAdd: () => void;
  onToggle: (index: number, checked: boolean) => void;
  onUpdate: (index: number, updates: Partial<BaseConfiguration>) => void;
  onDelete: (index: number) => void;
}

export function BaseConfigurationsSection({
  baseConfigurations,
  checkedIndices,
  theme,
  onAdd,
  onToggle,
  onUpdate,
  onDelete,
}: BaseConfigurationsSectionProps) {
  return (
    <section>
      <div className="flex justify-between items-center mb-2">
        <h3
          className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          Step 1: Base Configurations
        </h3>
        <button
          type="button"
          onClick={onAdd}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            theme === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <Plus size={16} />
          Add Base Configuration
        </button>
      </div>
      <p
        className={`text-sm mb-2 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}
      >
        Check the configurations you want to enable. Edit details when checked.
      </p>
      <div className="space-y-2">
        {baseConfigurations.map((config, index) => (
          <div
            key={config.id}
            className={`py-2 px-4 rounded-lg border ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <BaseConfigurationCard
              config={config}
              index={index}
              isChecked={checkedIndices.has(index)}
              theme={theme}
              onToggle={(checked) => onToggle(index, checked)}
              onUpdate={(updates) => onUpdate(index, updates)}
              onDelete={() => {
                if (window.confirm('Are you sure you want to remove this base configuration?')) {
                  onDelete(index);
                }
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

