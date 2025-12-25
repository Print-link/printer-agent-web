import { FileText } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { FileThumbnail } from './FileThumbnail';
import type { ClerkOrderDetail } from '../../../types';

interface OrderItemCardProps {
	item: ClerkOrderDetail['items'][0];
	itemIndex: number;
	selectedFileIndex: { itemIndex: number; fileIndex: number } | null;
	onFileSelect: (itemIndex: number | null, fileIndex: number | null) => void;
	onFileDownload: (fileUrl: string, fileName: string) => void;
}

export function OrderItemCard({
	item,
	itemIndex,
	selectedFileIndex,
	onFileSelect,
	onFileDownload,
}: OrderItemCardProps) {
	const { theme } = useTheme();

	// Parse options if it's a string
	let parsedOptions = item.options;
	if (typeof item.options === 'string') {
		try {
			parsedOptions = JSON.parse(item.options);
		} catch (e) {
			console.error('Error parsing options:', e);
			parsedOptions = {};
		}
	}

	// Ensure options has files array
	const files = parsedOptions?.files || [];
	const hasFiles = Array.isArray(files) && files.length > 0;

	return (
		<div
			className={`p-3 sm:p-4 rounded-lg border ${
				theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
			}`}
		>
			<div className="flex items-start justify-between mb-2 flex-wrap gap-2">
				<div className="flex-1 min-w-0">
					<h4
						className={`text-sm sm:text-base font-semibold mb-1 ${
							theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
						}`}
					>
						{item.serviceName}
					</h4>
					<p
						className={`text-xs sm:text-sm ${
							theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
						}`}
					>
						{item.category.name} • {item.subCategory.name}
					</p>
				</div>
				<span
					className={`text-sm sm:text-base font-bold whitespace-nowrap ${
						theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
					}`}
				>
					₵{item.calculatedPrice.toFixed(2)}
				</span>
			</div>

			<div
				className={`grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2 text-xs sm:text-sm ${
					theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
				}`}
			>
				<div className="truncate">
					Size: {item.width} × {item.height} {item.measurementUnit}
				</div>
				<div>Quantity: {item.quantity}</div>
				<div>Color: {parsedOptions?.color ? 'Yes' : 'No'}</div>
				<div>Front/Back: {parsedOptions?.frontBack ? 'Yes' : 'No'}</div>
			</div>

			{/* Files */}
			{hasFiles && (
				<div
					className={`mt-2 pt-2 border-t ${
						theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
					}`}
				>
					<div className="flex items-center justify-between mb-2">
						<p
							className={`text-xs sm:text-sm font-semibold flex items-center gap-1.5 ${
								theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
							}`}
						>
							<FileText size={14} />
							Files ({files.length})
						</p>
					</div>
					<div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2 sm:gap-3">
						{files.map((file: unknown, fileIndex: number) => {
							const isSelected =
								selectedFileIndex?.itemIndex === itemIndex &&
								selectedFileIndex?.fileIndex === fileIndex;

							return (
								<FileThumbnail
									key={fileIndex}
									file={file}
									fileIndex={fileIndex}
									isSelected={isSelected}
									onClick={() => {
										if (isSelected) {
											onFileSelect(null, null);
										} else {
											onFileSelect(itemIndex, fileIndex);
										}
									}}
									onDownload={onFileDownload}
								/>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}

