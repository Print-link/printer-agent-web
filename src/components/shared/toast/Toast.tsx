import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import type { Toast as ToastType } from '../../../contexts/ToastContext';

interface ToastProps {
	toast: ToastType;
	onClose: () => void;
}

export function Toast({ toast, onClose }: ToastProps) {
	const { theme } = useTheme();

	useEffect(() => {
		if (toast.duration && toast.duration > 0) {
			const timer = setTimeout(() => {
				onClose();
			}, toast.duration);

			return () => clearTimeout(timer);
		}
	}, [toast.duration, onClose]);

	const getIcon = () => {
		switch (toast.type) {
			case 'success':
				return <CheckCircle size={20} className="text-green-500" />;
			case 'error':
				return <AlertCircle size={20} className="text-red-500" />;
			case 'warning':
				return <AlertTriangle size={20} className="text-yellow-500" />;
			case 'info':
				return <Info size={20} className="text-blue-500" />;
			default:
				return <Info size={20} className="text-gray-500" />;
		}
	};

	const getStyles = () => {
		const baseStyles = 'flex items-start gap-3 p-4 rounded-lg shadow-lg border min-w-[320px] max-w-md transition-all duration-300';
		
		switch (toast.type) {
			case 'success':
				return theme === 'dark'
					? `${baseStyles} bg-green-900/20 border-green-800/50 text-green-100`
					: `${baseStyles} bg-green-50 border-green-200 text-green-800`;
			case 'error':
				return theme === 'dark'
					? `${baseStyles} bg-red-900/20 border-red-800/50 text-red-100`
					: `${baseStyles} bg-red-50 border-red-200 text-red-800`;
			case 'warning':
				return theme === 'dark'
					? `${baseStyles} bg-yellow-900/20 border-yellow-800/50 text-yellow-100`
					: `${baseStyles} bg-yellow-50 border-yellow-200 text-yellow-800`;
			case 'info':
				return theme === 'dark'
					? `${baseStyles} bg-blue-900/20 border-blue-800/50 text-blue-100`
					: `${baseStyles} bg-blue-50 border-blue-200 text-blue-800`;
			default:
				return theme === 'dark'
					? `${baseStyles} bg-gray-800 border-gray-700 text-gray-100`
					: `${baseStyles} bg-white border-gray-200 text-gray-900`;
		}
	};

	return (
		<div className={getStyles()}>
			<div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
			<div className="flex-1 min-w-0">
				{toast.title && (
					<h4 className={`font-semibold text-sm mb-1 ${
						theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
					}`}>
						{toast.title}
					</h4>
				)}
				<p className={`text-sm ${
					theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
				}`}>
					{toast.message}
				</p>
			</div>
			<button
				onClick={onClose}
				className={`flex-shrink-0 p-1 rounded-md transition-colors ${
					theme === 'dark'
						? 'hover:bg-gray-700/50 text-gray-400'
						: 'hover:bg-gray-100 text-gray-500'
				}`}
			>
				<X size={16} />
			</button>
		</div>
	);
}

