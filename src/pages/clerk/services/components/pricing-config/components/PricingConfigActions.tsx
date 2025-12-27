interface PricingConfigActionsProps {
  theme: 'dark' | 'light';
  isSubmitting: boolean;
  onClose: () => void;
  onSaveDraft: () => void;
  onSaveAndActivate: () => void;
}

export function PricingConfigActions({
  theme,
  isSubmitting,
  onClose,
  onSaveDraft,
  onSaveAndActivate,
}: PricingConfigActionsProps) {
  return (
    <div className="flex gap-3 justify-end pt-6 mt-6 border-t border-gray-300 dark:border-gray-600">
      <button
        type="button"
        onClick={onClose}
        className={`px-5 py-2.5 rounded-md border text-sm font-medium transition-colors ${
          theme === 'dark'
            ? 'border-gray-600 bg-transparent hover:bg-gray-700 text-gray-300'
            : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700'
        }`}
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSaveDraft}
        disabled={isSubmitting}
        className={`px-5 py-2.5 rounded-md border text-sm font-medium transition-colors ${
          isSubmitting
            ? 'opacity-50 cursor-not-allowed'
            : theme === 'dark'
              ? 'border-yellow-600 bg-yellow-900/30 hover:bg-yellow-900/50 text-yellow-400'
              : 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100 text-yellow-700'
        }`}
      >
        {isSubmitting ? 'Saving...' : 'Save Draft'}
      </button>
      <button
        type="button"
        onClick={onSaveAndActivate}
        disabled={isSubmitting}
        className={`px-5 py-2.5 rounded-md border-none text-sm font-semibold transition-colors ${
          isSubmitting
            ? 'bg-amber-300 cursor-not-allowed opacity-60'
            : 'bg-amber-400 hover:bg-amber-500 cursor-pointer'
        } text-gray-900`}
      >
        {isSubmitting ? 'Saving...' : 'Save & Activate'}
      </button>
    </div>
  );
}

