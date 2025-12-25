import { useState, useRef } from 'react';
import { useToast } from '../../../../contexts/ToastContext';

export function useBranchImage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { error: showError } = useToast();

  const handleImageSelect = (file: File, onSelect: (file: File) => void) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select a valid image file', 'Invalid File', 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Image size must be less than 5MB', 'File Too Large', 3000);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onSelect(file);
  };

  const handleRemoveImage = (onRemove: () => void) => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setImagePreview(null);
    onRemove();
  };

  return {
    imagePreview,
    fileInputRef,
    handleImageSelect,
    handleRemoveImage,
  };
}

