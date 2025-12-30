import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
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
	theme,
	onSave,
	onDelete,
}: OptionCardProps) {
	const [localPrice, setLocalPrice] = useState<string | number>(option.priceModifier);

	useEffect(() => {
		setLocalPrice(option.priceModifier);
	}, [option.priceModifier]);

	const handlePriceChange = (value: string) => {
		setLocalPrice(value);
		const parsed = parseFloat(value);
		if (!isNaN(parsed) && parsed !== option.priceModifier) {
			onSave({ priceModifier: parsed });
		}
	};

	return (
		<div className={`group flex items-center gap-4 px-4 py-3 rounded-xl border transition-all ${
			option.enabled 
				? theme === 'dark' ? 'bg-blue-500/5 border-blue-500/30' : 'bg-blue-50/50 border-blue-200'
				: theme === 'dark' ? 'bg-transparent border-gray-800 opacity-60' : 'bg-transparent border-gray-100 opacity-60'
		}`}>
			<input
				type="checkbox"
				checked={option.enabled}
				onChange={(e) => onSave({ enabled: e.target.checked })}
				className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
			/>

			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2">
					<span className={`text-sm font-bold truncate ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
						{option.name}
					</span>
					{option.default && (
						<span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter bg-blue-500/10 text-blue-400 border border-blue-500/20">
							Default
						</span>
					)}
				</div>
			</div>

			<div className="flex items-center gap-3">
				{option.enabled && (
					<div className="relative flex items-center">
						<span className="absolute left-2.5 text-[10px] font-bold text-gray-500">₵</span>
						<input
							type="number"
							step="0.01"
							value={localPrice}
							onChange={(e) => handlePriceChange(e.target.value)}
							className={`w-20 pl-5 pr-2 py-1.5 rounded-lg border text-xs font-black transition-all ${
								theme === 'dark'
									? 'bg-gray-900 border-gray-800 focus:border-blue-500 text-white'
									: 'bg-white border-gray-200 focus:border-blue-500 text-gray-900'
							} focus:outline-none`}
						/>
					</div>
				)}

				<button
					type="button"
					onClick={onDelete}
					className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${
						theme === 'dark' ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-600'
					}`}
				>
					<Trash2 size={14} />
				</button>
			</div>
		</div>
	);
}
