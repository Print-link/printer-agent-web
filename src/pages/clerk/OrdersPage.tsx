import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { useBranchStore } from '../../stores/branchStore';
import { useTheme } from '../../contexts/ThemeContext';
import { apiService } from '../../services/api';
import { Search, RefreshCw } from "lucide-react";
import OrderDetailPreview from "../../components/shared/OrderDetailPreview";
import type { ClerkOrder, OrderStatus } from "../../types";

export default function OrdersPage() {
	const { user } = useAuthStore();
	const { selectedBranch } = useBranchStore();
	const { theme } = useTheme();
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
	const [selectedOrder, setSelectedOrder] = useState<ClerkOrder | null>(null);

	// Determine which branch_id to use
	// Clerks use their own branch_id from login, managers use selected branch
	const branchId = user?.role === "clerk" ? user.branch_id : selectedBranch?.id;
	const queryClient = useQueryClient();

	// Use getBranchOrders API (same as agent app)
	const {
		data: orders = [],
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["branchOrders", branchId],
		queryFn: async () => {
			if (!branchId) {
				throw new Error(
					user?.role === "clerk"
						? "No branch assigned to this clerk"
						: "No branch selected"
				);
			}
			return await apiService.getBranchOrders(branchId);
		},
		enabled: !!branchId,
		staleTime: 30000, // 30 seconds
		refetchInterval: 60000, // Refetch every minute
	});

	const filteredOrders = useMemo(() => {
		let filtered = [...orders];

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(order) =>
					order.client.fullName?.toLowerCase().includes(query) ||
					order.client.email?.toLowerCase().includes(query) ||
					order.client.phoneNumber?.toLowerCase().includes(query) ||
					order.id?.toLowerCase().includes(query)
			);
		}

		if (statusFilter !== "all") {
			filtered = filtered.filter((order) => order.status === statusFilter);
		}

		return filtered;
	}, [orders, searchQuery, statusFilter]);

	if (!selectedBranch && user?.role === "manager") {
		return (
			<div
				className={`p-6 rounded-lg ${
					theme === "dark"
						? "bg-gray-800 border border-gray-700"
						: "bg-white border border-gray-200"
				}`}
			>
				<p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
					Please select a branch to view orders
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full overflow-hidden">
			{/* Header */}
			<div className="flex-shrink-0 mb-2">
				<div className="flex items-center justify-between mb-2 flex-wrap gap-2">
					<h2
						className={`text-lg sm:text-xl font-bold ${
							theme === "dark" ? "text-gray-100" : "text-gray-900"
						}`}
					>
						Orders ({filteredOrders.length})
					</h2>
					<button
						onClick={() => refetch()}
						className={`p-2 rounded-md ${
							theme === "dark"
								? "bg-gray-700 hover:bg-gray-600 text-gray-300"
								: "bg-gray-100 hover:bg-gray-200 text-gray-600"
						}`}
					>
						<RefreshCw size={20} />
					</button>
				</div>

				{/* Filters */}
				<div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
					<div className="relative flex-1">
						<Search
							className={`absolute left-3 top-1/2 -translate-y-1/2 ${
								theme === "dark" ? "text-gray-400" : "text-gray-500"
							}`}
							size={20}
						/>
						<input
							type="text"
							placeholder="Search orders..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className={`w-full pl-10 pr-4 py-2 rounded-md border text-sm ${
								theme === "dark"
									? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
									: "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
							} focus:outline-none focus:ring-2 focus:ring-amber-400`}
						/>
					</div>
					<select
						value={statusFilter}
						onChange={(e) =>
							setStatusFilter(e.target.value as OrderStatus | "all")
						}
						className={`px-3 sm:px-4 py-2 rounded-md border text-sm ${
							theme === "dark"
								? "bg-gray-700 border-gray-600 text-gray-100"
								: "bg-white border-gray-300 text-gray-900"
						} focus:outline-none focus:ring-2 focus:ring-amber-400`}
					>
						<option value="all">All Statuses</option>
						<option value="PENDING">Pending</option>
						<option value="QUOTED">Quoted</option>
						<option value="PAID">Paid</option>
						<option value="IN_PROGRESS">In Progress</option>
						<option value="COMPLETED">Completed</option>
					</select>
				</div>
			</div>

			{/* Main Content - Split View */}
			<div className="flex flex-1 overflow-hidden gap-0 min-h-0 flex-col lg:flex-row">
				{/* Orders List */}
				<div
					className={`${
						selectedOrder
							? "w-full lg:w-[380px] xl:w-[420px] lg:max-w-[420px] lg:min-w-[380px]"
							: "w-full max-w-full lg:max-w-[600px]"
					} flex flex-col overflow-hidden transition-all duration-300 ${
						selectedOrder
							? `border-b lg:border-b-0 lg:border-r ${
									theme === "dark" ? "border-gray-700" : "border-gray-200"
							  }`
							: ""
					}`}
				>
					<div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 max-h-[40vh] lg:max-h-none">
						{isLoading ? (
							<div className="flex items-center justify-center h-64">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
							</div>
						) : filteredOrders.length === 0 ? (
							<div
								className={`p-6 rounded-lg text-center ${
									theme === "dark"
										? "bg-gray-800 border border-gray-700"
										: "bg-white border border-gray-200"
								}`}
							>
								<p
									className={
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}
								>
									No orders found
								</p>
							</div>
						) : (
							<div className="space-y-2">
								{filteredOrders.map((order) => (
									<div
										key={order.id}
										onClick={() =>
											setSelectedOrder(
												selectedOrder?.id === order.id ? null : order
											)
										}
										className={`p-3 rounded-lg cursor-pointer transition-all ${
											selectedOrder?.id === order.id
												? "ring-2 ring-amber-400 bg-amber-50 dark:bg-amber-900/20"
												: theme === "dark"
												? "bg-gray-800 border border-gray-700 hover:border-gray-600"
												: "bg-white border border-gray-200 hover:border-gray-300"
										}`}
									>
										<div className="flex items-center justify-between mb-1.5">
											<span
												className={`text-xs font-semibold ${
													theme === "dark" ? "text-gray-100" : "text-gray-900"
												}`}
											>
												{order.orderNumber}
											</span>
											<span
												className={`px-1.5 py-0.5 text-[10px] rounded-full ${
													order.status === "COMPLETED"
														? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
														: order.status === "PENDING"
														? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
														: order.status === "QUOTED"
														? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
														: order.status === "PAID"
														? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
														: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
												}`}
											>
												{order.status}
											</span>
										</div>
										<p
											className={`text-xs mb-1 ${
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}`}
										>
											{order.client.fullName}
										</p>
										<div className="flex items-center justify-between">
											<p
												className={`text-base font-bold ${
													theme === "dark" ? "text-gray-100" : "text-gray-900"
												}`}
											>
												₵{order.totalPrice.toFixed(2)}
											</p>
											<p
												className={`text-[10px] ${
													theme === "dark" ? "text-gray-500" : "text-gray-500"
												}`}
											>
												{order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
											</p>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Preview Panel */}
				{selectedOrder && (
					<div className="flex-1 flex flex-col overflow-hidden min-w-0 w-full lg:w-auto">
						<OrderDetailPreview
							order={selectedOrder}
							branchId={branchId}
							onClose={() => setSelectedOrder(null)}
							onOrderUpdate={() => {
								queryClient.invalidateQueries({ queryKey: ["branchOrders"] });
								queryClient.invalidateQueries({
									queryKey: ["orderDetail", selectedOrder.id],
								});
								refetch();
							}}
						/>
					</div>
				)}

				{/* Empty State when no order selected */}
				{!selectedOrder && (
					<div
						className={`flex-1 flex items-center justify-center ${
							theme === "dark" ? "bg-gray-800" : "bg-gray-50"
						}`}
					>
						<div className="text-center p-6">
							<p
								className={`text-lg font-medium mb-2 ${
									theme === "dark" ? "text-gray-300" : "text-gray-700"
								}`}
							>
								Select an order to view details
							</p>
							<p
								className={`text-sm ${
									theme === "dark" ? "text-gray-500" : "text-gray-500"
								}`}
							>
								Click on any order from the list to see its details and files
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

