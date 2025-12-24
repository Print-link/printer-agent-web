import { useTheme } from '../../../../contexts/ThemeContext';

interface LegendItemProps {
  color: string;
  label: string;
}

export function LegendItem({ color, label }: LegendItemProps) {
  const { theme } = useTheme();

  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-3 h-3 rounded"
        style={{ background: color }}
      />
      <span className={`text-xs ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {label}
      </span>
    </div>
  );
}

