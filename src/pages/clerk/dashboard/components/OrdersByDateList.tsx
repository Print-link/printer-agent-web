import { useTheme } from '../../../../contexts/ThemeContext';
import type { ClerkOrderDetail } from '../../../../types';

interface OrdersByDateListProps {
  orders: ClerkOrderDetail[];
  selectedDate: string;
  isLoading?: boolean;
}

export function OrdersByDateList({
  orders,
  selectedDate,
  isLoading,
}: OrdersByDateListProps) {
  const { theme } = useTheme();

  if (!selectedDate) {
    return null;
  }

  const dateObj = new Date(selectedDate);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (isLoading) {
    return (
      <div className={`p-3 rounded-md border ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Loading orders...
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={`p-3 rounded-md border text-center ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-base font-bold mb-2 m-0 ${
          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Orders for {formattedDate}
        </h3>
        <p className={`text-sm m-0 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          No orders found for this date.
        </p>
      </div>
    );
  }

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
    <div>
      <div className={`p-3 rounded-md border mb-2 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-base font-bold m-0 ${
          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Orders for {formattedDate}
        </h3>
        <p className={`text-sm mt-1 m-0 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </p>
      </div>

      <div className={`rounded-md border overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        {orders.map((order, index) => {
          const statusColor = getStatusColor(order.status);
          return (
            <div
              key={order.id}
              className={`p-2.5 transition-all cursor-pointer ${
                index < orders.length - 1
                  ? theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'
                  : ''
              } ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700/50'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              {/* Order Content - Horizontal Layout */}
              <div className="flex items-center justify-between gap-3">
                {/* Left Section - Order Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`font-bold text-xs ${
                      theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      {order.orderNumber}
                    </span>
                    <span
                      className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold"
                      style={{
                        background: `${statusColor}20`,
                        color: statusColor,
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] mb-0.5 truncate ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                    title={order.client.fullName}
                  >
                    {order.client.fullName}
                  </p>
                  {order.items && order.items.length > 0 && (
                    <p className={`text-[10px] m-0 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                    </p>
                  )}
                </div>

                {/* Right Section - Price */}
                <div className="text-right flex-shrink-0">
                  <p className={`font-bold text-sm m-0 ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    ₵{order.totalPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

