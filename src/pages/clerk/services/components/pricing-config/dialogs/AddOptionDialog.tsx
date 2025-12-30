import { useState } from 'react';
import type { PricingOption } from "../../../../../../types";

interface AddOptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (option: PricingOption) => void;
  theme: 'dark' | 'light';
}

export function AddOptionDialog({ isOpen, onClose, onAdd, theme }: AddOptionDialogProps) {
  const [name, setName] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [isDefault, setIsDefault] = useState(false);
  const [priceModifier, setPriceModifier] = useState<number | string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      id: `option_${Date.now()}`,
      name: name.trim(),
      enabled,
      default: isDefault,
      priceModifier: typeof priceModifier === 'string' ? parseFloat(priceModifier) || 0 : priceModifier,
    });

    // Reset form
    setName('');
    setEnabled(true);
    setIsDefault(false);
    setPriceModifier('');
    onClose();
  };

  const handlePriceChange = (value: string) => {
    if (value === '' || value === '-') {
      setPriceModifier(value);
      return;
    }
    const parsed = parseFloat(value);
    setPriceModifier(isNaN(parsed) ? value : value);
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
          Add Option
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
              placeholder="e.g., Color"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enabled"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="cursor-pointer"
            />
            <label
              htmlFor="enabled"
              className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Enabled
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="default"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="cursor-pointer"
            />
            <label
              htmlFor="default"
              className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Default (pre-selected for customers)
            </label>
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Price Modifier
            </label>
            <input
              type="number"
              step="0.01"
              value={priceModifier}
              onChange={(e) => handlePriceChange(e.target.value)}
              className={`w-full p-2 rounded-md border text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-amber-400`}
              required
            />
          </div>
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

