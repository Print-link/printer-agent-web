import { getStatusIcon, getStatusLabel } from '../utils/branchUtils';
import { useTheme } from '../../../../contexts/ThemeContext';
import type { Branch } from '../../../../types';

interface BranchHeaderProps {
  branch: Branch;
  viewMode: 'grid' | 'list';
}

export function BranchHeader({ branch, viewMode }: BranchHeaderProps) {
  const { theme } = useTheme();

  return (
    <div className={viewMode === 'list' ? 'flex-[0_0_220px] min-w-[220px]' : 'flex-1'}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 flex-wrap">
          <h3 className={`text-base font-semibold m-0 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {branch.name}
          </h3>
          {branch.isMainBranch && (
            <span className="bg-amber-400 text-black text-xs px-2 py-0.5 rounded font-semibold">
              Main
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {getStatusIcon(branch.status)}
          <span className={`text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {getStatusLabel(branch.status)}
          </span>
        </div>
      </div>
    </div>
  );
}

