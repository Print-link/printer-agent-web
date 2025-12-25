import { useTheme } from '../../../../../contexts/ThemeContext';
import type { Branch } from '../../../../../types';
import type { BranchFormData } from '../../hooks/useBranchForm';
import { BranchImageUpload } from '../BranchImageUpload';

interface BasicInfoStepProps {
  formData: BranchFormData;
  errors: Record<string, string>;
  imagePreview: string | null;
  onFormDataChange: (updates: Partial<BranchFormData>) => void;
  onImageSelect: (file: File) => void;
  onRemoveImage: () => void;
}

export function BasicInfoStep({
  formData,
  errors,
  imagePreview,
  onFormDataChange,
  onImageSelect,
  onRemoveImage,
}: BasicInfoStepProps) {
  const { theme } = useTheme();

  return (
    <div className="space-y-4">
      <BranchImageUpload
        imagePreview={imagePreview}
        onImageSelect={onImageSelect}
        onRemoveImage={onRemoveImage}
      />

      <div>
        <label className={`block text-sm font-medium mb-2 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Business Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onFormDataChange({ name: e.target.value })}
          className={`w-full px-4 py-2 rounded-md border ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-gray-100'
              : 'bg-white border-gray-300 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-amber-400`}
          required
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {errors.branchCoverImage && (
        <p className="text-red-500 text-sm mt-1">{errors.branchCoverImage}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Business Phone Number
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => onFormDataChange({ phoneNumber: e.target.value })}
            className={`w-full px-4 py-2 rounded-md border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-amber-400`}
            placeholder="+1234567890"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Business Email Address
          </label>
          <input
            type="email"
            value={formData.branchEmailAddress}
            onChange={(e) => onFormDataChange({ branchEmailAddress: e.target.value })}
            className={`w-full px-4 py-2 rounded-md border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-amber-400`}
            placeholder="branch@example.com"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isMainBranch}
            onChange={(e) => onFormDataChange({ isMainBranch: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-amber-400 focus:ring-amber-400"
          />
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Main Branch
          </span>
        </label>

        <div className="flex-1 sm:max-w-xs">
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => onFormDataChange({ status: e.target.value as Branch['status'] })}
            className={`w-full px-4 py-2 rounded-md border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-amber-400`}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="temporarily_closed">Temporarily Closed</option>
          </select>
        </div>
      </div>
    </div>
  );
}

