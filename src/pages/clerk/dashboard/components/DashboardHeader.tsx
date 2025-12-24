import { Zap } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';

interface DashboardHeaderProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onTodayClick: () => void;
}

export function DashboardHeader({
  selectedDate,
  onDateChange,
  onTodayClick,
}: DashboardHeaderProps) {
  const { theme } = useTheme();

  return (
    <div className="flex justify-between items-center flex-wrap gap-2">
      <div>
        <h1 className={`text-base font-semibold mb-1 ${
          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Dashboard
        </h1>
        <p className={`text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Print job overview
        </p>
      </div>
      <div className="flex items-center gap-1 flex-wrap">
        <button
          onClick={onTodayClick}
          className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all ${
            theme === 'dark'
              ? 'bg-amber-500 hover:bg-amber-600 text-black'
              : 'bg-amber-400 hover:bg-amber-500 text-black'
          }`}
        >
          <Zap size={14} />
          Today
        </button>
        <input
          type="month"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className={`px-2 py-1 rounded border text-xs h-8 cursor-pointer ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-gray-100'
              : 'bg-white border-gray-300 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-amber-400`}
        />
      </div>
    </div>
  );
}

