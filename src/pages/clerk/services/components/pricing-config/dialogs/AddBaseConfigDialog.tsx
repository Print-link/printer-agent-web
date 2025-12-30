import { useState } from 'react';
import type { BaseConfiguration } from "../../../../../../types";

interface AddBaseConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (config: BaseConfiguration) => void;
  theme: 'dark' | 'light';
}

export function AddBaseConfigDialog({ isOpen, onClose, onAdd, theme }: AddBaseConfigDialogProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'PRESET' | 'CUSTOM'>('PRESET');
  const [unitPrice, setUnitPrice] = useState<number | string>(0);
  const [customValue, setCustomValue] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    // Ensure unitPrice is a number for validation and submission
    const finalUnitPrice = typeof unitPrice === 'string' ? parseFloat(unitPrice) || 0 : unitPrice;
    if (finalUnitPrice < 0) return;

    onAdd({
      id: `config_${Date.now()}`,
      name: name.trim(),
      type,
      unitPrice: finalUnitPrice,
      customValue: type === 'CUSTOM' ? customValue.trim() || null : null,
    });

    // Reset form
    setName('');
    setType('PRESET');
    setUnitPrice(0);
    setCustomValue('');
    onClose();
  };

  const handlePriceChange = (value: string) => {
    if (value === '' || value === '-') {
      setUnitPrice(value);
      return;
    }
    const parsed = parseFloat(value);
    setUnitPrice(isNaN(parsed) ? value : value);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className={`rounded-lg p-6 max-w-md w-full mx-4 shadow-xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          Add Base Configuration
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-2 rounded-md border text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-amber-400`}
              placeholder="e.g., A4"
              required
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
              value={type}
              onChange={(e) => setType(e.target.value as 'PRESET' | 'CUSTOM')}
              className={`w-full p-2 rounded-md border text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
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
              Unit Price
            </label>
            <input
              type="number"
              step="0.01"
              value={unitPrice}
              onChange={(e) => handlePriceChange(e.target.value)}
              className={`w-full p-2 rounded-md border text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-amber-400`}
              required
            />
          </div>
          {type === 'CUSTOM' && (
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
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className={`w-full p-2 rounded-md border text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                placeholder="e.g., 8.5x11"
              />
            </div>
          )}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 bg-transparent hover:bg-gray-700 text-gray-300'
                  : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm font-semibold transition-colors"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

