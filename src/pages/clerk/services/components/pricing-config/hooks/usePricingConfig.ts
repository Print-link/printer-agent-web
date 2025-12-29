import { useState, useEffect } from 'react';
import type {
	AgentService,
	PricingConfig,
	BaseConfiguration,
	PricingOption,
	CustomSpecification,
} from "../../../../../../types";
import { getDefaultPricingConfig } from '../utils/pricingConfigDefaults';

export function usePricingConfig(agentService: AgentService | null, isOpen: boolean) {
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>({
    baseConfigurations: [],
    options: [],
    customSpecifications: [],
  });

  useEffect(() => {
    if (isOpen && agentService) {
      if (
        agentService.pricingConfig &&
        agentService.pricingConfig.baseConfigurations &&
        agentService.pricingConfig.options
      ) {
        setPricingConfig({
          baseConfigurations: agentService.pricingConfig.baseConfigurations || [],
          options: agentService.pricingConfig.options || [],
          customSpecifications: agentService.pricingConfig.customSpecifications || [],
        });
      } else {
        setPricingConfig(getDefaultPricingConfig(agentService));
      }
    }
  }, [isOpen, agentService]);

  const addBaseConfiguration = (config: BaseConfiguration) => {
    setPricingConfig({
      ...pricingConfig,
      baseConfigurations: [...(pricingConfig.baseConfigurations || []), config],
    });
  };

  const updateBaseConfiguration = (index: number, updates: Partial<BaseConfiguration>) => {
    const updated = [...(pricingConfig.baseConfigurations || [])];
    updated[index] = { ...updated[index], ...updates };
    setPricingConfig({ ...pricingConfig, baseConfigurations: updated });
  };

  const removeBaseConfiguration = (index: number) => {
    setPricingConfig({
      ...pricingConfig,
      baseConfigurations: (pricingConfig.baseConfigurations || []).filter((_, i) => i !== index),
    });
  };

  const addOption = (option: PricingOption) => {
    const updated = [...(pricingConfig.options || []), option];
    // If this is set as default, unset other defaults
    if (option.default) {
      updated.forEach((opt, i) => {
        if (i !== updated.length - 1) opt.default = false;
      });
    }
    setPricingConfig({ ...pricingConfig, options: updated });
  };

  const updateOption = (index: number, updates: Partial<PricingOption>) => {
    const updated = [...(pricingConfig.options || [])];
    updated[index] = { ...updated[index], ...updates };
    // If setting as default, unset other defaults
    if (updates.default === true) {
      updated.forEach((opt, i) => {
        if (i !== index) opt.default = false;
      });
    }
    setPricingConfig({ ...pricingConfig, options: updated });
  };

  const removeOption = (index: number) => {
    setPricingConfig({
      ...pricingConfig,
      options: (pricingConfig.options || []).filter((_, i) => i !== index),
    });
  };

  const addCustomSpecification = (spec: CustomSpecification) => {
    setPricingConfig({
      ...pricingConfig,
      customSpecifications: [...(pricingConfig.customSpecifications || []), spec],
    });
  };

  const updateCustomSpecification = (index: number, updates: Partial<CustomSpecification>) => {
    const updated = [...(pricingConfig.customSpecifications || [])];
    updated[index] = { ...updated[index], ...updates };
    setPricingConfig({ ...pricingConfig, customSpecifications: updated });
  };

  const removeCustomSpecification = (index: number) => {
    setPricingConfig({
      ...pricingConfig,
      customSpecifications: (pricingConfig.customSpecifications || []).filter((_, i) => i !== index),
    });
  };

  return {
    pricingConfig,
    setPricingConfig,
    addBaseConfiguration,
    updateBaseConfiguration,
    removeBaseConfiguration,
    addOption,
    updateOption,
    removeOption,
    addCustomSpecification,
    updateCustomSpecification,
    removeCustomSpecification,
  };
}

