import { useState, useEffect } from 'react';
import { Edit, Trash2, Check } from 'lucide-react';
import type { PricingOption } from "../../../../../../types";

interface OptionCardProps {
	option: PricingOption;
	index: number;
	isEditing: boolean;
	theme: "dark" | "light";
	onEdit: () => void;
	onSave: (updates: Partial<PricingOption>) => void;
	onCancel: () => void;
	onDelete: () => void;
}

export function OptionCard({
	option,
	isEditing,
	theme,
	onEdit,
	onSave,
	onCancel,
	onDelete,
}: OptionCardProps) {
	// We use a local state that allows string for priceModifier to support empty input
	const [localOption, setLocalOption] = useState<Omit<PricingOption, 'priceModifier'> & { priceModifier: number | string }>(option);

	useEffect(() => {
		setLocalOption(option);
	}, [option]);

	const handleSave = () => {
		onSave({
			name: localOption.name,
			enabled: localOption.enabled,
			default: localOption.default,
			// Parse float or default to 0 on save
			priceModifier: typeof localOption.priceModifier === 'string' 
				? (parseFloat(localOption.priceModifier) || 0) 
				: localOption.priceModifier
		});
	};

	const handlePriceChange = (value: string) => {
		if (value === '' || value === '-') {
			setLocalOption({ ...localOption, priceModifier: value });
			return;
		}
		const parsed = parseFloat(value);
		setLocalOption({ ...localOption, priceModifier: isNaN(parsed) ? value : value });
	};

	if (isEditing) {
		return (
			<div className="space-y-3">
				<div>
					<label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
						Option Name
					</label>
					<input
						type="text"
						value={localOption.name}
						onChange={(e) => setLocalOption({ ...localOption, name: e.target.value })}
						className={`w-full p-2 rounded-md border text-sm ${
							theme === "dark"
								? "bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500"
								: "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
						} focus:outline-none focus:ring-2 focus:ring-blue-500`}
						placeholder="e.g. Stapling"
					/>
				</div>
				
				<div className="flex items-center gap-6">
					<label className="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							checked={localOption.enabled}
							onChange={(e) => setLocalOption({ ...localOption, enabled: e.target.checked })}
							className="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<span
							className={`text-sm ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}
						>
							Enabled
						</span>
					</label>
					<label className="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							checked={localOption.default}
							onChange={(e) => setLocalOption({ ...localOption, default: e.target.checked })}
							className="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<span
							className={`text-sm ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}
						>
							Default
						</span>
					</label>
				</div>
				
				<div>
					<label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
						Price Modifier (per page)
					</label>
					<div className="relative">
						<span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>₵</span>
						<input
							type="number"
							step="0.01"
							value={localOption.priceModifier}
							onChange={(e) => handlePriceChange(e.target.value)}
							className={`w-full pl-8 p-2 rounded-md border text-sm ${
								theme === "dark"
									? "bg-gray-800 border-gray-600 text-gray-100"
									: "bg-white border-gray-300 text-gray-900"
							} focus:outline-none focus:ring-2 focus:ring-blue-500`}
						/>
					</div>
				</div>

				<div className="flex gap-2 pt-2">
					<button
						type="button"
						onClick={handleSave}
						className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
					>
						<Check size={16} />
						Save
					</button>
					<button
						type="button"
						onClick={onCancel}
						className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
							theme === "dark"
								? "border-gray-600 bg-transparent hover:bg-gray-700 text-gray-300"
								: "border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700"
						}`}
					>
						Cancel
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex justify-between items-center group">
			<div className="flex-1">
				<div className="flex items-center gap-3 mb-1">
					<h4
						className={`font-semibold ${
							theme === "dark" ? "text-gray-100" : "text-gray-900"
						}`}
					>
						{option.name || <span className="text-gray-500 italic">Unnamed Option</span>}
					</h4>
					<div className="flex gap-2">
						{option.default && (
							<span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
								Default
							</span>
						)}
						{!option.enabled && (
							<span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
								Disabled
							</span>
						)}
					</div>
				</div>
				<p
					className={`text-sm ${
						theme === "dark" ? "text-gray-400" : "text-gray-600"
					}`}
				>
					Price: +₵{option.priceModifier.toFixed(2)}
				</p>
			</div>
			<div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
				<button
					type="button"
					onClick={onEdit}
					className={`p-2 rounded-md transition-colors ${
						theme === "dark"
							? "hover:bg-gray-600 text-gray-300"
							: "hover:bg-gray-100 text-gray-600"
					}`}
					title="Edit"
				>
					<Edit size={16} />
				</button>
				<button
					type="button"
					onClick={onDelete}
					className={`p-2 rounded-md transition-colors ${
						theme === "dark"
							? "hover:bg-red-900/30 text-red-400"
							: "hover:bg-red-50 text-red-600"
					}`}
					title="Delete"
				>
					<Trash2 size={16} />
				</button>
			</div>
		</div>
	);
}

