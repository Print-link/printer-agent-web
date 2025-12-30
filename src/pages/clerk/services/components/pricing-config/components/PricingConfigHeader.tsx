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
      className={`flex justify-between items-center px-6 py-4 border-b ${
        theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-center gap-4">
        <h2
          className={`text-xl font-black tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          {agentService.serviceTemplate?.name || 'Configure Service'}
        </h2>
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
          theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
        }`}>
          Editing
        </span>
      </div>

      <button
        onClick={onClose}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all active:scale-95 ${
          theme === 'dark'
            ? 'border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white'
            : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <X size={14} />
        <span>Exit</span>
      </button>
    </div>
  );
}

