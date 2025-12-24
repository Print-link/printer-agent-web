import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../../stores/authStore';
import { apiService } from '../../../../services/api';
import type { ClerkDashboardStats, ClerkCategoryAnalytics, ClerkWeeklyActivity, ClerkOrderDetail } from '../../../../types';

export function useClerkDashboard() {
  const { user } = useAuthStore();
  const branchId = user?.branch_id;

  // Check if clerk has branch_id
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  });

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [days] = useState<number>(30);

  // Extract year and month from selectedMonth (format: "YYYY-MM")
  const [selectedYear, selectedMonthOnly] = selectedMonth.split('-');

  // Fetch dashboard stats
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['clerkDashboard', 'stats', branchId],
    queryFn: () => apiService.getClerkDashboardStats(branchId),
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
    queryKey: ['clerkDashboard', 'categoryAnalytics', days, branchId],
    queryFn: () => apiService.getClerkCategoryAnalytics(days, branchId),
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
    queryKey: ['clerkDashboard', 'weeklyActivity', selectedMonthOnly, selectedYear, branchId],
    queryFn: () => apiService.getClerkWeeklyActivity(selectedMonthOnly, selectedYear, branchId),
    enabled: !!branchId && !!selectedMonthOnly && !!selectedYear,
    staleTime: 60000,
  });

  // Fetch orders by date
  const {
    data: ordersByDate,
    isLoading: ordersByDateLoading,
    error: ordersByDateError,
    refetch: refetchOrdersByDate,
  } = useQuery({
    queryKey: ['clerkDashboard', 'ordersByDate', selectedDate, branchId],
    queryFn: () => apiService.getClerkOrdersByDate(selectedDate!, branchId),
    enabled: !!branchId && !!selectedDate,
    staleTime: 30000,
  });

  const isLoading = statsLoading || categoryLoading || weeklyLoading || ordersByDateLoading;
  const hasError = statsError || categoryError || weeklyError || ordersByDateError;

  // Process weekly activity for calendar
  const weeklyActivityMap = useMemo<Map<string, number>>(() => {
    if (!weeklyActivity) return new Map<string, number>();
    const map = new Map<string, number>();
    weeklyActivity.forEach((item: ClerkWeeklyActivity) => {
      map.set(item.date, item.orders);
    });
    return map;
  }, [weeklyActivity]);

  // Calendar dates for selected month
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
    selectedMonth,
    setSelectedMonth,
    selectedDate,
    setSelectedDate,
    days,
    // Data
    stats: stats || {
      total: 0,
      pending: 0,
      quoted: 0,
      paid: 0,
      inProgress: 0,
      completed: 0,
      todayOrders: 0,
      thisWeekOrders: 0,
      thisMonthOrders: 0,
    },
    categoryAnalytics: categoryAnalytics || [],
    weeklyActivity: weeklyActivity || [],
    weeklyActivityMap,
    ordersByDate: ordersByDate || [],
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
    refetchOrdersByDate,
    refetchAll: () => {
      refetchStats();
      refetchCategory();
      refetchWeekly();
      if (selectedDate) {
        refetchOrdersByDate();
      }
    },
  };
}

