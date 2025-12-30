import { useState, useEffect } from 'react';
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
  // Local state for inputs to allow smooth editing and "empty" states
  const [localName, setLocalName] = useState(config.name);
  const [localPrice, setLocalPrice] = useState<string | number>(config.unitPrice);
  const [localCustomValue, setLocalCustomValue] = useState(config.customValue || '');

  // Sync from props only when not focused or when config ID changes (to handle external updates)
  // Note: We're taking a simpler approach of syncing when props change, 
  // but relying on onBlur to commit changes to avoid the snap-back loop during typing.
  useEffect(() => {
    setLocalName(config.name);
  }, [config.name]);
  
  useEffect(() => {
    // Only update if the values are actually different to avoid overriding user input "0."
    if (Number(localPrice) !== config.unitPrice) {
       setLocalPrice(config.unitPrice);
    }
  }, [config.unitPrice]);

  useEffect(() => {
    setLocalCustomValue(config.customValue || '');
  }, [config.customValue]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || value === '-') {
      setLocalPrice(value);
    } else {
      const parsed = parseFloat(value);
      setLocalPrice(isNaN(parsed) ? value : value);
    }
  };

  const commitPrice = () => {
    const finalPrice = typeof localPrice === 'string' ? parseFloat(localPrice) || 0 : localPrice;
    if (finalPrice !== config.unitPrice) {
      onUpdate({ unitPrice: finalPrice });
    }
    // Format back to number on blur if valid
    setLocalPrice(finalPrice);
  };

  const commitName = () => {
    if (localName !== config.name) {
      onUpdate({ name: localName });
    }
  };

  const commitCustomValue = () => {
    const val = localCustomValue.trim() || null;
    if (val !== config.customValue) {
      onUpdate({ customValue: val });
    }
  };

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
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onBlur={commitName}
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
              value={localPrice}
              onChange={handlePriceChange}
              onBlur={commitPrice}
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
                value={localCustomValue}
                onChange={(e) => setLocalCustomValue(e.target.value)}
                onBlur={commitCustomValue}
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

