import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../../../services/api';
import type {
  ManagerBranchStats,
  CategoryAnalytics,
  WeeklyActivityItem,
} from '../../../../types';

interface DashboardFilters {
  startDate?: string;
  endDate?: string;
  month?: string;
  year?: string;
}

export function useManagerBranchDashboard(branchId: string | null) {
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  });
  const [days] = useState<number>(30);

  const [selectedYear] = selectedMonth.split('-');

  // Fetch dashboard stats
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['managerBranch', 'stats', branchId, filters],
    queryFn: () => apiService.getManagerBranchStats(branchId!, filters),
    enabled: !!branchId,
    staleTime: 30000,
  });

  // Fetch category analytics
  const {
    data: categoryAnalytics,
    isLoading: categoryLoading,
    error: categoryError,
    refetch: refetchCategory,
  } = useQuery({
    queryKey: ['managerBranch', 'categoryAnalytics', branchId, days],
    queryFn: () => apiService.getManagerBranchCategoryAnalytics(branchId!, days),
    enabled: !!branchId,
    staleTime: 60000,
  });

  // Fetch weekly activity
  const {
    data: weeklyActivity,
    isLoading: weeklyLoading,
    error: weeklyError,
    refetch: refetchWeekly,
  } = useQuery({
    queryKey: ['managerBranch', 'weeklyActivity', branchId, selectedMonth, selectedYear],
    queryFn: () => apiService.getManagerBranchWeeklyActivity(branchId!, selectedMonth, selectedYear),
    enabled: !!branchId && !!selectedMonth && !!selectedYear,
    staleTime: 60000,
  });

  const isLoading = statsLoading || categoryLoading || weeklyLoading;
  const hasError = statsError || categoryError || weeklyError;

  // Process weekly activity for calendar
  const weeklyActivityMap = useMemo<Map<string, number>>(() => {
    if (!weeklyActivity) return new Map<string, number>();
    const map = new Map<string, number>();
    weeklyActivity.forEach((item: WeeklyActivityItem) => {
      map.set(item.date, item.orders);
    });
    return map;
  }, [weeklyActivity]);

  // Calendar dates
  const calendarDates = useMemo(() => {
    const dates: Date[] = [];
    const [year, month] = selectedMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      dates.push(date);
    }

    return dates;
  }, [selectedMonth]);

  const calendarMonthHeader = useMemo(() => {
    if (calendarDates.length === 0) return '';
    const firstDate = calendarDates[0];
    return firstDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }, [calendarDates]);

  const calendarGridStart = useMemo(() => {
    if (calendarDates.length === 0) return 0;
    const firstDate = calendarDates[0];
    return firstDate.getDay();
  }, [calendarDates]);

  return {
    // State
    filters,
    setFilters,
    selectedMonth,
    setSelectedMonth,
    days,
    // Data
    stats: stats || {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      quotedOrders: 0,
      paidOrders: 0,
      inProgressOrders: 0,
      completedOrders: 0,
      todayOrders: 0,
      todayRevenue: 0,
      thisMonthOrders: 0,
      thisMonthRevenue: 0,
      thisWeekOrders: 0,
      thisWeekRevenue: 0,
    },
    categoryAnalytics: categoryAnalytics || [],
    weeklyActivity: weeklyActivity || [],
    weeklyActivityMap,
    // Calendar
    calendarDates,
    calendarMonthHeader,
    calendarGridStart,
    // Loading/Error
    isLoading,
    hasError,
    // Refetch
    refetchStats,
    refetchCategory,
    refetchWeekly,
    refetchAll: () => {
      refetchStats();
      refetchCategory();
      refetchWeekly();
    },
  };
}

