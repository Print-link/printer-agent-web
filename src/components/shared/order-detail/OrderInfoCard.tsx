import { CheckCircle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { getStatusColor } from '../utils/orderUtils';
import type { ClerkOrder } from '../../../types';

interface OrderInfoCardProps {
	order: ClerkOrder;
	isUpdating: boolean;
	onMarkAsComplete: () => void;
}

export function OrderInfoCard({ order, isUpdating, onMarkAsComplete }: OrderInfoCardProps) {
	const { theme } = useTheme();

	return (
		<div
			className={`p-3 sm:p-4 rounded-lg ${
				theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
			}`}
		>
			<div className="flex items-center justify-between mb-3 flex-wrap gap-2">
				<div>
					<p
						className={`text-sm font-medium mb-1 ${
							theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
						}`}
					>
						Order Number
					</p>
					<p
						className={`text-lg font-bold ${
							theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
						}`}
					>
						{order.orderNumber}
					</p>
				</div>
				<span
					className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
						order.status,
						theme
					)}`}
				>
					{order.status}
				</span>
			</div>
			<div className="flex items-center justify-between">
				<div>
					<p
						className={`text-sm font-medium mb-1 ${
							theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
						}`}
					>
						Total Price
					</p>
					<p
						className={`text-xl font-bold ${
							theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
						}`}
					>
						₵{order.totalPrice.toFixed(2)}
					</p>
				</div>
				{order.status !== 'COMPLETED' && (
					<button
						onClick={onMarkAsComplete}
						disabled={isUpdating}
						className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<CheckCircle size={16} />
						{isUpdating ? 'Updating...' : 'Mark as Completed'}
					</button>
				)}
			</div>
		</div>
	);
}

