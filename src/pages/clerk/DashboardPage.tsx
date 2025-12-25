import { useMemo, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuthStore } from "../../stores/authStore";
import { useBranchStore } from "../../stores/branchStore";
import { useClerkDashboard } from "./dashboard/hooks/useClerkDashboard";
import { useManagerOverviewDashboard } from "./dashboard/hooks/useManagerOverviewDashboard";
import { useManagerBranchDashboard } from "./dashboard/hooks/useManagerBranchDashboard";
import {
	DashboardHeader,
	ClerkStatsGrid,
	ManagerStatsGrid,
	ClerkCategoryAnalytics,
	ManagerCategoryAnalytics,
	StatusChart,
	ActivityCalendar,
	OrdersPanel,
} from "./dashboard/components";

export default function DashboardPage() {
	const { theme } = useTheme();
	const { user } = useAuthStore();
	const { selectedBranch } = useBranchStore();
	const isManager = user?.role === "manager";
	const isClerk = user?.role === "clerk";
	const [isOrdersPanelOpen, setIsOrdersPanelOpen] = useState(false);

	// Use appropriate dashboard hook based on role - all hooks must be called unconditionally
	const clerkDashboardResult = useClerkDashboard();
	const managerOverviewResult = useManagerOverviewDashboard();
	const managerBranchResult = useManagerBranchDashboard(
		selectedBranch?.id || null
	);

	// Select the appropriate dashboard based on role
	const clerkDashboard = isClerk ? clerkDashboardResult : null;
	const managerOverview =
		isManager && !selectedBranch ? managerOverviewResult : null;
	const managerBranch =
		isManager && selectedBranch ? managerBranchResult : null;

	const dashboard = clerkDashboard || managerOverview || managerBranch;

	// Prepare chart data - must be called before any conditional returns
	const chartData = useMemo(() => {
		if (isClerk && clerkDashboard) {
			return {
				completed: clerkDashboard.stats.completed,
				pending: clerkDashboard.stats.pending,
				quoted: clerkDashboard.stats.quoted,
				paid: clerkDashboard.stats.paid,
				inProgress: clerkDashboard.stats.inProgress,
				max: Math.max(
					clerkDashboard.stats.completed,
					clerkDashboard.stats.pending,
					clerkDashboard.stats.quoted,
					clerkDashboard.stats.paid,
					clerkDashboard.stats.inProgress,
					10
				),
			};
		}
		if (isManager && (managerOverview || managerBranch)) {
			const mStats = managerOverview?.stats || managerBranch?.stats;
			if (mStats) {
				return {
					completed: mStats.completedOrders,
					pending: mStats.pendingOrders,
					quoted: mStats.quotedOrders,
					paid: mStats.paidOrders,
					inProgress: mStats.inProgressOrders,
					max: Math.max(
						mStats.completedOrders,
						mStats.pendingOrders,
						mStats.quotedOrders,
						mStats.paidOrders,
						mStats.inProgressOrders,
						10
					),
				};
			}
		}
		return {
			completed: 0,
			pending: 0,
			quoted: 0,
			paid: 0,
			inProgress: 0,
			max: 10,
		};
	}, [isClerk, isManager, clerkDashboard, managerOverview, managerBranch]);

	// Check if clerk has branch_id
	if (isClerk && !user?.branch_id) {
		return (
			<div
				className={`p-6 rounded-lg ${
					theme === "dark"
						? "bg-gray-800 border border-gray-700"
						: "bg-white border border-gray-200"
				}`}
			>
				<h2
					className={`text-xl font-semibold mb-4 ${
						theme === "dark" ? "text-red-400" : "text-red-600"
					}`}
				>
					No Branch Assigned
				</h2>
				<p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
					You are not assigned to a branch. Please contact your manager to
					assign you to a branch.
				</p>
			</div>
		);
	}

	if (!dashboard) {
		return (
			<div
				className={`p-6 rounded-lg ${
					theme === "dark"
						? "bg-gray-800 border border-gray-700"
						: "bg-white border border-gray-200"
				}`}
			>
				<p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
					Loading dashboard...
				</p>
			</div>
		);
	}

	const {
		selectedMonth,
		setSelectedMonth,
		selectedDate,
		setSelectedDate,
		stats,
		weeklyActivityMap,
		ordersByDate,
		calendarDates,
		calendarMonthHeader,
		calendarGridStart,
		isLoading,
		hasError,
		refetchAll,
	} = dashboard;

	// Show error message if there's an error and we're not loading
	if (hasError && !isLoading && !stats) {
		return (
			<div
				className={`p-6 rounded-lg ${
					theme === "dark"
						? "bg-gray-800 border border-gray-700"
						: "bg-white border border-gray-200"
				}`}
			>
				<div
					className={`p-8 text-center border-2 rounded-lg ${
						theme === "dark"
							? "border-red-500 bg-gray-800"
							: "border-red-500 bg-white"
					}`}
				>
					<h2
						className={`text-xl font-semibold mb-4 ${
							theme === "dark" ? "text-red-400" : "text-red-600"
						}`}
					>
						Error Loading Dashboard
					</h2>
					<p
						className={`text-base mb-6 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}
					>
						{isClerk && !user?.branch_id
							? "You are not assigned to a branch. Please contact your manager."
							: "Failed to load dashboard data. Please try again."}
					</p>
					<button
						onClick={() => refetchAll()}
						className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-black rounded-lg font-semibold text-sm transition-colors"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3 h-full p-0 relative">
			<div
				className={`flex flex-col gap-3 transition-all ${
					isOrdersPanelOpen ? "lg:mr-[310px]" : ""
				}`}
			>
				<DashboardHeader
					selectedDate={selectedMonth}
					onDateChange={setSelectedMonth}
					onTodayClick={() => {
						const today = new Date();
						const month = `${today.getFullYear()}-${String(
							today.getMonth() + 1
						).padStart(2, "0")}`;
						setSelectedMonth(month);
					}}
				/>

				{/* Stats Grid */}
				{isClerk && clerkDashboard && (
					<ClerkStatsGrid stats={clerkDashboard.stats} isLoading={isLoading} />
				)}
				{isManager && (managerOverview || managerBranch) && (
					<ManagerStatsGrid
						stats={(managerOverview || managerBranch)!.stats}
						isLoading={isLoading}
						isBranchView={!!selectedBranch}
					/>
				)}

				{/* Category Analytics */}
				{isClerk && clerkDashboard && (
					<ClerkCategoryAnalytics
						categoryAnalytics={clerkDashboard.categoryAnalytics}
						isLoading={isLoading}
					/>
				)}
				{isManager && (managerOverview || managerBranch) && (
					<ManagerCategoryAnalytics
						categoryAnalytics={
							(managerOverview || managerBranch)!.categoryAnalytics
						}
						isLoading={isLoading}
						showBranchBreakdown={!!managerOverview}
					/>
				)}

				{/* Charts and Calendar */}
				<div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3">
					<StatusChart chartData={chartData} />

					<ActivityCalendar
						calendarDates={calendarDates}
						calendarMonthHeader={calendarMonthHeader}
						calendarGridStart={calendarGridStart}
						monthlyCountMap={weeklyActivityMap}
						selectedDate={selectedDate || ""}
						calendarOffset={0}
						onDateSelect={(date: string) => {
							// Set the selected date
							setSelectedDate(date);
							// Open the orders panel
							setIsOrdersPanelOpen(true);
							// Also update the month if needed
							const dateObj = new Date(date);
							const month = `${dateObj.getFullYear()}-${String(
								dateObj.getMonth() + 1
							).padStart(2, "0")}`;
							setSelectedMonth(month);
						}}
						onCalendarOffsetChange={() => {}}
						onTodayClick={() => {
							const today = new Date();
							const month = `${today.getFullYear()}-${String(
								today.getMonth() + 1
							).padStart(2, "0")}`;
							setSelectedMonth(month);
							setSelectedDate(today.toISOString().split("T")[0]);
							setIsOrdersPanelOpen(true);
						}}
					/>
				</div>
			</div>

			{/* Orders Panel */}
			<OrdersPanel
				orders={ordersByDate || []}
				selectedDate={selectedDate || ""}
				isLoading={isLoading}
				isOpen={isOrdersPanelOpen}
				onClose={() => {
					setIsOrdersPanelOpen(false);
					setSelectedDate(null);
				}}
			/>
		</div>
	);
}
