import { useState, useEffect, useRef } from 'react';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { BranchImage } from './BranchImage';
import { BranchHeader } from './BranchHeader';
import { BranchDetails } from './BranchDetails';
import type { Branch } from '../../../../types';

interface BranchCardProps {
  branch: Branch;
  viewMode: 'grid' | 'list';
  onClick?: (branch: Branch) => void;
  onEdit?: (branch: Branch) => void;
  onDelete?: (branch: Branch) => void;
}

export function BranchCard({
  branch,
  viewMode,
  onClick,
  onEdit,
  onDelete,
}: BranchCardProps) {
  const { theme } = useTheme();
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);

  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger onClick if clicking on action buttons
    if ((e.target as HTMLElement).closest('.branch-actions')) {
      return;
    }
    onClick?.(branch);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(branch);
    setShowActions(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(branch);
    setShowActions(false);
  };

  return (
    <div
      className={`rounded-md border transition-all cursor-pointer relative ${
        viewMode === 'list' ? 'p-3' : 'p-0'
      } ${
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
          : 'bg-white border-gray-200 hover:border-gray-300'
      } ${
        viewMode === 'list' ? 'hover:-translate-y-0.5 hover:shadow-lg' : ''
      }`}
      style={{
        zIndex: showActions ? 1000 : 'auto',
        display: 'flex',
        flexDirection: viewMode === 'list' ? 'row' : 'column',
        gap: viewMode === 'list' ? '12px' : '0',
        alignItems: viewMode === 'list' ? 'center' : 'stretch',
      }}
      onClick={handleClick}
    >
      <BranchImage branch={branch} viewMode={viewMode} />

      <div
        className={viewMode === 'grid' ? 'p-3' : 'p-0'}
        style={{
          display: 'flex',
          flexDirection: viewMode === 'list' ? 'row' : 'column',
          gap: viewMode === 'list' ? '24px' : '8px',
          flex: 1,
          alignItems: viewMode === 'list' ? 'center' : 'flex-start',
          position: 'relative',
        }}
      >
        <BranchHeader branch={branch} viewMode={viewMode} />
        <BranchDetails branch={branch} viewMode={viewMode} />
        {(onEdit || onDelete) && (
          <div
            ref={actionsRef}
            className="branch-actions"
            style={{ position: 'relative', marginLeft: 'auto' }}
          >
            <button
              onClick={() => setShowActions(!showActions)}
              className={`p-2 rounded transition-all ${
                theme === 'dark'
                  ? 'text-gray-400 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MoreVertical size={18} />
            </button>
            {showActions && (
              <div
                className={`absolute top-full right-0 mt-1 rounded-md shadow-lg z-[1001] min-w-[120px] overflow-hidden ${
                  theme === 'dark'
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {onEdit && (
                  <button
                    onClick={handleEdit}
                    className={`w-full px-4 py-2.5 border-none bg-transparent cursor-pointer flex items-center gap-2 text-sm text-left transition-all ${
                      theme === 'dark'
                        ? 'text-gray-100 hover:bg-gray-700'
                        : 'text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    className={`w-full px-4 py-2.5 border-none bg-transparent cursor-pointer flex items-center gap-2 text-sm text-left transition-all border-t ${
                      theme === 'dark'
                        ? 'text-red-400 hover:bg-red-900/30 border-gray-700'
                        : 'text-red-600 hover:bg-red-50 border-gray-200'
                    }`}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

