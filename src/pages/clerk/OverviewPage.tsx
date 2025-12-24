import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../contexts/ThemeContext';
import { apiService } from '../../services/api';
import { Home, Package, DollarSign, TrendingUp, Store } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function OverviewPage() {
  const { user } = useAuthStore();
  const { theme } = useTheme();

  if (user?.role !== 'manager') {
    return (
      <div className={`p-6 rounded-lg ${
        theme === 'dark' 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Access denied. Manager role required.
        </p>
      </div>
    );
  }

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['managerOverview', 'stats'],
    queryFn: () => apiService.getManagerOverviewStats(),
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const { data: branchBreakdown = [] } = useQuery({
    queryKey: ['managerOverview', 'branches'],
    queryFn: () => apiService.getManagerOverviewBranches(),
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const { data: categoryAnalytics = [] } = useQuery({
    queryKey: ['managerOverview', 'categoryAnalytics'],
    queryFn: () => apiService.getManagerOverviewCategoryAnalytics(),
    staleTime: 60000,
    refetchInterval: 120000,
  });

  const branchChartData = useMemo(() => {
    return branchBreakdown.map((branch: any) => ({
      name: branch.branchName.length > 15 ? branch.branchName.substring(0, 15) + '...' : branch.branchName,
      revenue: branch.totalRevenue || 0,
      orders: branch.totalOrders || 0,
    }));
  }, [branchBreakdown]);

  const COLORS = ['#fbbf24', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b'];

  if (isLoadingStats && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-4xl font-bold mb-2 ${
          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Overview Dashboard
        </h1>
        <p className={`text-lg ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          See how all your branches are performing
        </p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-6 rounded-lg ${
            theme === 'dark' 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Total Orders
                </p>
                <p className={`text-3xl font-bold mt-2 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {stats.totalOrders}
                </p>
              </div>
              <Package className="text-blue-500" size={32} />
            </div>
          </div>

          <div className={`p-6 rounded-lg ${
            theme === 'dark' 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Total Revenue
                </p>
                <p className={`text-3xl font-bold mt-2 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  ₵{stats.totalRevenue?.toFixed(2) || '0.00'}
                </p>
              </div>
              <DollarSign className="text-green-500" size={32} />
            </div>
          </div>

          <div className={`p-6 rounded-lg ${
            theme === 'dark' 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Branches
                </p>
                <p className={`text-3xl font-bold mt-2 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {stats.branchCount}
                </p>
              </div>
              <Store className="text-purple-500" size={32} />
            </div>
          </div>

          <div className={`p-6 rounded-lg ${
            theme === 'dark' 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Today's Revenue
                </p>
                <p className={`text-3xl font-bold mt-2 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  ₵{stats.todayRevenue?.toFixed(2) || '0.00'}
                </p>
              </div>
              <TrendingUp className="text-amber-500" size={32} />
            </div>
          </div>
        </div>
      )}

      {/* Branch Revenue Chart */}
      {branchChartData.length > 0 && (
        <div className={`p-6 rounded-lg ${
          theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Branch Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={branchChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="name" 
                stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
              />
              <YAxis 
                stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="revenue" fill="#fbbf24" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category Analytics */}
      {categoryAnalytics.length > 0 && (
        <div className={`p-6 rounded-lg ${
          theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Category Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryAnalytics.slice(0, 6).map((category: any, index: number) => (
              <div
                key={category.categoryId}
                className={`p-4 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {category.categoryName}
                  </h4>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      Orders:
                    </span>
                    <span className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
                      {category.totalOrders}
                    </span>
                  </div>
                  {category.totalRevenue !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        Revenue:
                      </span>
                      <span className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
                        ₵{category.totalRevenue.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

