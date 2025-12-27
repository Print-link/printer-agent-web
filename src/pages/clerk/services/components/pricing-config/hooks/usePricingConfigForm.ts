import { useState } from 'react';
import { useToast } from '../../../../../../contexts/ToastContext';
import type { AgentService, PricingConfig } from '../../../../../../types';
import { apiService } from '../../../../../../services/api';

export function usePricingConfigForm(agentService: AgentService, onSuccess: () => void, onClose: () => void) {
  const { success, error: showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateConfig = (pricingConfig: PricingConfig): string | null => {
    if (!pricingConfig.baseConfigurations || pricingConfig.baseConfigurations.length === 0) {
      return 'At least one base configuration is required';
    }

    if (!pricingConfig.options || pricingConfig.options.length === 0) {
      return 'At least one option is required';
    }

    const hasDefaultOption = (pricingConfig.options || []).some((opt) => opt.default && opt.enabled);
    if (!hasDefaultOption) {
      return 'At least one option must be set as default';
    }

    return null;
  };

  const handleSave = async (pricingConfig: PricingConfig, activate: boolean = false) => {
    setError(null);

    const validationError = validateConfig(pricingConfig);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await apiService.updateAgentServicePricingConfig(agentService.id, pricingConfig);
      if (activate) {
        await apiService.updateAgentService(agentService.id, { isActive: true });
      }
      success(
        `Pricing configuration ${activate ? 'saved and activated' : 'saved as draft'}`,
        'Success',
        3000
      );
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update pricing configuration';
      setError(errorMessage);
      showError(errorMessage, 'Update Failed', 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    setError,
    handleSave,
  };
}

