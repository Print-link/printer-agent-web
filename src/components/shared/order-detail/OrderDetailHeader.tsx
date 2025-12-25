import { X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface OrderDetailHeaderProps {
	formattedDate: string;
	onClose: () => void;
}

export function OrderDetailHeader({ formattedDate, onClose }: OrderDetailHeaderProps) {
	const { theme } = useTheme();

	return (
		<div
			className={`flex items-center justify-between p-3 sm:p-4 border-b flex-shrink-0 ${
				theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
			}`}
		>
			<div className="flex-1 min-w-0">
				<h2
					className={`text-base sm:text-lg font-semibold mb-1 ${
						theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
					}`}
				>
					Order Details
				</h2>
				<p
					className={`text-xs truncate ${
						theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
					}`}
				>
					{formattedDate}
				</p>
			</div>
			<button
				onClick={onClose}
				className={`p-2 rounded-md flex-shrink-0 ml-2 ${
					theme === 'dark'
						? 'hover:bg-gray-700 text-gray-400'
						: 'hover:bg-gray-100 text-gray-600'
				}`}
			>
				<X size={20} />
			</button>
		</div>
	);
}

