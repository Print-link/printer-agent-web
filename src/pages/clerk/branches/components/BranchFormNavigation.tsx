import { useTheme } from '../../../../contexts/ThemeContext';

interface BranchFormNavigationProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export function BranchFormNavigation({
  currentStep,
  totalSteps,
  isSubmitting,
  onPrevious,
  onNext,
  onCancel,
  onSubmit,
}: BranchFormNavigationProps) {
  const { theme } = useTheme();

  return (
    <div className="flex justify-between">
      <button
        onClick={currentStep === 1 ? onCancel : onPrevious}
        className={`px-6 py-2 rounded-md font-semibold ${
          theme === 'dark'
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
        }`}
      >
        {currentStep === 1 ? 'Cancel' : 'Previous'}
      </button>
      <div className="flex gap-3">
        {currentStep < totalSteps ? (
          <button
            onClick={onNext}
            className="px-6 py-2 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-md font-semibold"
          >
            Next
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-md font-semibold ${
              isSubmitting
                ? 'bg-amber-300 cursor-not-allowed'
                : 'bg-amber-400 hover:bg-amber-500'
            } text-gray-900`}
          >
            {isSubmitting ? 'Creating...' : 'Create Branch'}
          </button>
        )}
      </div>
    </div>
  );
}

