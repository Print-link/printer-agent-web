import {
  FileText,
  CheckCircle,
  Clock,
  DollarSign,
  Store,
} from 'lucide-react';
import { StatCard } from './StatCard';
import { useTheme } from '../../../../contexts/ThemeContext';
import type { ManagerOverviewStats, ManagerBranchStats } from '../../../../types';

interface ManagerStatsGridProps {
  stats: ManagerOverviewStats | ManagerBranchStats;
  isLoading: boolean;
  isBranchView?: boolean;
}

export function ManagerStatsGrid({ stats, isLoading, isBranchView }: ManagerStatsGridProps) {
  const { theme } = useTheme();

  if (isLoading && !stats) {
    return (
      <div className={`p-3 rounded-md border text-center ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2">
      <StatCard
        icon={<FileText size={20} />}
        title="Total Orders"
        value={stats.totalOrders}
        color="#fbbf24"
        description="All orders"
      />
      <StatCard
        icon={<DollarSign size={20} />}
        title="Total Revenue"
        value={`₵${stats.totalRevenue.toFixed(2)}`}
        color="#10b981"
        description="Total revenue"
      />
      <StatCard
        icon={<CheckCircle size={20} />}
        title="Completed"
        value={stats.completedOrders}
        color="#10b981"
        description="Completed orders"
      />
      <StatCard
        icon={<Clock size={20} />}
        title="Pending"
        value={stats.pendingOrders}
        color="#f59e0b"
        description="Pending orders"
      />
      <StatCard
        icon={<CheckCircle size={20} />}
        title="Paid"
        value={stats.paidOrders}
        color="#10b981"
        description="Paid orders"
      />
      <StatCard
        icon={<Clock size={20} />}
        title="In Progress"
        value={stats.inProgressOrders}
        color="#fbbf24"
        description="In progress"
      />
      <StatCard
        icon={<FileText size={20} />}
        title="Today's Orders"
        value={stats.todayOrders}
        color="#fbbf24"
        description="Orders today"
      />
      <StatCard
        icon={<DollarSign size={20} />}
        title="Today's Revenue"
        value={`₵${stats.todayRevenue.toFixed(2)}`}
        color="#10b981"
        description="Revenue today"
      />
      {!isBranchView && 'branchCount' in stats && (
        <>
          <StatCard
            icon={<Store size={20} />}
            title="Total Branches"
            value={stats.branchCount}
            color="#fbbf24"
            description="All branches"
          />
          <StatCard
            icon={<Store size={20} />}
            title="Active Branches"
            value={stats.activeBranchCount}
            color="#10b981"
            description="Active branches"
          />
        </>
      )}
      {isBranchView && 'thisWeekOrders' in stats && (
        <>
          <StatCard
            icon={<FileText size={20} />}
            title="This Week Orders"
            value={stats.thisWeekOrders}
            color="#fbbf24"
            description="Orders this week"
          />
          <StatCard
            icon={<DollarSign size={20} />}
            title="This Week Revenue"
            value={`₵${stats.thisWeekRevenue.toFixed(2)}`}
            color="#10b981"
            description="Revenue this week"
          />
        </>
      )}
    </div>
  );
}

