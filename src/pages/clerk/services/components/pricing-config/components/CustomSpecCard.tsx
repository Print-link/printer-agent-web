import { Edit, Trash2, Check } from 'lucide-react';
import type { CustomSpecification } from '../../../../../types';

interface CustomSpecCardProps {
  spec: CustomSpecification;
  index: number;
  isEditing: boolean;
  theme: 'dark' | 'light';
  onEdit: () => void;
  onSave: (updates: Partial<CustomSpecification>) => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function CustomSpecCard({
  spec,
  index,
  isEditing,
  theme,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: CustomSpecCardProps) {
  if (isEditing) {
    return (
      <div className="space-y-3">
        <input
          type="text"
          value={spec.name}
          onChange={(e) => onSave({ name: e.target.value })}
          className={`w-full p-2 rounded-md border text-sm ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-600 text-gray-100'
              : 'bg-white border-gray-300 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-amber-400`}
        />
        <input
          type="number"
          step="0.01"
          value={spec.priceModifier}
          onChange={(e) => onSave({ priceModifier: parseFloat(e.target.value) || 0 })}
          className={`w-full p-2 rounded-md border text-sm ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-600 text-gray-100'
              : 'bg-white border-gray-300 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-amber-400`}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onSave({})}
            className="flex-1 px-3 py-1.5 rounded-md bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm font-medium"
          >
            <Check size={16} className="inline mr-1" />
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={`px-3 py-1.5 rounded-md border text-sm font-medium ${
              theme === 'dark'
                ? 'border-gray-600 bg-transparent hover:bg-gray-700 text-gray-300'
                : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center">
      <div>
        <h4
          className={`font-semibold mb-1 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          {spec.name}
        </h4>
        <p
          className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Price Modifier: ₵{spec.priceModifier.toFixed(2)} per page
        </p>
      </div>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={onEdit}
          className={`p-1.5 rounded-md transition-colors ${
            theme === 'dark'
              ? 'hover:bg-gray-600 text-gray-300'
              : 'hover:bg-gray-200 text-gray-700'
          }`}
        >
          <Edit size={14} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className={`p-1.5 rounded-md transition-colors ${
            theme === 'dark'
              ? 'hover:bg-red-900/30 text-red-400'
              : 'hover:bg-red-50 text-red-600'
          }`}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

