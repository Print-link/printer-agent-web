import { useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface FilePreviewProps {
  fileName: string;
  fileUrl: string;
}

// Utility function to get file type
const getFileType = (fileName: string): 'image' | 'pdf' | 'document' | 'unknown' => {
  if (!fileName) return 'unknown';
  const lowerName = fileName.toLowerCase();
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
  if (imageExtensions.some(ext => lowerName.endsWith(ext))) return 'image';
  
  if (lowerName.endsWith('.pdf')) return 'pdf';
  
  const documentExtensions = ['.doc', '.docx', '.txt', '.rtf'];
  if (documentExtensions.some(ext => lowerName.endsWith(ext))) return 'document';
  
  return 'unknown';
};

export function FilePreview({ fileName, fileUrl }: FilePreviewProps) {
  const { theme } = useTheme();
  const fileType = getFileType(fileName);

  // Simple download handler - just opens the file URL
  const handleDownload = () => {
    if (!fileUrl) return;
    window.open(fileUrl, '_blank');
  };

  // Block print functionality
  useEffect(() => {
    const handleBeforePrint = (e: Event) => {
      e.preventDefault();
      alert('Printing is disabled');
    };

    const handlePrintShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        alert('Printing is disabled');
      }
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('keydown', handlePrintShortcut);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('keydown', handlePrintShortcut);
    };
  }, []);

  if (fileType === 'image' && fileUrl) {
    return (
      <div className={`flex flex-col items-center justify-center gap-4 p-3 rounded-xl min-h-[600px] h-full overflow-auto ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <img
          src={fileUrl}
          alt={fileName}
          className="max-w-full max-h-[calc(100%-60px)] object-contain rounded-lg"
        />
        <button
          onClick={handleDownload}
          disabled={!fileUrl}
          className={`px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-transform ${
            theme === 'dark'
              ? 'bg-amber-500 hover:bg-amber-600 text-black'
              : 'bg-amber-400 hover:bg-amber-500 text-black'
          } ${!fileUrl ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}
        >
          ⬇️ Download
        </button>
      </div>
    );
  }

  if (fileType === 'pdf' && fileUrl) {
    // Use fileUrl directly in iframe - no fetching needed
    const pdfUrl = `${fileUrl}#toolbar=1&navpanes=0&scrollbar=1`;

    return (
      <div
        className={`p-4 rounded-xl h-full min-h-[600px] overflow-hidden relative select-none ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
        onContextMenu={(e) => e.preventDefault()}
      >
        <iframe
          src={pdfUrl}
          className="w-full h-full border-none rounded-lg"
          title={fileName}
        />
      </div>
    );
  }

  if (fileType === 'document' && fileUrl) {
    // Use Microsoft Office Online Viewer for Word documents
    // This works with publicly accessible URLs
    const isDocx =
      fileName.toLowerCase().endsWith('.docx') || fileName.toLowerCase().endsWith('.doc');
    const viewerUrl = isDocx
      ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`
      : fileUrl;

    return (
      <div
        className={`p-4 rounded-xl h-full min-h-[600px] flex flex-col gap-3 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className="flex justify-end gap-2 flex-shrink-0">
          <button
            onClick={handleDownload}
            disabled={!fileUrl}
            className={`px-4 py-2 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-transform ${
              theme === 'dark'
                ? 'bg-amber-500 hover:bg-amber-600 text-black'
                : 'bg-amber-400 hover:bg-amber-500 text-black'
            } ${!fileUrl ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}
          >
            ⬇️ Download
          </button>
        </div>
        <div className="flex-1 overflow-hidden relative select-none rounded-lg border min-h-0">
          <iframe
            src={viewerUrl}
            className="w-full h-full border-none rounded-lg"
            title={fileName}
            allow="fullscreen"
          />
        </div>
      </div>
    );
  }

  // Default/Unknown file type
  const fileIcon = fileType === 'document' ? '📝' : '📄';
  const fileTypeLabel = getFileType(fileName) === 'document' ? 'DOCUMENT' : 'FILE';

  return (
    <div className={`p-16 text-center border rounded-xl h-full min-h-[400px] flex flex-col justify-center ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="text-7xl mb-4 opacity-60">
        {fileIcon}
      </div>
      <p className={`text-lg font-bold mb-2 ${
        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
      }`}>
        {fileName}
      </p>
      <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
        {fileTypeLabel}
      </p>
      {fileUrl && (
        <div className="flex gap-3 justify-center mt-4">
          <button
            onClick={handleDownload}
            disabled={!fileUrl}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-transform ${
              theme === 'dark'
                ? 'bg-amber-500 hover:bg-amber-600 text-black'
                : 'bg-amber-400 hover:bg-amber-500 text-black'
            } ${!fileUrl ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}
          >
            ⬇️ Download
          </button>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-transform border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100 hover:bg-gray-600'
                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
            } hover:scale-105`}
          >
            🔗 Open File
          </a>
        </div>
      )}
    </div>
  );
}

