import { Eye } from 'lucide-react';
import type { PricingConfig } from "../../../../../../types";

interface ConfigurationPreviewProps {
  pricingConfig: PricingConfig;
  showPreview: boolean;
  theme: 'dark' | 'light';
  onToggle: () => void;
}

export function ConfigurationPreview({
  pricingConfig,
  showPreview,
  theme,
  onToggle,
}: ConfigurationPreviewProps) {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h3
          className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          Configuration Preview
        </h3>
        <button
          type="button"
          onClick={onToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            theme === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <Eye size={16} />
          {showPreview ? 'Hide' : 'Show'} Preview
        </button>
      </div>
      {showPreview && (
        <div
          className={`p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="space-y-4">
            <div>
              <h4
                className={`font-semibold mb-2 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}
              >
                Base Configurations:
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {(pricingConfig.baseConfigurations || []).map((config) => (
                  <li
                    key={config.id}
                    className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {config.name} - ₵{config.unitPrice.toFixed(2)}/page
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4
                className={`font-semibold mb-2 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}
              >
                Options:
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {(pricingConfig.options || []).map((option) => (
                  <li
                    key={option.id}
                    className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {option.name}
                    {option.default && ' (Default)'} -{' '}
                    {option.priceModifier > 0
                      ? `+₵${option.priceModifier.toFixed(2)}/page`
                      : 'No additional cost'}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4
                className={`font-semibold mb-2 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}
              >
                Custom Specifications:
              </h4>
              {(pricingConfig.customSpecifications || []).length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {(pricingConfig.customSpecifications || []).map((spec) => (
                    <li
                      key={spec.id}
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {spec.name} - +₵{spec.priceModifier.toFixed(2)}/page
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  No custom specifications
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

