import { useTheme } from '../../../contexts/ThemeContext';
import { OrderItemCard } from './OrderItemCard';
import type { ClerkOrderDetail } from '../../../types';

interface OrderItemsListProps {
	orderDetail: ClerkOrderDetail;
	selectedFileIndex: { itemIndex: number; fileIndex: number } | null;
	onFileSelect: (itemIndex: number | null, fileIndex: number | null) => void;
	onFileDownload: (fileUrl: string, fileName: string) => void;
}

export function OrderItemsList({
	orderDetail,
	selectedFileIndex,
	onFileSelect,
	onFileDownload,
}: OrderItemsListProps) {
	const { theme } = useTheme();

	if (!orderDetail?.items || orderDetail.items.length === 0) {
		return null;
	}

	return (
		<div
			className={`p-3 sm:p-4 rounded-lg ${
				theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
			}`}
		>
			<h3
				className={`text-base sm:text-lg font-semibold mb-3 ${
					theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
				}`}
			>
				Order Items ({orderDetail.items.length})
			</h3>
			<div className="space-y-3">
				{orderDetail.items.map((item, itemIndex) => (
					<OrderItemCard
						key={item.id}
						item={item}
						itemIndex={itemIndex}
						selectedFileIndex={selectedFileIndex}
						onFileSelect={onFileSelect}
						onFileDownload={onFileDownload}
					/>
				))}
			</div>
		</div>
	);
}

