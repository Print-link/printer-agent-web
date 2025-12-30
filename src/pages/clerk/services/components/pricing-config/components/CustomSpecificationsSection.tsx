import { Plus } from 'lucide-react';
import { CustomSpecCard } from './CustomSpecCard';
import type { CustomSpecification } from "../../../../../../types";

interface CustomSpecificationsSectionProps {
  customSpecifications: CustomSpecification[];
  editingIndex: number | null;
  theme: 'dark' | 'light';
  onAdd: () => void;
  onEdit: (index: number) => void;
  onUpdate: (index: number, updates: Partial<CustomSpecification>) => void;
  onCancelEdit: () => void;
  onDelete: (index: number) => void;
}

export function CustomSpecificationsSection({
  customSpecifications,
  editingIndex,
  theme,
  onAdd,
  onEdit,
  onUpdate,
  onCancelEdit,
  onDelete,
}: CustomSpecificationsSectionProps) {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-sm font-black uppercase tracking-widest ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          Specific Details
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
          <span>Add Detail</span>
        </button>
      </div>

      <div className="space-y-2">
        {customSpecifications.map((spec, index) => (
          <CustomSpecCard
            key={spec.id}
            spec={spec}
            index={index}
            isEditing={editingIndex === index}
            theme={theme}
            onEdit={() => onEdit(index)}
            onSave={(updates) => onUpdate(index, updates)}
            onCancel={onCancelEdit}
            onDelete={() => {
              if (window.confirm('Are you sure you want to remove this custom specification?')) {
                onDelete(index);
              }
            }}
          />
        ))}

        {customSpecifications.length === 0 && (
          <p className={`text-xs text-center py-6 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            No custom specs defined.
          </p>
        )}
      </div>
    </section>
  );
}
