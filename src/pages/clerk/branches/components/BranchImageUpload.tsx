import { useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';

interface BranchImageUploadProps {
  imagePreview: string | null;
  onImageSelect: (file: File) => void;
  onRemoveImage: () => void;
}

export function BranchImageUpload({
  imagePreview,
  onImageSelect,
  onRemoveImage,
}: BranchImageUploadProps) {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div>
      <label className={`block text-sm font-medium mb-2 ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      }`}>
        Branch Cover Image
      </label>
      {imagePreview ? (
        <div className="relative w-full max-w-md">
          <img
            src={imagePreview}
            alt="Branch cover preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
          />
          <button
            type="button"
            onClick={onRemoveImage}
            className={`absolute top-2 right-2 p-2 rounded-full ${
              theme === 'dark'
                ? 'bg-black/60 hover:bg-black/80 text-white'
                : 'bg-white/80 hover:bg-white text-gray-900'
            } transition-colors`}
          >
            <X size={18} />
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`mt-2 px-4 py-2 rounded-md border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
            } text-sm font-medium`}
          >
            Change Image
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`w-full max-w-md border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            theme === 'dark'
              ? 'border-gray-600 hover:border-amber-500 bg-gray-700/50'
              : 'border-gray-300 hover:border-amber-500 bg-gray-50'
          }`}
        >
          <Camera className={`mx-auto mb-3 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} size={32} />
          <p className={`text-sm font-medium mb-1 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Click to upload cover image
          </p>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            PNG, JPG, GIF up to 5MB
          </p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

