import { useTheme } from '../../../../contexts/ThemeContext';
import { BranchCard } from './BranchCard';
import type { Branch } from '../../../../types';

interface BranchesListProps {
  branches: Branch[];
  viewMode: 'grid' | 'list';
  onBranchClick?: (branch: Branch) => void;
  onEditBranch?: (branch: Branch) => void;
  onDeleteBranch?: (branch: Branch) => void;
}

export function BranchesList({
  branches,
  viewMode,
  onBranchClick,
  onEditBranch,
  onDeleteBranch,
}: BranchesListProps) {
  const { theme } = useTheme();

  if (branches.length === 0) {
    return (
      <div className={`p-6 rounded-md border text-center ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          No branches found
        </p>
      </div>
    );
  }

  return (
    <div
      className={viewMode === 'grid' ? 'grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-3' : 'flex flex-col gap-3'}
    >
      {branches.map((branch) => (
        <BranchCard
          key={branch.id}
          branch={branch}
          viewMode={viewMode}
          onClick={onBranchClick}
          onEdit={onEditBranch}
          onDelete={onDeleteBranch}
        />
      ))}
    </div>
  );
}

