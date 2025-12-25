import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useTheme } from "../../contexts/ThemeContext";
import { useToast } from "../../contexts/ToastContext";
import type { UserRole } from "../../types";
import printAgentLogo from "../../assets/images/printAgentLogo.png";

export default function LoginPage() {
	const navigate = useNavigate();
	const { login, error, isLoading } = useAuthStore();
	const { theme } = useTheme();
	const { success, error: showError } = useToast();
	const [userRole, setUserRole] = useState<UserRole>("manager");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		try {
			await login({ email, password, role: userRole });

			const { user } = useAuthStore.getState();

			// Show success toast
			success(
				`Welcome back, ${user?.firstName || user?.name || "User"}!`,
				"Login Successful",
				3000
			);

			if (user?.isTemporaryPassword === true) {
				navigate("/setup-password");
				return;
			}

			navigate("/");
		} catch (err) {
			// Show error toast
			const errorMessage =
				error || (err instanceof Error ? err.message : "Login failed");
			showError(errorMessage, "Login Failed", 5000);
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
			<div className="w-full max-w-md space-y-8">
				{/* Logo Section */}
				<div className="flex justify-center">
					<div className="w-64 h-auto">
						<img
							src={printAgentLogo}
							alt="Print Agent Logo"
							className="w-full h-auto object-contain"
						/>
					</div>
				</div>

				{/* Form Section */}
				<div
					className={`rounded-lg p-8 ${
						theme === "dark"
							? "bg-gray-800 border border-gray-700"
							: "bg-white border border-gray-200"
					}`}
				>
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Role Selector */}
						<div>
							<label
								className={`block text-sm font-medium mb-2 ${
									theme === "dark" ? "text-gray-300" : "text-gray-700"
								}`}
							>
								I am
							</label>
							<select
								value={userRole}
								onChange={(e) => setUserRole(e.target.value as UserRole)}
								className={`w-full px-4 py-2 rounded-md border ${
									theme === "dark"
										? "bg-gray-700 border-gray-600 text-gray-100"
										: "bg-white border-gray-300 text-gray-900"
								} focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent`}
							>
								<option value="manager">Manager</option>
								<option value="clerk">Clerk</option>
							</select>
						</div>

						{/* Email Input */}
						<div>
							<label
								className={`block text-sm font-medium mb-2 ${
									theme === "dark" ? "text-gray-300" : "text-gray-700"
								}`}
							>
								Email
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email"
								required
								className={`w-full px-4 py-2 rounded-md border ${
									theme === "dark"
										? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
										: "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
								} focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent`}
							/>
						</div>

						{/* Password Input */}
						<div>
							<label
								className={`block text-sm font-medium mb-2 ${
									theme === "dark" ? "text-gray-300" : "text-gray-700"
								}`}
							>
								Password
							</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"
								required
								className={`w-full px-4 py-2 rounded-md border ${
									theme === "dark"
										? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
										: "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
								} focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent`}
							/>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className={`w-full py-3 px-4 rounded-md font-semibold text-sm transition-all ${
								isLoading
									? "bg-amber-300 cursor-not-allowed"
									: "bg-amber-400 hover:bg-amber-500 active:bg-amber-600"
							} text-gray-900`}
						>
							{isLoading ? "Logging in..." : "Login"}
						</button>

						{/* Forgot Password Link */}
						<div className="text-center">
							<Link
								to="/forgot-password"
								className={`text-sm ${
									theme === "dark"
										? "text-amber-400 hover:text-amber-300"
										: "text-amber-600 hover:text-amber-700"
								} font-medium transition-colors`}
							>
								Forgot password?
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
