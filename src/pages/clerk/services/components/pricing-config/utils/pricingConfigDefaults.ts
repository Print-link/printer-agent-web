import type { AgentService, PricingConfig } from '../../../../../../types';

export function getDefaultPricingConfig(agentService: AgentService): PricingConfig {
  const isBondPaper =
    agentService.subCategory?.name?.toLowerCase().includes('bond paper') || false;

  return {
    baseConfigurations: isBondPaper
      ? [
          { id: 'a6', name: 'A6', type: 'PRESET' as const, unitPrice: 0.4 },
          { id: 'a5', name: 'A5', type: 'PRESET' as const, unitPrice: 0.5 },
          { id: 'a4', name: 'A4', type: 'PRESET' as const, unitPrice: 0.6 },
          { id: 'a3', name: 'A3', type: 'PRESET' as const, unitPrice: 0.8 },
          { id: 'custom', name: 'Custom Size', type: 'CUSTOM' as const, unitPrice: 1.0 },
        ]
      : [
          { id: 'standard', name: 'Standard Size', type: 'PRESET' as const, unitPrice: 0 },
          { id: 'custom', name: 'Custom Size', type: 'CUSTOM' as const, unitPrice: 0 },
        ],
    options: [
      {
        id: 'black_white',
        name: 'Black & White',
        enabled: true,
        default: true,
        priceModifier: 0,
      },
      {
        id: 'front_only',
        name: 'Front Only',
        enabled: true,
        default: true,
        priceModifier: 0,
      },
      ...(agentService.supportsColor
        ? [
            {
              id: 'color',
              name: 'Color',
              enabled: true,
              default: false,
              priceModifier: 0.25,
            },
          ]
        : []),
      ...(agentService.supportsFrontBack
        ? [
            {
              id: 'front_back',
              name: 'Front & Back',
              enabled: true,
              default: false,
              priceModifier: 0.1,
            },
          ]
        : []),
      ...(agentService.supportsPrintCut
        ? [
            {
              id: 'print_cut',
              name: 'Print & Cut',
              enabled: true,
              default: false,
              priceModifier: 0.15,
            },
          ]
        : []),
    ],
    customSpecifications: [],
  };
}

