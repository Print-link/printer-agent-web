import { Plus } from 'lucide-react';
import { OptionCard } from './OptionCard';
import type { PricingOption } from "../../../../../../types";

interface OptionsSectionProps {
  options: PricingOption[];
  editingIndex: number | null;
  theme: 'dark' | 'light';
  onAdd: () => void;
  onEdit: (index: number) => void;
  onUpdate: (index: number, updates: Partial<PricingOption>) => void;
  onCancelEdit: () => void;
  onDelete: (index: number) => void;
}

export function OptionsSection({
  options,
  editingIndex,
  theme,
  onAdd,
  onEdit,
  onUpdate,
  onCancelEdit,
  onDelete,
}: OptionsSectionProps) {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h3
          className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          Step 2: Options
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
          Add Option
        </button>
      </div>
      <p
        className={`text-sm mb-4 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}
      >
        Configure standard options with default states and modifiers
      </p>
      <div className="space-y-3">
        {options.map((option, index) => (
          <div
            key={option.id}
            className={`p-4 rounded-lg border ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            } ${option.default ? 'ring-2 ring-amber-400/50' : ''}`}
          >
            <OptionCard
              option={option}
              index={index}
              isEditing={editingIndex === index}
              theme={theme}
              onEdit={() => onEdit(index)}
              onSave={(updates) => onUpdate(index, updates)}
              onCancel={onCancelEdit}
              onDelete={() => {
                if (window.confirm('Are you sure you want to remove this option?')) {
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

