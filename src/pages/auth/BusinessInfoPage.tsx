import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useTheme } from "../../contexts/ThemeContext";
import { Building, Phone, Globe } from "lucide-react";

export default function BusinessInfoPage() {
	const navigate = useNavigate();
	const { user, updateUserProfile } = useAuthStore();
	const { theme } = useTheme();
	const [businessName, setBusinessName] = useState("");
	const [businessPhone, setBusinessPhone] = useState(user?.phoneNumber || "");
	const [websiteUrl, setWebsiteUrl] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	if (!user) {
		navigate("/login");
		return null;
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		if (!businessName.trim()) {
			setError("Business name is required");
			setIsLoading(false);
			return;
		}

		if (!businessPhone.trim()) {
			setError("Business phone is required");
			setIsLoading(false);
			return;
		}

		try {
			await updateUserProfile({
				businessName: businessName.trim(),
				businessPhone: businessPhone.trim(),
				websiteUrl: websiteUrl.trim() || undefined,
			});
			navigate("/setup-location");
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error
					? err.message
					: (err as { response?: { data?: { message?: string } } })?.response
							?.data?.message || "Failed to save business information";
			setError(errorMessage);
			setIsLoading(false);
		}
	};

	return (
		<div
			className={`min-h-screen flex items-center justify-center p-5 ${
				theme === "dark"
					? "bg-gradient-to-br from-gray-900 to-gray-800"
					: "bg-gradient-to-br from-white to-gray-50"
			}`}
		>
			<div
				className={`w-full max-w-md rounded-lg shadow-xl p-8 ${
					theme === "dark"
						? "bg-gray-800 border border-gray-700"
						: "bg-white border border-gray-200"
				}`}
			>
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-400 mb-4">
						<Building className="w-8 h-8 text-gray-900" />
					</div>
					<h2
						className={`text-2xl font-bold mb-2 ${
							theme === "dark" ? "text-gray-100" : "text-gray-900"
						}`}
					>
						Business Information
					</h2>
					<p
						className={`text-sm ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}
					>
						Tell us about your business
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							className={`block text-sm font-medium mb-2 ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}
						>
							Business Name *
						</label>
						<div className="relative">
							<Building
								className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
									theme === "dark" ? "text-gray-400" : "text-gray-500"
								}`}
							/>
							<input
								type="text"
								value={businessName}
								onChange={(e) => setBusinessName(e.target.value)}
								placeholder="Enter business name"
								required
								className={`w-full pl-10 pr-4 py-2 rounded-md border ${
									theme === "dark"
										? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
										: "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
								} focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent`}
							/>
						</div>
					</div>

					<div>
						<label
							className={`block text-sm font-medium mb-2 ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}
						>
							Business Phone *
						</label>
						<div className="relative">
							<Phone
								className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
									theme === "dark" ? "text-gray-400" : "text-gray-500"
								}`}
							/>
							<input
								type="tel"
								value={businessPhone}
								onChange={(e) => setBusinessPhone(e.target.value)}
								placeholder="Enter business phone"
								required
								className={`w-full pl-10 pr-4 py-2 rounded-md border ${
									theme === "dark"
										? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
										: "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
								} focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent`}
							/>
						</div>
					</div>

					<div>
						<label
							className={`block text-sm font-medium mb-2 ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}
						>
							Website URL (Optional)
						</label>
						<div className="relative">
							<Globe
								className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
									theme === "dark" ? "text-gray-400" : "text-gray-500"
								}`}
							/>
							<input
								type="url"
								value={websiteUrl}
								onChange={(e) => setWebsiteUrl(e.target.value)}
								placeholder="https://example.com"
								className={`w-full pl-10 pr-4 py-2 rounded-md border ${
									theme === "dark"
										? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
										: "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
								} focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent`}
							/>
						</div>
					</div>

					{error && (
						<div
							className={`p-3 rounded-md text-sm text-center ${
								theme === "dark"
									? "bg-red-900/30 text-red-400 border border-red-800"
									: "bg-red-50 text-red-600 border border-red-200"
							}`}
						>
							{error}
						</div>
					)}

					<button
						type="submit"
						disabled={isLoading}
						className={`w-full py-3 px-4 rounded-md font-semibold text-sm transition-all ${
							isLoading
								? "bg-amber-300 cursor-not-allowed"
								: "bg-amber-400 hover:bg-amber-500 active:bg-amber-600"
						} text-gray-900 shadow-md hover:shadow-lg`}
					>
						{isLoading ? "Saving..." : "Continue"}
					</button>
				</form>
			</div>
		</div>
	);
}
