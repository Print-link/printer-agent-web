import { FileText, Tag } from 'lucide-react';
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
			parsedOptions = {
			frontBack: false,
			color: false,
			printCut: false,
			files: [],
		};
		}
	}

	// Ensure options has files array
	const files = parsedOptions?.files || [];
	const hasFiles = Array.isArray(files) && files.length > 0;
	
	// Get price modifiers from selectedConfigDetails (flexible pricing)
	const selectedConfigDetails = item.selectedConfigDetails;
	const hasFlexibleOptions = 
		(selectedConfigDetails?.options && selectedConfigDetails.options.length > 0) ||
		(selectedConfigDetails?.customSpecs && selectedConfigDetails.customSpecs.length > 0);
	
	// Legacy options check
	const hasLegacyOptions = parsedOptions?.color || parsedOptions?.frontBack || parsedOptions?.printCut;

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
				{!hasFlexibleOptions && (
					<>
						<div>Color: {parsedOptions?.color ? 'Yes' : 'No'}</div>
						<div>Front/Back: {parsedOptions?.frontBack ? 'Yes' : 'No'}</div>
					</>
				)}
			</div>
			
			{/* Price Modifiers - Flexible Pricing Options & Custom Specs */}
			{hasFlexibleOptions && (
				<div
					className={`mt-3 pt-3 border-t-2 ${
						theme === 'dark' ? 'border-yellow-500/30' : 'border-yellow-500/30'
					}`}
				>
					<div className="flex items-center gap-2 mb-2">
						<Tag size={16} className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} />
						<h5
							className={`text-xs font-bold uppercase tracking-wide ${
								theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
							}`}
						>
							Price Modifiers
						</h5>
					</div>
					<div className="space-y-2">
						{/* Selected Options */}
						{selectedConfigDetails?.options && selectedConfigDetails.options.length > 0 && (
							<div>
								<div
									className={`text-xs font-semibold mb-1.5 ${
										theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
									}`}
								>
									Options:
								</div>
								<div className="flex flex-wrap gap-2">
									{selectedConfigDetails.options.map((opt) => (
										<span
											key={opt.id}
											className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 ${
												theme === 'dark'
													? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
													: 'text-yellow-600 bg-yellow-50 border-yellow-500/30'
											}`}
										>
											{opt.name}
											{opt.priceModifier && opt.priceModifier > 0 && (
												<span
													className={`ml-1.5 ${
														theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'
													}`}
												>
													(+₵{opt.priceModifier.toFixed(2)})
												</span>
											)}
										</span>
									))}
								</div>
							</div>
						)}
						
						{/* Selected Custom Specs */}
						{selectedConfigDetails?.customSpecs && selectedConfigDetails.customSpecs.length > 0 && (
							<div>
								<div
									className={`text-xs font-semibold mb-1.5 ${
										theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
									}`}
								>
									Add-ons:
								</div>
								<div className="flex flex-wrap gap-2">
									{selectedConfigDetails.customSpecs.map((spec) => (
										<span
											key={spec.id}
											className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 ${
												theme === 'dark'
													? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
													: 'text-yellow-600 bg-yellow-50 border-yellow-500/30'
											}`}
										>
											{spec.name}
											{spec.priceModifier && spec.priceModifier > 0 && (
												<span
													className={`ml-1.5 ${
														theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'
													}`}
												>
													(+₵{spec.priceModifier.toFixed(2)})
												</span>
											)}
										</span>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			)}
			
			{/* Legacy Options (for backward compatibility, only show if no flexible options) */}
			{hasLegacyOptions && !hasFlexibleOptions && (
				<div
					className={`flex flex-wrap gap-2 mt-2 pt-2 border-t ${
						theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
					}`}
				>
					{parsedOptions?.frontBack && (
						<span
							className={`px-2 py-1 text-xs font-medium rounded ${
								theme === 'dark'
									? 'text-gray-300 bg-gray-700 border border-gray-600'
									: 'text-gray-700 bg-gray-50 border border-gray-200'
							}`}
						>
							Front & Back
						</span>
					)}
					{parsedOptions?.color && (
						<span
							className={`px-2 py-1 text-xs font-medium rounded ${
								theme === 'dark'
									? 'text-gray-300 bg-gray-700 border border-gray-600'
									: 'text-gray-700 bg-gray-50 border border-gray-200'
							}`}
						>
							Color
						</span>
					)}
					{parsedOptions?.printCut && (
						<span
							className={`px-2 py-1 text-xs font-medium rounded ${
								theme === 'dark'
									? 'text-gray-300 bg-gray-700 border border-gray-600'
									: 'text-gray-700 bg-gray-50 border border-gray-200'
							}`}
						>
							Print & Cut
						</span>
					)}
				</div>
			)}

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

