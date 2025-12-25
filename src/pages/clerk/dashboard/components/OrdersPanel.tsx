import { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import type { ClerkOrderDetail } from '../../../../types';

interface OrdersPanelProps {
  orders: ClerkOrderDetail[];
  selectedDate: string;
  isLoading?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function OrdersPanel({
  orders,
  selectedDate,
  isLoading,
  isOpen,
  onClose,
}: OrdersPanelProps) {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter orders based on search query
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) {
      return orders;
    }
    const query = searchQuery.toLowerCase();
    return orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(query) ||
        order.client.fullName.toLowerCase().includes(query) ||
        order.status.toLowerCase().includes(query)
    );
  }, [orders, searchQuery]);

  if (!isOpen || !selectedDate) {
    return null;
  }

  const dateObj = new Date(selectedDate);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return '#10b981';
      case 'IN_PROGRESS':
        return '#8b5cf6';
      case 'PAID':
        return '#3b82f6';
      case 'QUOTED':
        return '#f59e0b';
      default:
        return '#ef4444';
    }
  };

  return (
    <>
      {/* Backdrop */}
      {/* <div
        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      /> */}
      
      {/* Panel */}
      <div
        className={`fixed right-0 top-16 h-[calc(100vh-4rem)] w-full lg:w-[340px] z-40 flex flex-col shadow-2xl transition-transform duration-300 ${
          theme === 'dark' ? 'bg-gray-800 border-l border-gray-700' : 'bg-white border-l border-gray-200'
        }`}
      >
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-bold mb-1 truncate ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}
          >
            Orders for {formattedDate}
          </h3>
          <p
            className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
            {searchQuery && ` (filtered from ${orders.length})`}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`ml-4 p-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-100'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          aria-label="Close panel"
        >
          <X size={20} />
        </button>
      </div>

      {/* Search Bar */}
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="relative">
          <Search
            size={18}
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}
          />
          <input
            type="text"
            placeholder="Search by order number, client name, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-amber-400'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-amber-400'
            } focus:outline-none focus:ring-2 focus:ring-amber-400/20`}
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Loading orders...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <p
              className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {searchQuery
                ? 'No orders match your search.'
                : 'No orders found for this date.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredOrders.map((order) => {
              const statusColor = getStatusColor(order.status);
              return (
                <div
                  key={order.id}
                  className={`p-4 transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700/50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Order Content */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`font-bold text-sm ${
                          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}
                      >
                        {order.orderNumber}
                      </span>
                      <span
                        className="px-2 py-1 rounded-md text-xs font-semibold"
                        style={{
                          background: `${statusColor}20`,
                          color: statusColor,
                        }}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p
                      className={`text-sm truncate ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                      title={order.client.fullName}
                    >
                      {order.client.fullName}
                    </p>
                    {order.items && order.items.length > 0 && (
                      <p
                        className={`text-xs ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        }`}
                      >
                        {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-1">
                      <p
                        className={`font-bold text-base ${
                          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}
                      >
                        ₵{order.totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

