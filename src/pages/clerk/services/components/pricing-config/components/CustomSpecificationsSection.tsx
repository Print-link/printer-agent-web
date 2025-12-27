import { Plus } from 'lucide-react';
import { CustomSpecCard } from './CustomSpecCard';
import type { CustomSpecification } from '../../../../../types';

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
        <h3
          className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          Step 3: Custom Specifications
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
          Add Custom Specification
        </button>
      </div>
      <p
        className={`text-sm mb-4 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}
      >
        Add optional extras that customers can select
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customSpecifications.map((spec, index) => (
          <div
            key={spec.id}
            className={`p-4 rounded-lg border ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <CustomSpecCard
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
          </div>
        ))}
        {customSpecifications.length === 0 && (
          <p
            className={`text-sm text-center py-8 col-span-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            No custom specifications. Click "Add Custom Specification" to create one.
          </p>
        )}
      </div>
    </section>
  );
}

