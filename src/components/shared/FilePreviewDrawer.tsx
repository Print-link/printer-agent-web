import { useEffect, useMemo } from 'react';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { FilePreview } from './FilePreview';
import type { ClerkOrderDetail } from '../../types';

interface FilePreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetail: ClerkOrderDetail | null;
  selectedFileIndex: { itemIndex: number; fileIndex: number } | null;
  onFileChange: (itemIndex: number, fileIndex: number) => void;
}

/**
 * FilePreviewDrawer - Side drawer for previewing files from order details
 * Allows navigation between files and provides download functionality
 * Available for both clerk and manager roles - no role restrictions
 */
export function FilePreviewDrawer({
  isOpen,
  onClose,
  orderDetail,
  selectedFileIndex,
  onFileChange,
}: FilePreviewDrawerProps) {
  const { theme } = useTheme();

  if (!isOpen || !orderDetail || !selectedFileIndex) return null;

  const currentItem = orderDetail.items[selectedFileIndex.itemIndex];
  const currentFile = currentItem?.options?.files?.[selectedFileIndex.fileIndex];

  // Get all files from all items for navigation
  const allFiles: Array<{ itemIndex: number; fileIndex: number; file: any }> = [];
  orderDetail.items.forEach((item, itemIndex) => {
    // Parse options if needed
    let parsedOptions = item.options;
    if (typeof item.options === 'string') {
      try {
        parsedOptions = JSON.parse(item.options);
      } catch (e) {
        console.error('Error parsing options:', e);
        parsedOptions = {
          frontBack: false,
          color: false,
          printCut: false,
          files: [],
        };
      }
    }
    
    const files = parsedOptions?.files || [];
    if (Array.isArray(files)) {
      files.forEach((file, fileIndex) => {
        allFiles.push({ itemIndex, fileIndex, file });
      });
    }
  });

  const currentFilePosition = allFiles.findIndex(
    (f) =>
      f.itemIndex === selectedFileIndex.itemIndex &&
      f.fileIndex === selectedFileIndex.fileIndex
  );

  const hasPrevious = currentFilePosition > 0;
  const hasNext = currentFilePosition < allFiles.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      const prevFile = allFiles[currentFilePosition - 1];
      onFileChange(prevFile.itemIndex, prevFile.fileIndex);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      const nextFile = allFiles[currentFilePosition + 1];
      onFileChange(nextFile.itemIndex, nextFile.fileIndex);
    }
  };

  const handleDownload = async () => {
    if (!currentFile) return;
    try {
      const fileUrl = currentFile.url || '';
      const fileName = currentFile.name || currentFile.publicId?.split('/').pop() || 'file';
      
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrevious) {
        const prevFile = allFiles[currentFilePosition - 1];
        if (prevFile) {
          onFileChange(prevFile.itemIndex, prevFile.fileIndex);
        }
      } else if (e.key === 'ArrowRight' && hasNext) {
        const nextFile = allFiles[currentFilePosition + 1];
        if (nextFile) {
          onFileChange(nextFile.itemIndex, nextFile.fileIndex);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasPrevious, hasNext, currentFilePosition, allFiles, onFileChange, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Determine file name with proper extension for PDF detection
  const fileName = useMemo(() => {
    if (!currentFile) return 'file';
    const baseName = currentFile.name || currentFile.publicId?.split('/').pop() || 'file';
    // If format is pdf but filename doesn't have .pdf extension, add it
    if (currentFile.type === 'application/pdf' && !baseName.toLowerCase().endsWith('.pdf')) {
      return `${baseName}.pdf`;
    }
    return baseName;
  }, [currentFile]);

  const fileUrl = currentFile?.url || '';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-[999] transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[60%] min-w-[500px] max-w-[900px] ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-[-4px_0_20px_rgba(0,0,0,0.15)] z-[1000] flex flex-col transform transition-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className={`p-4 border-b flex justify-between items-center flex-shrink-0 ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-semibold mb-1 truncate ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {fileName}
            </h3>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              File {currentFilePosition + 1} of {allFiles.length}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            {/* Navigation Buttons */}
            <button
              onClick={handlePrevious}
              disabled={!hasPrevious}
              className={`p-2 rounded-md flex items-center transition-all ${
                hasPrevious
                  ? theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              disabled={!hasNext}
              className={`p-2 rounded-md flex items-center transition-all ${
                hasNext
                  ? theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <ChevronRight size={20} />
            </button>
            {/* Download Button */}
            <button
              onClick={handleDownload}
              className={`p-2 rounded-md flex items-center transition-all ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              <Download size={20} />
            </button>
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-md transition-all ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* File Preview Content */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          {currentFile && fileUrl ? (
            <div className={`flex-1 overflow-auto ${
              currentFile.type === 'application/pdf' ? 'p-0' : 'p-4'
            } flex flex-col`}>
              <FilePreview fileUrl={fileUrl} fileName={fileName} />
            </div>
          ) : (
            <div className={`flex-1 flex items-center justify-center ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            } text-base`}>
              No file selected
            </div>
          )}
        </div>
      </div>
    </>
  );
}

