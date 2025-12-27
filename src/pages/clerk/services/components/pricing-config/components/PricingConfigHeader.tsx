import { X } from 'lucide-react';
import type { AgentService } from '../../../../../../types';

interface PricingConfigHeaderProps {
  agentService: AgentService;
  theme: 'dark' | 'light';
  onClose: () => void;
}

export function PricingConfigHeader({ agentService, theme, onClose }: PricingConfigHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h2
          className={`text-2xl font-bold mb-2 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          Configure Flexible Pricing
        </h2>
        <div
          className={`text-sm space-y-1 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          <p>
            <strong>Service:</strong> {agentService.serviceTemplate?.name || 'Unknown'}
          </p>
          {agentService.category && (
            <p>
              <strong>Category:</strong> {agentService.category.name} →{' '}
              {agentService.subCategory?.name}
            </p>
          )}
          {!agentService.pricingConfig && (
            <p
              className={`text-xs mt-2 px-3 py-1.5 rounded-md ${
                theme === 'dark'
                  ? 'bg-blue-900/30 text-blue-300 border border-blue-700'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              <strong>New Service:</strong> Configure pricing to activate this service
            </p>
          )}
        </div>
      </div>
      <button
        onClick={onClose}
        className={`p-2 rounded-md border-none bg-transparent cursor-pointer flex items-center justify-center ${
          theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <X size={20} />
      </button>
    </div>
  );
}

