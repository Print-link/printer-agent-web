import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useToast } from "../../contexts/ToastContext";
import { apiService } from "../../services/api";
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import printAgentLogo from "../../assets/images/printAgentLogo.png";

export default function ResetPasswordPage() {
	const { theme } = useTheme();
	const { success, error: showError } = useToast();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [errors, setErrors] = useState<{
		password?: string;
		confirmPassword?: string;
	}>({});

	useEffect(() => {
		if (!token) {
			showError("Invalid or missing reset token", "Error", 5000);
			navigate("/forgot-password");
		}
	}, [token, navigate, showError]);

	const validatePassword = (pwd: string): string | undefined => {
		if (pwd.length < 8) {
			return "Password must be at least 8 characters long";
		}
		if (!/(?=.*[a-z])/.test(pwd)) {
			return "Password must contain at least one lowercase letter";
		}
		if (!/(?=.*[A-Z])/.test(pwd)) {
			return "Password must contain at least one uppercase letter";
		}
		if (!/(?=.*\d)/.test(pwd)) {
			return "Password must contain at least one number";
		}
		return undefined;
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setErrors({});

		// Validate password
		const passwordError = validatePassword(password);
		if (passwordError) {
			setErrors({ password: passwordError });
			return;
		}

		// Validate password match
		if (password !== confirmPassword) {
			setErrors({ confirmPassword: "Passwords do not match" });
			return;
		}

		if (!token) {
			showError("Invalid reset token", "Error", 5000);
			return;
		}

		setIsLoading(true);

		try {
			await apiService.resetPassword(token, password);
			setIsSuccess(true);
			success("Password has been reset successfully", "Success", 5000);
			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to reset password";
			showError(errorMessage, "Error", 5000);
		} finally {
			setIsLoading(false);
		}
	};

	if (!token) {
		return null;
	}

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
					{!isSuccess ? (
						<>
							<div className="text-center mb-6">
								<div
									className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
										theme === "dark" ? "bg-gray-700" : "bg-gray-100"
									}`}
								>
									<Lock
										className={`w-8 h-8 ${
											theme === "dark" ? "text-gray-300" : "text-gray-600"
										}`}
									/>
								</div>
								<h2
									className={`text-2xl font-bold mb-2 ${
										theme === "dark" ? "text-gray-100" : "text-gray-900"
									}`}
								>
									Reset Your Password
								</h2>
								<p
									className={`text-sm ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}
								>
									Enter your new password below
								</p>
							</div>

							<form onSubmit={handleSubmit} className="space-y-6">
								<div>
									<label
										className={`block text-sm font-medium mb-2 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}
									>
										New Password
									</label>
									<div className="relative">
										<input
											type={showPassword ? "text" : "password"}
											value={password}
											onChange={(e) => {
												setPassword(e.target.value);
												if (errors.password) {
													setErrors({ ...errors, password: undefined });
												}
											}}
											placeholder="Enter new password"
											required
											className={`w-full px-4 py-2 pr-10 rounded-md border ${
												errors.password
													? "border-red-500"
													: theme === "dark"
													? "border-gray-600"
													: "border-gray-300"
											} ${
												theme === "dark"
													? "bg-gray-700 text-gray-100 placeholder-gray-400"
													: "bg-white text-gray-900 placeholder-gray-400"
											} focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent`}
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
												theme === "dark" ? "text-gray-400" : "text-gray-500"
											} hover:${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}
										>
											{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
										</button>
									</div>
									{errors.password && (
										<p className="mt-1 text-sm text-red-500">
											{errors.password}
										</p>
									)}
									<p
										className={`mt-1 text-xs ${
											theme === "dark" ? "text-gray-500" : "text-gray-500"
										}`}
									>
										Must be at least 8 characters with uppercase, lowercase, and
										number
									</p>
								</div>

								<div>
									<label
										className={`block text-sm font-medium mb-2 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Confirm Password
									</label>
									<div className="relative">
										<input
											type={showConfirmPassword ? "text" : "password"}
											value={confirmPassword}
											onChange={(e) => {
												setConfirmPassword(e.target.value);
												if (errors.confirmPassword) {
													setErrors({
														...errors,
														confirmPassword: undefined,
													});
												}
											}}
											placeholder="Confirm new password"
											required
											className={`w-full px-4 py-2 pr-10 rounded-md border ${
												errors.confirmPassword
													? "border-red-500"
													: theme === "dark"
													? "border-gray-600"
													: "border-gray-300"
											} ${
												theme === "dark"
													? "bg-gray-700 text-gray-100 placeholder-gray-400"
													: "bg-white text-gray-900 placeholder-gray-400"
											} focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent`}
										/>
										<button
											type="button"
											onClick={() =>
												setShowConfirmPassword(!showConfirmPassword)
											}
											className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
												theme === "dark" ? "text-gray-400" : "text-gray-500"
											} hover:${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}
										>
											{showConfirmPassword ? (
												<EyeOff size={18} />
											) : (
												<Eye size={18} />
											)}
										</button>
									</div>
									{errors.confirmPassword && (
										<p className="mt-1 text-sm text-red-500">
											{errors.confirmPassword}
										</p>
									)}
								</div>

								<button
									type="submit"
									disabled={isLoading}
									className={`w-full py-3 px-4 rounded-md font-semibold text-sm transition-all ${
										isLoading
											? "bg-amber-300 cursor-not-allowed"
											: "bg-amber-400 hover:bg-amber-500 active:bg-amber-600"
									} text-gray-900`}
								>
									{isLoading ? "Resetting..." : "Reset Password"}
								</button>
							</form>
						</>
					) : (
						<div className="text-center">
							<div
								className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
									theme === "dark" ? "bg-green-900/30" : "bg-green-100"
								}`}
							>
								<Lock
									className={`w-8 h-8 ${
										theme === "dark" ? "text-green-400" : "text-green-600"
									}`}
								/>
							</div>
							<h2
								className={`text-2xl font-bold mb-2 ${
									theme === "dark" ? "text-gray-100" : "text-gray-900"
								}`}
							>
								Password Reset Successful
							</h2>
							<p
								className={`text-sm mb-6 ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}
							>
								Your password has been successfully reset. Redirecting to login...
							</p>
						</div>
					)}

					<div className="mt-6 text-center">
						<Link
							to="/login"
							className={`inline-flex items-center gap-2 text-sm ${
								theme === "dark"
									? "text-gray-400 hover:text-gray-300"
									: "text-gray-600 hover:text-gray-900"
							} transition-colors`}
						>
							<ArrowLeft size={16} />
							Back to Login
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

