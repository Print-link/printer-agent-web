import { PieChart } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import type { CategoryAnalytics } from '../../../../types';

interface ManagerCategoryAnalyticsProps {
  categoryAnalytics: CategoryAnalytics[];
  isLoading?: boolean;
  showBranchBreakdown?: boolean;
}

export function ManagerCategoryAnalytics({
	categoryAnalytics,
	isLoading,
}: ManagerCategoryAnalyticsProps) {
	const { theme } = useTheme();

	if (isLoading && (!categoryAnalytics || categoryAnalytics.length === 0)) {
		return (
			<div
				className={`p-3 rounded-md border text-center ${
					theme === "dark"
						? "bg-gray-800 border-gray-700"
						: "bg-white border-gray-200"
				}`}
			>
				<p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
					Loading category analytics...
				</p>
			</div>
		);
	}

	if (!categoryAnalytics || categoryAnalytics.length === 0) {
		return (
			<div
				className={`p-3 rounded-md border text-center ${
					theme === "dark"
						? "bg-gray-800 border-gray-700"
						: "bg-white border-gray-200"
				}`}
			>
				<p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
					No category data available
				</p>
			</div>
		);
	}

	return (
		<div
			className={`p-3 sm:p-4 md:p-6 rounded-md border ${
				theme === "dark"
					? "bg-gray-800 border-gray-700"
					: "bg-white border-gray-200"
			}`}
		>
			<h2
				className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2.5 m-0 ${
					theme === "dark" ? "text-gray-100" : "text-gray-900"
				}`}
			>
				<PieChart size={20} className="text-amber-400 flex-shrink-0" />
				<span className="truncate">Category Performance</span>
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{categoryAnalytics.map((cat) => (
					<div
						key={cat.categoryId}
						className={`p-4 rounded-lg border ${
							theme === "dark"
								? "bg-gray-800 border-gray-700"
								: "bg-white border-gray-200"
						}`}
					>
						<div className="flex gap-2 sm:gap-3 mb-3">
							{cat.categoryImageUrl && (
								<img
									src={cat.categoryImageUrl}
									alt={cat.categoryName}
									className="w-12 h-12 sm:w-[60px] sm:h-[60px] object-cover rounded flex-shrink-0"
								/>
							)}
							<div className="flex-1 min-w-0">
								<h3
									className={`font-semibold mb-1 sm:mb-2 text-sm sm:text-base leading-tight truncate ${
										theme === "dark" ? "text-gray-100" : "text-gray-900"
									}`}
								>
									{cat.categoryName}
								</h3>
								<div
									className={`text-lg sm:text-xl font-bold mb-1 ${
										theme === "dark" ? "text-gray-100" : "text-gray-900"
									}`}
								>
									{cat.totalOrders.toLocaleString()} Orders
								</div>
								{cat.totalRevenue !== undefined && (
									<div className="text-sm sm:text-base font-semibold text-green-500">
										₵
										{cat.totalRevenue.toLocaleString("en-US", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</div>
								)}
							</div>
						</div>
						<div
							className={`grid grid-cols-2 gap-2 sm:gap-3 pt-3 border-t ${
								theme === "dark" ? "border-gray-600" : "border-gray-200"
							}`}
						>
							<div>
								<div
									className={`text-[10px] sm:text-[11px] mb-0.5 sm:mb-1 font-medium ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}
								>
									Completed
								</div>
								<div className="text-sm sm:text-base font-semibold text-green-500">
									{cat.completedOrders}
								</div>
							</div>
							<div>
								<div
									className={`text-[10px] sm:text-[11px] mb-0.5 sm:mb-1 font-medium ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}
								>
									Pending
								</div>
								<div className="text-sm sm:text-base font-semibold text-yellow-500">
									{cat.pendingOrders}
								</div>
							</div>
							<div>
								<div
									className={`text-[10px] sm:text-[11px] mb-0.5 sm:mb-1 font-medium ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}
								>
									Quoted
								</div>
								<div className="text-sm sm:text-base font-semibold text-amber-400">
									{cat.quotedOrders}
								</div>
							</div>
							<div>
								<div
									className={`text-[10px] sm:text-[11px] mb-0.5 sm:mb-1 font-medium ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}
								>
									Paid
								</div>
								<div className="text-sm sm:text-base font-semibold text-green-500">
									{cat.paidOrders}
								</div>
							</div>
							<div>
								<div
									className={`text-[10px] sm:text-[11px] mb-0.5 sm:mb-1 font-medium ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}
								>
									In Progress
								</div>
								<div className="text-sm sm:text-base font-semibold text-amber-400">
									{cat.inProgressOrders}
								</div>
							</div>
							{cat.paidRevenue !== undefined && (
								<div>
									<div
										className={`text-[10px] sm:text-[11px] mb-0.5 sm:mb-1 font-medium ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}
									>
										Paid Revenue
									</div>
									<div className="text-xs sm:text-sm font-semibold text-green-500">
										₵
										{cat.paidRevenue.toLocaleString("en-US", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</div>
								</div>
							)}
						</div>
						{cat.orderItemsCount > 0 && (
							<div
								className={`mt-3 pt-3 border-t text-xs ${
									theme === "dark"
										? "text-gray-400 border-gray-600"
										: "text-gray-600 border-gray-200"
								}`}
							>
								<strong
									className={
										theme === "dark" ? "text-gray-100" : "text-gray-900"
									}
								>
									Order Items:
								</strong>{" "}
								{cat.orderItemsCount.toLocaleString()}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

