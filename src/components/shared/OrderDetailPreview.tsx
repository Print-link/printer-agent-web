import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../stores/authStore';
import { useBranchStore } from '../../stores/branchStore';
import { useToast } from "../../contexts/ToastContext";
import { apiService } from "../../services/api";
import { FilePreviewDrawer } from "./FilePreviewDrawer";
import {
	OrderDetailHeader,
	OrderInfoCard,
	ClientInfoCard,
	OrderItemsList,
	CompleteOrderModal,
} from "./order-detail";
import { formatOrderDate, downloadFile } from "./utils/orderUtils";
import type { ClerkOrder } from "../../types";

interface OrderDetailPreviewProps {
	order: ClerkOrder;
	branchId?: string;
	onClose: () => void;
	onOrderUpdate?: () => void;
}

/**
 * OrderDetailPreview - Displays detailed order information with file preview capability
 * Works for both clerk and manager roles - no role restrictions on file preview
 * Files can be previewed by clicking on file thumbnails, which opens the FilePreviewDrawer
 */
export default function OrderDetailPreview({
	order,
	branchId: propBranchId,
	onClose,
	onOrderUpdate,
}: OrderDetailPreviewProps) {
	const { theme } = useTheme();
	const { user } = useAuthStore();
	const { selectedBranch } = useBranchStore();
	const { success, error: showError } = useToast();
	const queryClient = useQueryClient();
	const [selectedFileIndex, setSelectedFileIndex] = useState<{
		itemIndex: number;
		fileIndex: number;
	} | null>(null);
	const [showCompleteModal, setShowCompleteModal] = useState(false);

	// Determine branchId: use prop if provided, otherwise determine based on role
	// For managers use selectedBranch, for clerks use user.branch_id
	const branchId =
		propBranchId ||
		(user?.role === "manager" ? selectedBranch?.id : user?.branch_id);

	const { data: orderDetail, isLoading } = useQuery({
		queryKey: ["orderDetail", order.id, branchId],
		queryFn: async () => {
			// Pass branchId for managers to ensure proper data fetching
			const data = await apiService.getBranchOrderDetail(order.id, branchId);
			// Debug: Log the order detail to see the structure
			console.log("Order Detail Response:", data);
			if (data?.items) {
				data.items.forEach((item, index: number) => {
					console.log(`Item ${index} options:`, item.options);
					console.log(`Item ${index} files:`, item.options?.files);
				});
			}
			return data;
		},
		enabled: !!order.id,
	});

	// Mutation for updating to COMPLETED status
	const updateOrderMutation = useMutation({
		mutationFn: (status: "COMPLETED") => {
			return apiService.updateBranchOrder(order.id, { status });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["orderDetail", order.id, branchId],
			});
			queryClient.invalidateQueries({ queryKey: ["branchOrders", branchId] });
			setShowCompleteModal(false);
			// Refresh the page data
			queryClient.refetchQueries({ queryKey: ["branchOrders", branchId] });
			queryClient.refetchQueries({
				queryKey: ["orderDetail", order.id, branchId],
			});
			// Show success toast
			success(
				`Order ${order.orderNumber} has been marked as completed`,
				"Order Completed",
				4000
			);
			if (onOrderUpdate) onOrderUpdate();
		},
		onError: (error: unknown) => {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to mark order as completed";
			showError(errorMessage, "Update Failed", 5000);
		},
	});

	// Mutation for updating to RECEIVED status with estimated completion time
	const markAsReceivedMutation = useMutation({
		mutationFn: (estimatedCompletionTime: Date) => {
			return apiService.updateBranchOrder(order.id, {
				status: "RECEIVED",
				estimatedCompletionTime: estimatedCompletionTime.toISOString(),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["orderDetail", order.id, branchId],
			});
			queryClient.invalidateQueries({ queryKey: ["branchOrders", branchId] });
			// Refresh the page data
			queryClient.refetchQueries({ queryKey: ["branchOrders", branchId] });
			queryClient.refetchQueries({
				queryKey: ["orderDetail", order.id, branchId],
			});
			// Show success toast
			success(
				`Order ${order.orderNumber} has been marked as received`,
				"Order Received",
				4000
			);
			if (onOrderUpdate) onOrderUpdate();
		},
		onError: (error: unknown) => {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to mark order as received";
			showError(errorMessage, "Update Failed", 5000);
		},
	});

	const handleMarkAsCompleted = () => {
		if (order.status === "COMPLETED") {
			return;
		}
		setShowCompleteModal(true);
	};

	const confirmMarkAsCompleted = () => {
		updateOrderMutation.mutate("COMPLETED");
	};

	const handleMarkAsReceived = (estimatedTime: Date) => {
		markAsReceivedMutation.mutate(estimatedTime);
	};

	const handleDownloadFile = async (fileUrl: string, fileName: string) => {
		try {
			await downloadFile(fileUrl, fileName);
			success(`Downloaded ${fileName}`, "Download Successful", 3000);
		} catch {
			showError("Failed to download file", "Download Failed", 4000);
		}
	};

	const handleFileSelect = (
		itemIndex: number | null,
		fileIndex: number | null
	) => {
		if (itemIndex === null || fileIndex === null) {
			setSelectedFileIndex(null);
		} else {
			setSelectedFileIndex({ itemIndex, fileIndex });
		}
	};

	const formattedDate = formatOrderDate(order.createdAt);

	return (
		<div
			className={`h-full flex flex-col ${
				theme === "dark" ? "bg-gray-800" : "bg-white"
			}`}
		>
			<OrderDetailHeader formattedDate={formattedDate} onClose={onClose} />

			{/* Content */}
			<div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 sm:space-y-6">
				{isLoading ? (
					<div className="flex items-center justify-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
					</div>
				) : (
					<>
						<OrderInfoCard
							order={orderDetail || order}
							isUpdating={updateOrderMutation.isPending || markAsReceivedMutation.isPending}
							onMarkAsComplete={handleMarkAsCompleted}
							onMarkAsReceived={handleMarkAsReceived}
						/>

						<ClientInfoCard client={order.client} />

						{orderDetail && (
							<OrderItemsList
								orderDetail={orderDetail}
								selectedFileIndex={selectedFileIndex}
								onFileSelect={handleFileSelect}
								onFileDownload={handleDownloadFile}
							/>
						)}
					</>
				)}
			</div>

			{/* File Preview Drawer */}
			<FilePreviewDrawer
				isOpen={selectedFileIndex !== null}
				onClose={() => setSelectedFileIndex(null)}
				orderDetail={orderDetail || null}
				selectedFileIndex={selectedFileIndex}
				onFileChange={(itemIndex, fileIndex) =>
					setSelectedFileIndex({ itemIndex, fileIndex })
				}
			/>

			{/* Complete Order Modal */}
			<CompleteOrderModal
				order={order}
				isOpen={showCompleteModal}
				isPending={updateOrderMutation.isPending}
				onClose={() => setShowCompleteModal(false)}
				onConfirm={confirmMarkAsCompleted}
			/>
		</div>
	);
}
