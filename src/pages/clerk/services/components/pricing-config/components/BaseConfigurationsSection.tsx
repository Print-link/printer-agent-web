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
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-sm font-black uppercase tracking-widest ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          Pricing Models
        </h3>
        <button
          type="button"
          onClick={onAdd}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
            theme === 'dark'
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20'
          }`}
        >
          <Plus size={14} />
          <span>Add Model</span>
        </button>
      </div>

      <div className="space-y-2">
        {baseConfigurations.map((config, index) => (
          <BaseConfigurationCard
            key={config.id}
            config={config}
            index={index}
            isChecked={checkedIndices.has(index)}
            theme={theme}
            onToggle={(checked) => onToggle(index, checked)}
            onUpdate={(updates) => onUpdate(index, updates)}
            onDelete={() => onDelete(index)}
          />
        ))}
      </div>
    </section>
  );
}
