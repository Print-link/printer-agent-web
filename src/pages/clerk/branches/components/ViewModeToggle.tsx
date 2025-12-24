import { List, Grid } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';

interface ViewModeToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
  const { theme } = useTheme();

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => onViewModeChange('list')}
        className={`p-1.5 rounded transition-all ${
          viewMode === 'list'
            ? 'bg-amber-400 text-black'
            : theme === 'dark'
            ? 'text-gray-300 hover:bg-gray-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        title="List view"
      >
        <List size={16} />
      </button>
      <button
        onClick={() => onViewModeChange('grid')}
        className={`p-1.5 rounded transition-all ${
          viewMode === 'grid'
            ? 'bg-amber-400 text-black'
            : theme === 'dark'
            ? 'text-gray-300 hover:bg-gray-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        title="Grid view"
      >
        <Grid size={16} />
      </button>
    </div>
  );
}

