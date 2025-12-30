import { useState } from 'react';
import type { CustomSpecification } from '../../../../../../types';

interface AddCustomSpecDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (spec: CustomSpecification) => void;
  theme: 'dark' | 'light';
}

export function AddCustomSpecDialog({ isOpen, onClose, onAdd, theme }: AddCustomSpecDialogProps) {
  const [name, setName] = useState('');
  const [priceModifier, setPriceModifier] = useState<number | string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      id: `spec_${Date.now()}`,
      name: name.trim(),
      priceModifier: typeof priceModifier === 'string' ? parseFloat(priceModifier) || 0 : priceModifier,
    });

    // Reset form
    setName('');
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
          Add Custom Specification
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
              placeholder="e.g., Lamination"
              required
            />
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

