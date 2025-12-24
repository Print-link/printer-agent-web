import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { formatOperatingHours } from '../utils/branchUtils';
import { useTheme } from '../../../../contexts/ThemeContext';
import type { Branch } from '../../../../types';

interface BranchDetailsProps {
  branch: Branch;
  viewMode: 'grid' | 'list';
}

export function BranchDetails({ branch, viewMode }: BranchDetailsProps) {
  const { theme } = useTheme();

  if (viewMode === 'grid') {
    return (
      <div className="flex flex-col gap-2">
        {branch.location && (
          <div className="flex items-start gap-2">
            <MapPin className="text-amber-400 text-sm mt-0.5 flex-shrink-0" size={14} />
            <span className={`text-sm leading-snug ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {branch.location.address}
            </span>
          </div>
        )}

        {branch.phoneNumber && (
          <div className="flex items-center gap-2">
            <Phone className="text-amber-400 text-sm flex-shrink-0" size={14} />
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {branch.phoneNumber}
            </span>
          </div>
        )}

        {branch.branchEmailAddress && (
          <div className="flex items-center gap-2">
            <Mail className="text-amber-400 text-sm flex-shrink-0" size={14} />
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {branch.branchEmailAddress}
            </span>
          </div>
        )}

        <div className="flex items-start gap-2 mt-1">
          <Clock className="text-amber-400 text-sm mt-0.5 flex-shrink-0" size={14} />
          <div className="flex-1">
            <div className={`text-xs mb-0.5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Operating Hours:
            </div>
            <div className={`text-xs leading-snug ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {formatOperatingHours(branch.operatingHours)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3 flex-1 items-center">
      {branch.location && (
        <div className="flex items-start gap-2">
          <MapPin className="text-amber-400 text-sm mt-0.5 flex-shrink-0" size={14} />
          <span className={`text-sm leading-snug ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {branch.location.address}
          </span>
        </div>
      )}

      {branch.phoneNumber && (
        <div className="flex items-center gap-2">
          <Phone className="text-amber-400 text-sm flex-shrink-0" size={14} />
          <span className={`text-sm ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {branch.phoneNumber}
          </span>
        </div>
      )}

      {branch.branchEmailAddress && (
        <div className="flex items-center gap-2">
          <Mail className="text-amber-400 text-sm flex-shrink-0" size={14} />
          <span className={`text-sm ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {branch.branchEmailAddress}
          </span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Clock className="text-amber-400 text-sm flex-shrink-0" size={14} />
        <span className={`text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {formatOperatingHours(branch.operatingHours)}
        </span>
      </div>
    </div>
  );
}

