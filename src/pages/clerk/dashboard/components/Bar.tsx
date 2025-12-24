import { useTheme } from '../../../../contexts/ThemeContext';

interface BarProps {
  label: string;
  value: number;
  max: number;
  color: string;
}

export function Bar({ label, value, max, color }: BarProps) {
  const { theme } = useTheme();
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div>
      <div className="flex justify-between items-center mb-2.5">
        <span className={`text-sm font-semibold flex items-center gap-2 ${
          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
        }`}>
          <span
            className="w-3 h-3 rounded"
            style={{ background: color }}
          />
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {value} jobs
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-[11px] font-bold"
            style={{
              background: `${color}20`,
              color: color,
            }}
          >
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      <div
        className={`w-full h-6 rounded-full overflow-hidden relative ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${color}, ${color})`,
            boxShadow: `0 2px 8px ${color}40`,
          }}
        />
      </div>
    </div>
  );
}

