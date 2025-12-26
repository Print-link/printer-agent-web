import { ArrowLeft, Edit, Trash2, Settings } from "lucide-react";
import { useTheme } from "../../../../contexts/ThemeContext";
import type { AgentService } from "../../../../types";

interface AgentServicesViewProps {
	agentServices: AgentService[];
	onEdit: (service: AgentService) => void;
	onDelete: (serviceId: string) => void;
	onConfigurePricing: (service: AgentService) => void;
	onBack: () => void;
	isLoading: boolean;
}

export function AgentServicesView({
	agentServices,
	onEdit,
	onDelete,
	onConfigurePricing,
	onBack,
	isLoading,
}: AgentServicesViewProps) {
	const { theme } = useTheme();

	return (
		<div
			className={`rounded-lg border p-6 ${
				theme === "dark"
					? "bg-gray-800 border-gray-700"
					: "bg-white border-gray-200"
			}`}
		>
			<div className="flex items-center gap-3 mb-5">
				<button
					onClick={onBack}
					className={`p-2 rounded-md border flex items-center justify-center transition-colors ${
						theme === "dark"
							? "border-gray-600 bg-transparent hover:bg-gray-700 text-gray-300"
							: "border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700"
					}`}
				>
					<ArrowLeft size={18} />
				</button>
				<div>
					<div className="flex items-center gap-2 mb-1">
						<h2
							className={`text-lg font-semibold m-0 ${
								theme === "dark" ? "text-gray-100" : "text-gray-900"
							}`}
						>
							Agent Services (Branch-Specific Pricing)
						</h2>
						<span className="px-2 py-0.5 rounded text-[11px] font-medium uppercase bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
							Editable
						</span>
					</div>
					<p
						className={`text-xs m-0 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}
					>
						Configure pricing for your branch. These are the services you can
						create, update, and delete.
					</p>
				</div>
			</div>
			{isLoading ? (
				<p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
					Loading services...
				</p>
			) : agentServices.length === 0 ? (
				<div className="py-6 text-center">
					<p
						className={`text-sm mb-2 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}
					>
						No services configured for this branch.
					</p>
					<p
						className={`text-xs m-0 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}
					>
						Browse categories → subcategories → templates to create your first
						service configuration.
					</p>
				</div>
			) : (
				<div className="flex flex-col gap-3">
					{agentServices.map((service) => (
						<div
							key={service.id}
							className={`p-4 rounded-lg border flex justify-between items-center gap-4 ${
								theme === "dark"
									? "bg-gray-800 border-gray-600"
									: "bg-white border-gray-200"
							}`}
						>
							<div className="flex-1">
								<h3
									className={`text-base font-semibold m-0 mb-2 ${
										theme === "dark" ? "text-gray-100" : "text-gray-900"
									}`}
								>
									{service.serviceTemplate?.name || "Unknown Template"}
								</h3>
								<div className="flex flex-wrap gap-3 items-center mb-2">
									<span
										className={`text-sm ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}
									>
										Price/Unit:{" "}
										<strong
											className={
												theme === "dark" ? "text-gray-100" : "text-gray-900"
											}
										>
											{(() => {
												// If using flexible pricing, show the minimum base configuration price
												if (
													service.pricingConfig?.baseConfigurations &&
													service.pricingConfig.baseConfigurations.length > 0
												) {
													const minPrice = Math.min(
														...service.pricingConfig.baseConfigurations.map(
															(c) => c.unitPrice
														)
													);
													return `₵${minPrice.toFixed(2)}`;
												}
												// Otherwise, use legacy pricePerUnit
												return `₵${
													service?.pricePerUnit?.toFixed(2) || "0.00"
												}`;
											})()}
										</strong>
									</span>
									{service.constant !== null &&
										service.constant !== undefined && (
											<span
												className={`text-sm ${
													theme === "dark" ? "text-gray-400" : "text-gray-600"
												}`}
											>
												Constant:{" "}
												<strong
													className={
														theme === "dark" ? "text-gray-100" : "text-gray-900"
													}
												>
													{service.constant}
												</strong>
											</span>
										)}
									<span
										className={`px-2 py-1 rounded text-xs font-medium ${
											service.isActive
												? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
												: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
										}`}
									>
										{service.isActive ? "Active" : "Inactive"}
									</span>
								</div>
								<div className="flex flex-wrap gap-1.5 mb-1">
									{service.pricingConfig && (
										<span
											className={`px-1.5 py-0.5 rounded text-[11px] ${
												theme === "dark"
													? "bg-blue-400/20 text-blue-300"
													: "bg-blue-100 text-blue-700"
											}`}
										>
											Flexible Pricing
										</span>
									)}
									{service.supportsColor && (
										<span
											className={`px-1.5 py-0.5 rounded text-[11px] ${
												theme === "dark"
													? "bg-amber-400/20 text-amber-300"
													: "bg-amber-100 text-amber-700"
											}`}
										>
											Color
										</span>
									)}
									{service.supportsFrontBack && (
										<span
											className={`px-1.5 py-0.5 rounded text-[11px] ${
												theme === "dark"
													? "bg-amber-400/20 text-amber-300"
													: "bg-amber-100 text-amber-700"
											}`}
										>
											Front/Back
										</span>
									)}
									{service.supportsPrintCut && (
										<span
											className={`px-1.5 py-0.5 rounded text-[11px] ${
												theme === "dark"
													? "bg-amber-400/20 text-amber-300"
													: "bg-amber-100 text-amber-700"
											}`}
										>
											Print & Cut
										</span>
									)}
									{service.supportsFrontOnly && (
										<span
											className={`px-1.5 py-0.5 rounded text-[11px] ${
												theme === "dark"
													? "bg-amber-400/20 text-amber-300"
													: "bg-amber-100 text-amber-700"
											}`}
										>
											Front Only
										</span>
									)}
								</div>
								{service.subCategory && (
									<p
										className={`text-xs m-0 mt-1 ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}
									>
										{service.category?.name} → {service.subCategory.name}
									</p>
								)}
							</div>
							<div className="flex gap-2">
								<button
									onClick={() => onConfigurePricing(service)}
									className={`p-2 rounded-md border flex items-center justify-center transition-colors ${
										theme === "dark"
											? "border-gray-600 bg-transparent hover:bg-gray-700 text-gray-300"
											: "border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700"
									}`}
									title="Configure Flexible Pricing"
								>
									<Settings size={18} />
								</button>
								<button
									onClick={() => onEdit(service)}
									className={`p-2 rounded-md border flex items-center justify-center transition-colors ${
										theme === "dark"
											? "border-gray-600 bg-transparent hover:bg-gray-700 text-gray-300"
											: "border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700"
									}`}
									title="Edit"
								>
									<Edit size={18} />
								</button>
								<button
									onClick={() => onDelete(service.id)}
									className={`p-2 rounded-md border flex items-center justify-center transition-colors ${
										theme === "dark"
											? "border-gray-600 bg-transparent hover:bg-red-900/30 text-red-400"
											: "border-gray-300 bg-transparent hover:bg-red-50 text-red-600"
									}`}
									title="Delete"
								>
									<Trash2 size={18} />
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
