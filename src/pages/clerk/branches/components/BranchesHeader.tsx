import { Plus } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { ViewModeToggle } from './ViewModeToggle';

interface BranchesHeaderProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onCreateBranch: () => void;
}

export function BranchesHeader({
  viewMode,
  onViewModeChange,
  onCreateBranch,
}: BranchesHeaderProps) {
  const { theme } = useTheme();

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <h1 className={`text-lg font-semibold m-0 ${
          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Branches
        </h1>
        <button
          onClick={onCreateBranch}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-amber-400 hover:bg-amber-500 text-black cursor-pointer text-sm font-semibold transition-all"
        >
          <Plus size={16} />
          Create Branch
        </button>
      </div>
      <div className="flex flex-row items-center justify-between">
        <p className={`text-xs m-0 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Manage and view all your branches
        </p>
        <ViewModeToggle
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
      </div>
    </div>
  );
}

