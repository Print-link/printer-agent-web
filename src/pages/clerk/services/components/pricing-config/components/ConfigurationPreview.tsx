import type { PricingConfig } from "../../../../../../types";

interface ConfigurationPreviewProps {
  pricingConfig: PricingConfig;
  theme: 'dark' | 'light';
}

export function ConfigurationPreview({
  pricingConfig,
  theme,
}: ConfigurationPreviewProps) {
  return (
    <section className="space-y-4">
      {/* Base Configurations */}
      <div className="space-y-2">
        <h4 className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          Base Pricing
        </h4>
        <div className="space-y-1.5">
          {(pricingConfig.baseConfigurations || []).length > 0 ? (
            (pricingConfig.baseConfigurations || []).map((config) => (
              <div key={config.id} className="flex justify-between items-center text-xs">
                <span className={`font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{config.name}</span>
                <span className="font-black text-blue-500">₵{config.unitPrice.toFixed(2)}</span>
              </div>
            ))
          ) : (
            <p className="text-[10px] italic text-gray-500">None selected</p>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2">
        <h4 className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          Options
        </h4>
        <div className="space-y-1.5">
          {(pricingConfig.options || []).filter(o => o.enabled).length > 0 ? (
            (pricingConfig.options || []).filter(o => o.enabled).map((option) => (
              <div key={option.id} className="flex justify-between items-center text-xs">
                <span className={`font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{option.name}</span>
                <span className="font-black text-purple-500">
                  +{option.priceModifier > 0 ? `₵${option.priceModifier.toFixed(2)}` : 'Free'}
                </span>
              </div>
            ))
          ) : (
            <p className="text-[10px] italic text-gray-500">None enabled</p>
          )}
        </div>
      </div>

      {/* Custom Specifications */}
      <div className="space-y-2">
        <h4 className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          Specifics
        </h4>
        <div className="space-y-1.5">
          {(pricingConfig.customSpecifications || []).length > 0 ? (
            (pricingConfig.customSpecifications || []).map((spec) => (
              <div key={spec.id} className="flex justify-between items-center text-xs">
                <span className={`font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{spec.name}</span>
                <span className="font-black text-amber-500">+₵{spec.priceModifier.toFixed(2)}</span>
              </div>
            ))
          ) : (
            <p className="text-[10px] italic text-gray-500">None added</p>
          )}
        </div>
      </div>
    </section>
  );
}
