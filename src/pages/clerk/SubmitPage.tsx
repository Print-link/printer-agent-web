import { useState, useRef, FormEvent, DragEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../contexts/ThemeContext';
import { apiService } from '../../services/api';
import { Upload, File, Printer, X, RefreshCw, CheckCircle, Plus, Minus } from 'lucide-react';

interface FileInfo {
  name: string;
  file: File;
  size: number;
  type: string;
}

export default function SubmitPage() {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [printer, setPrinter] = useState('');
  const [copies, setCopies] = useState(1);
  const [colorMode, setColorMode] = useState<'color' | 'grayscale' | 'black-white'>('color');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [description, setDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch printers
  const { data: printers = [], isLoading: isLoadingPrinters, refetch: refetchPrinters } = useQuery({
    queryKey: ['printers'],
    queryFn: () => apiService.getAgents(),
    staleTime: 30000,
  });

  const submitMutation = useMutation({
    mutationFn: async (jobData: any) => {
      // Upload file first
      if (!selectedFile) throw new Error('No file selected');
      
      const uploadResult = await apiService.uploadFile(selectedFile.file);
      
      // Create print job
      const job = await apiService.createJob({
        customerId: 'current-user',
        customerName: 'Current User',
        fileName: uploadResult.fileName,
        fileSize: uploadResult.fileSize,
        fileType: selectedFile.type,
        status: 'pending',
        priority: 'medium',
        pages: copies,
        cost: 0,
        ...jobData,
      });

      // Submit to printer if agent available
      if (printers.length > 0 && printer) {
        await apiService.submitJobToPrinter(job.id, printer);
      }

      return job;
    },
    onSuccess: () => {
      setSubmitSuccess(true);
      setSelectedFile(null);
      setCopies(1);
      setColorMode('color');
      setOrientation('portrait');
      setDescription('');
      setSubmitError(null);
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setTimeout(() => setSubmitSuccess(false), 3000);
    },
    onError: (error: any) => {
      setSubmitError(error?.message || 'Failed to submit print job');
    },
  });

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const allowedExtensions = ['pdf', 'txt', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'rtf', 'html'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    if (!ext || !allowedExtensions.includes(ext)) {
      return {
        valid: false,
        error: `File type .${ext} is not supported. Allowed: ${allowedExtensions.join(', ')}`,
      };
    }
    
    if (file.size > 50 * 1024 * 1024) {
      return {
        valid: false,
        error: 'File size must be less than 50MB',
      };
    }
    
    return { valid: true };
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.valid) {
        setSubmitError(validation.error || 'Invalid file');
        return;
      }
      
      setSelectedFile({
        name: file.name,
        file: file,
        size: file.size,
        type: file.type || file.name.split('.').pop() || 'unknown',
      });
      setSubmitError(null);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.valid) {
        setSubmitError(validation.error || 'Invalid file');
        return;
      }
      
      setSelectedFile({
        name: file.name,
        file: file,
        size: file.size,
        type: file.type || file.name.split('.').pop() || 'unknown',
      });
      setSubmitError(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setSubmitError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !printer) {
      setSubmitError(!selectedFile ? 'Please select a file' : 'Please select a printer');
      return;
    }

    if (copies < 1 || copies > 100) {
      setSubmitError('Copies must be between 1 and 100');
      return;
    }

    submitMutation.mutate({
      description: description.trim() || undefined,
      metadata: {
        copies,
        colorMode,
        orientation,
      },
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={`p-6 max-w-3xl mx-auto ${
      theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
    }`}>
      <div className={`rounded-lg shadow-xl p-8 ${
        theme === 'dark' 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold flex items-center gap-3 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            <Upload className="text-amber-400" size={28} />
            Submit New Print Job
          </h2>
          <button
            onClick={() => refetchPrinters()}
            disabled={isLoadingPrinters}
            className={`p-2 rounded-md flex items-center gap-2 ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            <RefreshCw size={16} className={isLoadingPrinters ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className={`mb-6 p-4 rounded-md flex items-center gap-3 ${
            theme === 'dark'
              ? 'bg-green-900/30 border border-green-800 text-green-400'
              : 'bg-green-50 border border-green-200 text-green-600'
          }`}>
            <CheckCircle size={20} />
            <span className="font-semibold">Print job submitted successfully!</span>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className={`mb-6 p-4 rounded-md flex items-center justify-between gap-3 ${
            theme === 'dark'
              ? 'bg-red-900/30 border border-red-800 text-red-400'
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
            <span className="font-semibold flex-1">{submitError}</span>
            <button
              onClick={() => setSubmitError(null)}
              className="p-1 rounded hover:bg-red-900/20"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Select File <span className="text-red-500">*</span>
            </label>

            {selectedFile ? (
              <div className={`p-4 rounded-lg border-2 border-amber-400 flex items-center gap-4 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-amber-100'
                }`}>
                  <File className="text-amber-400" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {selectedFile.name}
                  </p>
                  <div className={`flex gap-3 text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <span>{selectedFile.type}</span>
                    <span>•</span>
                    <span>{formatFileSize(selectedFile.size)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className={`p-2 rounded-md hover:bg-red-500 hover:text-white transition-colors ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleFileSelect}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/10'
                    : theme === 'dark'
                    ? 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                }`}
              >
                <Upload className={`mx-auto mb-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} size={48} />
                <p className={`font-semibold mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {isDragging ? 'Drop file here' : 'Click to select or drag and drop'}
                </p>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  PDF, DOC, DOCX, TXT, JPG, PNG, GIF, BMP, RTF, HTML
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp,.rtf,.html"
              className="hidden"
            />
          </div>

          {/* Printer Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Select Printer <span className="text-red-500">*</span>
            </label>
            {isLoadingPrinters ? (
              <div className={`p-4 text-center ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Loading printers...
              </div>
            ) : printers.length === 0 ? (
              <div className={`p-4 text-center rounded-lg ${
                theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'
              }`}>
                <p className={`mb-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  No printers available
                </p>
                <button
                  type="button"
                  onClick={() => refetchPrinters()}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-md font-semibold text-sm"
                >
                  Retry
                </button>
              </div>
            ) : (
              <select
                value={printer}
                onChange={(e) => setPrinter(e.target.value)}
                className={`w-full px-4 py-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                required
              >
                <option value="">Select a printer</option>
                {printers.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.status ? `(${p.status})` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Copies */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Number of Copies
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCopies(Math.max(1, copies - 1))}
                disabled={copies <= 1}
                className={`p-2 rounded-md ${
                  copies <= 1
                    ? 'opacity-50 cursor-not-allowed'
                    : theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <Minus size={20} />
              </button>
              <input
                type="number"
                value={copies}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  setCopies(Math.max(1, Math.min(100, value)));
                }}
                min={1}
                max={100}
                className={`flex-1 px-4 py-2 rounded-md border text-center font-semibold ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-amber-400`}
              />
              <button
                type="button"
                onClick={() => setCopies(Math.min(100, copies + 1))}
                disabled={copies >= 100}
                className={`p-2 rounded-md ${
                  copies >= 100
                    ? 'opacity-50 cursor-not-allowed'
                    : theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <Plus size={20} />
              </button>
            </div>
            <p className={`text-xs mt-2 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Between 1 and 100 copies
            </p>
          </div>

          {/* Print Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Color Mode
              </label>
              <select
                value={colorMode}
                onChange={(e) => setColorMode(e.target.value as any)}
                className={`w-full px-4 py-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-amber-400`}
              >
                <option value="color">Color</option>
                <option value="grayscale">Grayscale</option>
                <option value="black-white">Black & White</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Orientation
              </label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as any)}
                className={`w-full px-4 py-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-amber-400`}
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Description / Notes (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any notes or description for this print job..."
              rows={3}
              maxLength={500}
              className={`w-full px-4 py-2 rounded-md border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-amber-400`}
            />
            <p className={`text-xs mt-1 text-right ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              {description.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedFile || !printer || submitMutation.isPending || isLoadingPrinters}
            className={`w-full py-3 px-4 rounded-md font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              !selectedFile || !printer || submitMutation.isPending || isLoadingPrinters
                ? 'bg-amber-300 cursor-not-allowed'
                : 'bg-amber-400 hover:bg-amber-500 active:bg-amber-600'
            } text-gray-900 shadow-md hover:shadow-lg`}
          >
            {submitMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                Submitting...
              </>
            ) : (
              <>
                <Upload size={18} />
                Submit Print Job
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

