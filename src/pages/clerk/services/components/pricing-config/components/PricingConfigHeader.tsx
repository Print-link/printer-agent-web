import { X } from 'lucide-react';
import type { AgentService } from '../../../../../../types';

interface PricingConfigHeaderProps {
  agentService: AgentService;
  theme: 'dark' | 'light';
  onClose: () => void;
}

export function PricingConfigHeader({ agentService, theme, onClose }: PricingConfigHeaderProps) {
  return (
    <div
      className={`flex justify-between items-center p-3 border-b ${
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      } rounded-t-xl`}
    >
      <div>
        <h2
          className={`text-xl font-bold ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          {agentService.serviceTemplate?.name || 'Configure Service'}
        </h2>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Step-by-step pricing configuration
        </p>
      </div>

      <button
        onClick={onClose}
        className={`p-2 rounded-lg border transition-colors ${
          theme === 'dark'
            ? 'border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
            : 'border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
        }`}
      >
        <X size={20} />
      </button>
    </div>
  );
}

