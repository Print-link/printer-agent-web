import { PieChart } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import type { ClerkCategoryAnalytics } from '../../../../types';

interface ClerkCategoryAnalyticsProps {
  categoryAnalytics: ClerkCategoryAnalytics[];
  isLoading?: boolean;
}

export function ClerkCategoryAnalytics({
  categoryAnalytics,
  isLoading,
}: ClerkCategoryAnalyticsProps) {
  const { theme } = useTheme();

  if (isLoading && (!categoryAnalytics || categoryAnalytics.length === 0)) {
    return (
      <div className={`p-3 rounded-md border text-center ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Loading category analytics...
        </p>
      </div>
    );
  }

  if (!categoryAnalytics || categoryAnalytics.length === 0) {
    return (
      <div className={`p-3 rounded-md border text-center ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          No category data available
        </p>
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-md border ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center gap-1 mb-3">
        <PieChart size={20} className="text-amber-400" />
        <h3 className={`text-sm font-semibold m-0 ${
          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Category Performance
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {categoryAnalytics.map((cat) => (
          <div
            key={cat.categoryId}
            className={`p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}
          >
            {cat.categoryImageUrl && (
              <img
                src={cat.categoryImageUrl}
                alt={cat.categoryName}
                className="w-full h-16 sm:h-20 object-cover rounded mb-1"
              />
            )}
            <div className={`font-semibold mb-1 text-sm sm:text-base truncate ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {cat.categoryName}
            </div>
            <div className={`text-[10px] sm:text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <div>Total Orders: {cat.totalOrders}</div>
              <div>Completed: {cat.completedOrders}</div>
              <div>Pending: {cat.pendingOrders}</div>
              <div>Quoted: {cat.quotedOrders}</div>
              <div>Paid: {cat.paidOrders}</div>
              <div>In Progress: {cat.inProgressOrders}</div>
              <div className="mt-1 font-semibold text-amber-400">
                Order Items: {cat.orderItemsCount}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

