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
	if (isEditing) {
		return (
			<div className="space-y-3">
				<input
					type="text"
					value={option.name}
					onChange={(e) => onSave({ name: e.target.value })}
					className={`w-full p-2 rounded-md border text-sm ${
						theme === "dark"
							? "bg-gray-800 border-gray-600 text-gray-100"
							: "bg-white border-gray-300 text-gray-900"
					} focus:outline-none focus:ring-2 focus:ring-amber-400`}
				/>
				<div className="flex items-center gap-4">
					<label className="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							checked={option.enabled}
							onChange={(e) => onSave({ enabled: e.target.checked })}
							className="cursor-pointer"
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
							checked={option.default}
							onChange={(e) => onSave({ default: e.target.checked })}
							className="cursor-pointer"
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
				<input
					type="number"
					step="0.01"
					value={option.priceModifier}
					onChange={(e) =>
						onSave({ priceModifier: parseFloat(e.target.value) || 0 })
					}
					className={`w-full p-2 rounded-md border text-sm ${
						theme === "dark"
							? "bg-gray-800 border-gray-600 text-gray-100"
							: "bg-white border-gray-300 text-gray-900"
					} focus:outline-none focus:ring-2 focus:ring-amber-400`}
				/>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => onSave({})}
						className="flex-1 px-3 py-1.5 rounded-md bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm font-medium"
					>
						<Check size={16} className="inline mr-1" />
						Save
					</button>
					<button
						type="button"
						onClick={onCancel}
						className={`px-3 py-1.5 rounded-md border text-sm font-medium ${
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
		<div className="flex justify-between items-center">
			<div className="flex-1">
				<div className="flex items-center gap-3 mb-2">
					<h4
						className={`font-semibold ${
							theme === "dark" ? "text-gray-100" : "text-gray-900"
						}`}
					>
						{option.name}
					</h4>
					{option.default && (
						<span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
							Default
						</span>
					)}
					{!option.enabled && (
						<span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
							Disabled
						</span>
					)}
				</div>
				<p
					className={`text-sm ${
						theme === "dark" ? "text-gray-400" : "text-gray-600"
					}`}
				>
					Price Modifier: ₵{option.priceModifier.toFixed(2)} per page
				</p>
			</div>
			<div className="flex gap-1">
				<button
					type="button"
					onClick={onEdit}
					className={`p-1.5 rounded-md transition-colors ${
						theme === "dark"
							? "hover:bg-gray-600 text-gray-300"
							: "hover:bg-gray-200 text-gray-700"
					}`}
				>
					<Edit size={14} />
				</button>
				<button
					type="button"
					onClick={onDelete}
					className={`p-1.5 rounded-md transition-colors ${
						theme === "dark"
							? "hover:bg-red-900/30 text-red-400"
							: "hover:bg-red-50 text-red-600"
					}`}
				>
					<Trash2 size={14} />
				</button>
			</div>
		</div>
	);
}

