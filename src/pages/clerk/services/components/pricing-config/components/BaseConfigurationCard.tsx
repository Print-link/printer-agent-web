import { Trash2 } from 'lucide-react';
import type { BaseConfiguration } from '../../../../../../types';

interface BaseConfigurationCardProps {
  config: BaseConfiguration;
  index: number;
  isChecked: boolean;
  theme: 'dark' | 'light';
  onToggle: (checked: boolean) => void;
  onUpdate: (updates: Partial<BaseConfiguration>) => void;
  onDelete: () => void;
}

export function BaseConfigurationCard({
  config,
  isChecked,
  theme,
  onToggle,
  onUpdate,
  onDelete,
}: BaseConfigurationCardProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => onToggle(e.target.checked)}
          className="mt-1 cursor-pointer"
        />
        <div className="flex-1">
          <label
            className={`block font-medium cursor-pointer ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}
            onClick={() => onToggle(!isChecked)}
          >
            {config.name}
          </label>
          {!isChecked && (
            <p
              className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              ₵{config.unitPrice.toFixed(2)} per page
              {config.type === 'CUSTOM' && config.customValue && ` • ${config.customValue}`}
            </p>
          )}
        </div>
        {isChecked && (
          <button
            type="button"
            onClick={onDelete}
            className={`p-1.5 rounded-md transition-colors ${
              theme === 'dark'
                ? 'hover:bg-red-900/30 text-red-400'
                : 'hover:bg-red-50 text-red-600'
            }`}
            title="Delete configuration"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {isChecked && (
        <div className="ml-7 space-y-3 pt-2 border-t border-gray-300 dark:border-gray-600">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Name
            </label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className={`w-full p-2 rounded-md border text-sm ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-amber-400`}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Type
            </label>
            <select
              value={config.type}
              onChange={(e) => onUpdate({ type: e.target.value as 'PRESET' | 'CUSTOM' })}
              className={`w-full p-2 rounded-md border text-sm ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-amber-400`}
            >
              <option value="PRESET">Preset</option>
              <option value="CUSTOM">Custom</option>
            </select>
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Unit Price (₵)
            </label>
            <input
              type="number"
              step="0.01"
              value={config.unitPrice}
              onChange={(e) => onUpdate({ unitPrice: parseFloat(e.target.value) || 0 })}
              className={`w-full p-2 rounded-md border text-sm ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-amber-400`}
            />
          </div>
          {config.type === 'CUSTOM' && (
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Custom Value (Optional)
              </label>
              <input
                type="text"
                value={config.customValue || ''}
                onChange={(e) => onUpdate({ customValue: e.target.value.trim() || null })}
                className={`w-full p-2 rounded-md border text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-600 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                placeholder="e.g., 8.5x11"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

