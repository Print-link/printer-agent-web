import { CheckCircle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import type { ClerkOrder } from '../../../types';

interface CompleteOrderModalProps {
	order: ClerkOrder;
	isOpen: boolean;
	isPending: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export function CompleteOrderModal({
	order,
	isOpen,
	isPending,
	onClose,
	onConfirm,
}: CompleteOrderModalProps) {
	const { theme } = useTheme();

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
			onClick={() => !isPending && onClose()}
		>
			<div
				className={`w-full max-w-md mx-4 rounded-lg shadow-xl ${
					theme === 'dark' ? 'bg-gray-800' : 'bg-white'
				}`}
				onClick={(e) => e.stopPropagation()}
			>
				<div
					className={`p-6 border-b ${
						theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
					}`}
				>
					<div className="flex items-center gap-3 mb-2">
						<div
							className={`p-2 rounded-full ${
								theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'
							}`}
						>
							<CheckCircle className="text-green-500" size={24} />
						</div>
						<h3
							className={`text-lg font-semibold ${
								theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
							}`}
						>
							Mark Order as Complete
						</h3>
					</div>
					<p
						className={`text-sm ${
							theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
						}`}
					>
						Are you sure you want to mark order <strong>{order.orderNumber}</strong> as
						completed?
					</p>
				</div>
				<div
					className={`p-6 flex gap-3 justify-end ${
						theme === 'dark' ? 'bg-gray-800' : 'bg-white'
					}`}
				>
					<button
						onClick={onClose}
						disabled={isPending}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
							theme === 'dark'
								? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
								: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
						}`}
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						disabled={isPending}
						className="px-4 py-2 rounded-md text-sm font-medium bg-green-500 hover:bg-green-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
					>
						{isPending ? (
							<>
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
								Completing...
							</>
						) : (
							<>
								<CheckCircle size={16} />
								Mark as Complete
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}

