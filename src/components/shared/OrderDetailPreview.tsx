import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../stores/authStore';
import { useBranchStore } from '../../stores/branchStore';
import { apiService } from '../../services/api';
import { X, Download, CheckCircle, FileText, User, Mail, Phone, Calendar, DollarSign } from 'lucide-react';
import type { ClerkOrder, ClerkOrderDetail } from '../../types';
import { FilePreviewDrawer } from './FilePreviewDrawer';

interface OrderDetailPreviewProps {
  order: ClerkOrder;
  branchId?: string;
  onClose: () => void;
  onOrderUpdate?: () => void;
}

/**
 * OrderDetailPreview - Displays detailed order information with file preview capability
 * Works for both clerk and manager roles - no role restrictions on file preview
 * Files can be previewed by clicking on file thumbnails, which opens the FilePreviewDrawer
 */
export default function OrderDetailPreview({ order, branchId: propBranchId, onClose, onOrderUpdate }: OrderDetailPreviewProps) {
  const { theme } = useTheme();
  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();
  const queryClient = useQueryClient();
  const [selectedFileIndex, setSelectedFileIndex] = useState<{ itemIndex: number; fileIndex: number } | null>(null);

  // Determine branchId: use prop if provided, otherwise determine based on role
  // For managers use selectedBranch, for clerks use user.branch_id
  const branchId = propBranchId || (user?.role === 'manager' 
    ? selectedBranch?.id 
    : user?.branch_id);

  const { data: orderDetail, isLoading } = useQuery({
    queryKey: ['orderDetail', order.id, branchId],
    queryFn: async () => {
      // Pass branchId for managers to ensure proper data fetching
      const data = await apiService.getBranchOrderDetail(order.id, branchId);
      // Debug: Log the order detail to see the structure
      console.log('Order Detail Response:', data);
      if (data?.items) {
        data.items.forEach((item: any, index: number) => {
          console.log(`Item ${index} options:`, item.options);
          console.log(`Item ${index} files:`, item.options?.files);
        });
      }
      return data;
    },
    enabled: !!order.id,
  });

  const updateOrderMutation = useMutation({
    mutationFn: (status: 'COMPLETED') => {
      return apiService.updateBranchOrder(order.id, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orderDetail', order.id, branchId] });
      queryClient.invalidateQueries({ queryKey: ['branchOrders'] });
      if (onOrderUpdate) onOrderUpdate();
    },
  });

  const handleMarkAsCompleted = async () => {
    if (order.status === 'COMPLETED') {
      alert('Order is already completed');
      return;
    }

    if (confirm('Are you sure you want to mark this order as completed?')) {
      updateOrderMutation.mutate('COMPLETED');
    }
  };

  const handleDownloadFile = async (fileUrl: string, fileName: string) => {
    try {
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
      alert('Failed to download file');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'QUOTED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'PAID':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'IN_PROGRESS':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  return (
    <div className={`h-full flex flex-col ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-3 sm:p-4 border-b flex-shrink-0 ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex-1 min-w-0">
          <h2 className={`text-base sm:text-lg font-semibold mb-1 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Order Details
          </h2>
          <p className={`text-xs truncate ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {formattedDate}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`p-2 rounded-md flex-shrink-0 ml-2 ${
            theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 sm:space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
          </div>
        ) : (
          <>
            {/* Order Info */}
            <div className={`p-3 sm:p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div>
                  <p className={`text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Order Number
                  </p>
                  <p className={`text-lg font-bold ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {order.orderNumber}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Total Price
                  </p>
                  <p className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    ₵{order.totalPrice.toFixed(2)}
                  </p>
                </div>
                {order.status !== 'COMPLETED' && (
                  <button
                    onClick={handleMarkAsCompleted}
                    disabled={updateOrderMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-semibold text-sm"
                  >
                    <CheckCircle size={16} />
                    {updateOrderMutation.isPending ? 'Updating...' : 'Mark as Completed'}
                  </button>
                )}
              </div>
            </div>

            {/* Client Info */}
            <div className={`p-3 sm:p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <h3 className={`text-base sm:text-lg font-semibold mb-3 ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Client Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} size={18} />
                  <span className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
                    {order.client.fullName}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} size={18} />
                  <span className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
                    {order.client.email}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} size={18} />
                  <span className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
                    {order.client.phoneNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            {orderDetail && orderDetail.items && orderDetail.items.length > 0 && (
              <div className={`p-3 sm:p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`text-base sm:text-lg font-semibold mb-3 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  Order Items ({orderDetail.items.length})
                </h3>
                <div className="space-y-3">
                  {orderDetail.items.map((item, itemIndex) => {
                    // Parse options if it's a string
                    let parsedOptions = item.options;
                    if (typeof item.options === 'string') {
                      try {
                        parsedOptions = JSON.parse(item.options);
                      } catch (e) {
                        console.error('Error parsing options:', e);
                        parsedOptions = {};
                      }
                    }

                    // Ensure options has files array
                    const files = parsedOptions?.files || [];
                    const hasFiles = Array.isArray(files) && files.length > 0;

                    return (
                      <div
                        key={item.id}
                        className={`p-3 sm:p-4 rounded-lg border ${
                          theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm sm:text-base font-semibold mb-1 ${
                              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                            }`}>
                              {item.serviceName}
                            </h4>
                            <p className={`text-xs sm:text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {item.category.name} • {item.subCategory.name}
                            </p>
                          </div>
                          <span className={`text-sm sm:text-base font-bold whitespace-nowrap ${
                            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                          }`}>
                            ₵{item.calculatedPrice.toFixed(2)}
                          </span>
                        </div>

                        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2 text-xs sm:text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <div className="truncate">Size: {item.width} × {item.height} {item.measurementUnit}</div>
                          <div>Quantity: {item.quantity}</div>
                          <div>Color: {parsedOptions?.color ? 'Yes' : 'No'}</div>
                          <div>Front/Back: {parsedOptions?.frontBack ? 'Yes' : 'No'}</div>
                        </div>

                        {/* Files */}
                        {hasFiles && (
                          <div className={`mt-2 pt-2 border-t ${
                            theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <p className={`text-xs sm:text-sm font-semibold flex items-center gap-1.5 ${
                                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                              }`}>
                                <FileText size={14} />
                                Files ({files.length})
                              </p>
                            </div>
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2 sm:gap-3">
                              {files.map((file: any, fileIndex: number) => {
                                // Handle different file structures
                                const fileUrl = file.url || file.fileUrl || file.secure_url || '';
                                const fileName = file.name || file.publicId?.split('/').pop() || `File ${fileIndex + 1}`;
                                const isSelected = selectedFileIndex?.itemIndex === itemIndex && selectedFileIndex?.fileIndex === fileIndex;
                                
                                return (
                                  <div
                                    key={fileIndex}
                                    onClick={() => setSelectedFileIndex(isSelected ? null : { itemIndex, fileIndex })}
                                    className={`relative border-2 rounded-md overflow-hidden cursor-pointer transition-all ${
                                      isSelected
                                        ? 'border-amber-400 ring-2 ring-amber-400'
                                        : theme === 'dark'
                                        ? 'border-gray-600 hover:border-gray-500'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                  >
                                    {/* File Preview Thumbnail */}
                                    <div className={`w-full h-[120px] flex items-center justify-center ${
                                      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                                    }`}>
                                      {file.format === 'pdf' ? (
                                        <FileText className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} size={40} />
                                      ) : (
                                        <img
                                          src={fileUrl}
                                          alt={fileName}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                          }}
                                        />
                                      )}
                                    </div>
                                    {/* File Info */}
                                    <div className={`p-2 ${
                                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                                    }`}>
                                      <p className={`text-xs font-medium truncate ${
                                        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                                      }`}>
                                        {fileName}
                                      </p>
                                      {file.size && (
                                        <p className={`text-[10px] mt-0.5 ${
                                          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                        }`}>
                                          {(file.size / 1024).toFixed(1)} KB
                                        </p>
                                      )}
                                    </div>
                                    {/* Download Button Overlay */}
                                    {fileUrl && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDownloadFile(fileUrl, fileName);
                                        }}
                                        className={`absolute top-1 right-1 p-1.5 rounded bg-black/60 hover:bg-black/80 text-white transition-all ${
                                          theme === 'dark' ? 'hover:bg-black/80' : 'hover:bg-black/80'
                                        }`}
                                      >
                                        <Download size={14} />
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* File Preview Drawer */}
      <FilePreviewDrawer
        isOpen={selectedFileIndex !== null}
        onClose={() => setSelectedFileIndex(null)}
        orderDetail={orderDetail || null}
        selectedFileIndex={selectedFileIndex}
        onFileChange={(itemIndex, fileIndex) => setSelectedFileIndex({ itemIndex, fileIndex })}
      />
    </div>
  );
}

