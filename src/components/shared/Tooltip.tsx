import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children || <HelpCircle size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />}
      </div>

      {isVisible && (
        <div className="absolute z-[100] bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-lg shadow-xl border text-xs animate-in fade-in zoom-in duration-200
          ${theme === 'dark' 
            ? 'bg-gray-800 border-gray-700 text-gray-200' 
            : 'bg-white border-gray-200 text-gray-700'
          }"
        >
          {content}
          <div className={`absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent 
            ${theme === 'dark' ? 'border-t-gray-800' : 'border-t-white'}`} 
          />
        </div>
      )}
    </div>
  );
}
