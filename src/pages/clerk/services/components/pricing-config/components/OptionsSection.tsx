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
        <h3 className={`text-sm font-black uppercase tracking-widest ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          Standard Options
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
          <span>Add Option</span>
        </button>
      </div>

      <div className="space-y-2">
        {options.map((option, index) => (
          <OptionCard
            key={option.id}
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
        ))}

        {options.length === 0 && (
          <p className={`text-xs text-center py-6 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            No options defined.
          </p>
        )}
      </div>
    </section>
  );
}
