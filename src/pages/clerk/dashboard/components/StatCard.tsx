import { useTheme } from '../../../../contexts/ThemeContext';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  color: string;
  description?: string;
}

export function StatCard({ icon, title, value, color, description }: StatCardProps) {
  const { theme } = useTheme();

  return (
    <div
      className={`p-3 rounded-md border transition-all cursor-pointer ${
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700 hover:bg-gray-700/50'
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div
          className="w-9 h-9 rounded flex items-center justify-center text-lg"
          style={{
            background: `${color}15`,
            color: color,
          }}
        >
          {icon}
        </div>
        <div
          className="px-2 py-1 rounded text-xs font-semibold"
          style={{
            background: `${color}20`,
            color: color,
          }}
        >
          {value}
        </div>
      </div>
      <h4 className={`text-sm font-semibold mb-0.5 ${
        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
      }`}>
        {title}
      </h4>
      {description && (
        <p className={`text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {description}
        </p>
      )}
    </div>
  );
}

