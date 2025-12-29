import { useState } from 'react';
import { CheckCircle, Clock, Package } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { getStatusColor } from '../utils/orderUtils';
import type { ClerkOrder } from '../../../types';

interface OrderInfoCardProps {
	order: ClerkOrder;
	isUpdating: boolean;
	onMarkAsComplete: () => void;
	onMarkAsReceived?: (estimatedTime: Date) => void;
}

// Time options for estimated completion
const TIME_OPTIONS = [
	{ label: '15 minutes', minutes: 15 },
	{ label: '30 minutes', minutes: 30 },
	{ label: '45 minutes', minutes: 45 },
	{ label: '1 hour', minutes: 60 },
	{ label: '1.5 hours', minutes: 90 },
	{ label: '2 hours', minutes: 120 },
	{ label: '3 hours', minutes: 180 },
	{ label: '4 hours', minutes: 240 },
	{ label: 'Tomorrow', minutes: 1440 },
];

export function OrderInfoCard({ order, isUpdating, onMarkAsComplete, onMarkAsReceived }: OrderInfoCardProps) {
	const { theme } = useTheme();
	const [showTimeDropdown, setShowTimeDropdown] = useState(false);
	const [selectedTime, setSelectedTime] = useState<number | null>(null);

	const canMarkAsReceived = order.status === 'PAID' || order.status === 'PENDING';
	const canMarkAsCompleted = order.status === 'RECEIVED' || order.status === 'IN_PROGRESS';

	const handleMarkAsReceivedClick = () => {
		setShowTimeDropdown(true);
	};

	const handleTimeSelect = (minutes: number) => {
		setSelectedTime(minutes);
	};

	const handleConfirmReceived = () => {
		if (selectedTime && onMarkAsReceived) {
			const estimatedTime = new Date();
			estimatedTime.setMinutes(estimatedTime.getMinutes() + selectedTime);
			onMarkAsReceived(estimatedTime);
			setShowTimeDropdown(false);
			setSelectedTime(null);
		}
	};

	const handleCancelTimeSelection = () => {
		setShowTimeDropdown(false);
		setSelectedTime(null);
	};

	// Format estimated completion time if present
	const formattedEstimatedTime = order.estimatedCompletionTime
		? new Date(order.estimatedCompletionTime).toLocaleString('en-US', {
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
		  })
		: null;

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

			{/* Show estimated completion time if order is received */}
			{order.status === 'RECEIVED' && formattedEstimatedTime && (
				<div
					className={`mb-3 p-2 rounded-md flex items-center gap-2 ${
						theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700'
					}`}
				>
					<Clock size={16} />
					<span className="text-sm">
						Estimated completion: <strong>{formattedEstimatedTime}</strong>
					</span>
				</div>
			)}

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

				{/* Time Selection Dropdown */}
				{showTimeDropdown && (
					<div
						className={`flex flex-col gap-2 p-3 rounded-lg border ${
							theme === 'dark'
								? 'bg-gray-800 border-gray-600'
								: 'bg-white border-gray-200'
						}`}
					>
						<p
							className={`text-sm font-medium ${
								theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
							}`}
						>
							Estimated Completion Time:
						</p>
						<select
							value={selectedTime || ''}
							onChange={(e) => handleTimeSelect(Number(e.target.value))}
							className={`px-3 py-2 rounded-md text-sm border ${
								theme === 'dark'
									? 'bg-gray-700 border-gray-600 text-gray-200'
									: 'bg-white border-gray-300 text-gray-900'
							}`}
						>
							<option value="">Select time...</option>
							{TIME_OPTIONS.map((option) => (
								<option key={option.minutes} value={option.minutes}>
									{option.label}
								</option>
							))}
						</select>
						<div className="flex gap-2 mt-1">
							<button
								onClick={handleCancelTimeSelection}
								disabled={isUpdating}
								className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
									theme === 'dark'
										? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
										: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
								}`}
							>
								Cancel
							</button>
							<button
								onClick={handleConfirmReceived}
								disabled={!selectedTime || isUpdating}
								className="flex-1 px-3 py-1.5 rounded-md text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
							>
								{isUpdating ? (
									<>
										<div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
										Updating...
									</>
								) : (
									<>
										<Package size={14} />
										Confirm
									</>
								)}
							</button>
						</div>
					</div>
				)}

				{/* Mark as Received Button (for PAID/PENDING orders) */}
				{canMarkAsReceived && !showTimeDropdown && (
					<button
						onClick={handleMarkAsReceivedClick}
						disabled={isUpdating}
						className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<Package size={16} />
						{isUpdating ? 'Updating...' : 'Mark as Received'}
					</button>
				)}

				{/* Mark as Completed Button (for RECEIVED/IN_PROGRESS orders) */}
				{canMarkAsCompleted && !showTimeDropdown && (
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
