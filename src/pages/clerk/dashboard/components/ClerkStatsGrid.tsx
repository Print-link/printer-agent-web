import { FileText, CheckCircle, Clock } from "lucide-react";
import { StatCard } from "./StatCard";
import { useTheme } from "../../../../contexts/ThemeContext";
import type { ClerkDashboardStats } from "../../../../types";

interface ClerkStatsGridProps {
	stats: ClerkDashboardStats;
	isLoading: boolean;
}

export function ClerkStatsGrid({ stats, isLoading }: ClerkStatsGridProps) {
	const { theme } = useTheme();

	if (isLoading && !stats) {
		return (
			<div
				className={`p-3 rounded-md border text-center ${
					theme === "dark"
						? "bg-gray-800 border-gray-700"
						: "bg-white border-gray-200"
				}`}
			>
				<p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
					Loading...
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2">
			<StatCard
				icon={<FileText size={20} />}
				title="Total Orders"
				value={stats.total}
				color="#fbbf24"
				description="All orders"
			/>
			<StatCard
				icon={<CheckCircle size={20} />}
				title="Completed"
				value={stats.completed}
				color="#10b981"
				description="Successfully completed"
			/>
			<StatCard
				icon={<Clock size={20} />}
				title="Pending"
				value={stats.pending}
				color="#f59e0b"
				description="Awaiting processing"
			/>
			<StatCard
				icon={<Clock size={20} />}
				title="Quoted"
				value={stats.quoted}
				color="#f59e0b"
				description="Quoted orders"
			/>
			<StatCard
				icon={<CheckCircle size={20} />}
				title="Paid"
				value={stats.paid}
				color="#10b981"
				description="Paid orders"
			/>
			<StatCard
				icon={<Clock size={20} />}
				title="In Progress"
				value={stats.inProgress}
				color="#fbbf24"
				description="Currently processing"
			/>
			<StatCard
				icon={<FileText size={20} />}
				title="Today's Orders"
				value={stats.todayOrders}
				color="#fbbf24"
				description="Orders today"
			/>
			<StatCard
				icon={<FileText size={20} />}
				title="This Week"
				value={stats.thisWeekOrders}
				color="#fbbf24"
				description="Orders this week"
			/>
			<StatCard
				icon={<FileText size={20} />}
				title="This Month"
				value={stats.thisMonthOrders}
				color="#fbbf24"
				description="Orders this month"
			/>
		</div>
	);
}
