import { ArrowRight, ArrowLeft, Save, CheckCircle } from 'lucide-react';

interface PricingConfigActionsProps {
  theme: 'dark' | 'light';
  isSubmitting: boolean;
  currentStep: number;
  totalSteps: number;
  onClose: () => void;
  onNext: () => void;
  onBack: () => void;
  onSaveDraft: () => void;
  onSaveAndActivate: () => void;
}

export function PricingConfigActions({
  theme,
  isSubmitting,
  currentStep,
  totalSteps,
  onClose,
  onNext,
  onBack,
  onSaveDraft,
  onSaveAndActivate,
}: PricingConfigActionsProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div
      className={`flex items-center justify-between p-3 border-t ${
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
      } rounded-b-xl`}
    >
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          Cancel
        </button>
      </div>

      <div className="flex gap-3">
        {!isFirstStep && (
          <button
            type="button"
            onClick={onBack}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ArrowLeft size={16} />
            Back
          </button>
        )}

        {isLastStep ? (
          <>
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                isSubmitting
                  ? 'opacity-50 cursor-not-allowed'
                  : theme === 'dark'
                  ? 'border-yellow-600/50 text-yellow-500 hover:bg-yellow-900/20'
                  : 'border-yellow-600/30 text-yellow-700 hover:bg-yellow-50'
              }`}
            >
              <Save size={16} />
              {isSubmitting ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              type="button"
              onClick={onSaveAndActivate}
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold text-gray-900 shadow-lg transition-all ${
                isSubmitting
                  ? 'bg-amber-400/50 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-500 shadow-amber-500/25'
              }`}
            >
              {isSubmitting ? (
                'Saving...'
              ) : (
                <>
                  <CheckCircle size={16} />
                  Save & Activate
                </>
              )}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold text-gray-900 shadow-lg transition-all ${
              theme === 'dark'
                ? 'bg-amber-400 hover:bg-amber-500 shadow-amber-900/20'
                : 'bg-amber-400 hover:bg-amber-500 shadow-amber-500/20'
            }`}
          >
            Next Step
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

