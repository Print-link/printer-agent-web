import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "../../contexts/ThemeContext";
import { apiService } from "../../services/api";
import { Printer, RefreshCw, Circle } from "lucide-react";
import type { PrinterAgent } from "../../types";

export default function StatusPage() {
	const { theme } = useTheme();
	const [autoRefresh, setAutoRefresh] = useState(true);

	const {
		data: printers = [],
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["printers"],
		queryFn: () => apiService.getAgents(),
		staleTime: 3000,
		refetchInterval: autoRefresh ? 3000 : false,
	});

	const getStatusColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case "online":
				return "text-green-500";
			case "busy":
				return "text-yellow-500";
			case "offline":
			case "error":
				return "text-red-500";
			default:
				return theme === "dark" ? "text-gray-400" : "text-gray-600";
		}
	};

	const getStatusBg = (status: string) => {
		switch (status?.toLowerCase()) {
			case "online":
				return theme === "dark"
					? "bg-green-900/30 border-green-800"
					: "bg-green-50 border-green-200";
			case "busy":
				return theme === "dark"
					? "bg-yellow-900/30 border-yellow-800"
					: "bg-yellow-50 border-yellow-200";
			case "offline":
			case "error":
				return theme === "dark"
					? "bg-red-900/30 border-red-800"
					: "bg-red-50 border-red-200";
			default:
				return theme === "dark"
					? "bg-gray-700 border-gray-600"
					: "bg-gray-50 border-gray-200";
		}
	};

	return (
		<div
			className={`rounded-lg border p-6 ${
				theme === "dark"
					? "bg-gray-800 border-gray-700"
					: "bg-white border-gray-200"
			}`}
		>
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-4">
					<label
						className={`flex items-center gap-2 text-sm ${
							theme === "dark" ? "text-gray-300" : "text-gray-700"
						}`}
					>
						<input
							type="checkbox"
							checked={autoRefresh}
							onChange={(e) => setAutoRefresh(e.target.checked)}
							className="rounded"
						/>
						Auto-refresh
					</label>
					<button
						onClick={() => refetch()}
						disabled={isLoading}
						className={`p-2 rounded-md flex items-center gap-2 ${
							theme === "dark"
								? "bg-gray-700 hover:bg-gray-600 text-gray-300"
								: "bg-gray-100 hover:bg-gray-200 text-gray-600"
						}`}
					>
						<RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
						Refresh
					</button>
				</div>
			</div>

			{isLoading && printers.length === 0 ? (
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
				</div>
			) : printers.length === 0 ? (
				<div
					className={`p-6 text-center ${
						theme === "dark" ? "text-gray-400" : "text-gray-600"
					}`}
				>
					<Printer
						className={`mx-auto mb-4 ${
							theme === "dark" ? "text-gray-600" : "text-gray-400"
						}`}
						size={48}
					/>
					<p>No printers available</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{printers.map((printer: PrinterAgent) => (
						<div
							key={printer.id}
							className={`p-4 rounded-lg border ${getStatusBg(printer.status)}`}
						>
							<div className="flex items-start justify-between mb-3">
								<div className="flex items-center gap-3">
									<Printer
										className={getStatusColor(printer.status)}
										size={24}
									/>
									<div>
										<h3
											className={`font-semibold ${
												theme === "dark" ? "text-gray-100" : "text-gray-900"
											}`}
										>
											{printer.name}
										</h3>
										{printer.computerId && (
											<p
												className={`text-sm ${
													theme === "dark" ? "text-gray-400" : "text-gray-600"
												}`}
											>
												{printer.computerId}
											</p>
										)}
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Circle
										size={12}
										className={getStatusColor(printer.status)}
										fill="currentColor"
									/>
									<span
										className={`text-xs font-semibold uppercase ${getStatusColor(
											printer.status
										)}`}
									>
										{printer.status || "Unknown"}
									</span>
								</div>
							</div>
							{printer.currentJob && (
								<div
									className={`mt-3 pt-3 border-t ${
										theme === "dark" ? "border-gray-600" : "border-gray-200"
									}`}
								>
									<p
										className={`text-xs ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}
									>
										Current Job: {printer.currentJob}
									</p>
								</div>
							)}
							{printer.totalJobs !== undefined && (
								<div
									className={`mt-2 text-xs ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}
								>
									Total Jobs: {printer.totalJobs}
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
