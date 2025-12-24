import { useTheme } from '../../../../contexts/ThemeContext';
import type { Branch } from '../../../../types';

interface BranchImageProps {
  branch: Branch;
  viewMode: 'grid' | 'list';
}

export function BranchImage({ branch, viewMode }: BranchImageProps) {
  const { theme } = useTheme();

  if (!branch.branchCoverImage) return null;

  if (viewMode === 'grid') {
    return (
      <div className="w-full h-[180px] flex-shrink-0 relative overflow-hidden">
        <img
          src={branch.branchCoverImage}
          alt={branch.name}
          className="w-full h-full object-cover block"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // List view thumbnail
  return (
    <div className={`w-[120px] h-[120px] flex-shrink-0 rounded-lg overflow-hidden border ${
      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
    }`}>
      <img
        src={branch.branchCoverImage}
        alt={branch.name}
        className="w-full h-full object-cover block"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
}

