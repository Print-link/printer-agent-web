import { useState, useEffect } from 'react';
import { Edit, Trash2, Check } from 'lucide-react';
import type { CustomSpecification } from "../../../../../../types";

interface CustomSpecCardProps {
	spec: CustomSpecification;
	index: number;
	isEditing: boolean;
	theme: "dark" | "light";
	onEdit: () => void;
	onSave: (updates: Partial<CustomSpecification>) => void;
	onCancel: () => void;
	onDelete: () => void;
}

export function CustomSpecCard({
	spec,
	isEditing,
	theme,
	onEdit,
	onSave,
	onCancel,
	onDelete,
}: CustomSpecCardProps) {
	const [localSpec, setLocalSpec] = useState<Omit<CustomSpecification, 'priceModifier'> & { priceModifier: number | string }>(spec);

	useEffect(() => {
		setLocalSpec(spec);
	}, [spec]);

	const handleSave = () => {
		onSave({
			name: localSpec.name,
			priceModifier: typeof localSpec.priceModifier === 'string' 
				? (parseFloat(localSpec.priceModifier) || 0) 
				: localSpec.priceModifier
		});
	};

	const handlePriceChange = (value: string) => {
		if (value === '' || value === '-') {
			setLocalSpec({ ...localSpec, priceModifier: value });
			return;
		}
		const parsed = parseFloat(value);
		setLocalSpec({ ...localSpec, priceModifier: isNaN(parsed) ? value : value });
	};

	if (isEditing) {
		return (
			<div className="space-y-3">
				<div>
					<label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
						Specification Name
					</label>
					<input
						type="text"
						value={localSpec.name}
						onChange={(e) => setLocalSpec({ ...localSpec, name: e.target.value })}
						className={`w-full p-2 rounded-md border text-sm ${
							theme === "dark"
								? "bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500"
								: "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
						} focus:outline-none focus:ring-2 focus:ring-blue-500`}
						placeholder="e.g. Ring Binding"
					/>
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
							value={localSpec.priceModifier}
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
			<div>
				<h4
					className={`font-semibold mb-1 ${
						theme === "dark" ? "text-gray-100" : "text-gray-900"
					}`}
				>
					{spec.name || <span className="text-gray-500 italic">Unnamed Specification</span>}
				</h4>
				<p
					className={`text-sm ${
						theme === "dark" ? "text-gray-400" : "text-gray-600"
					}`}
				>
					Price: +₵{spec.priceModifier.toFixed(2)}
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

