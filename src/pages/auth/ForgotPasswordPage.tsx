import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useToast } from "../../contexts/ToastContext";
import { apiService } from "../../services/api";
import { Mail, ArrowLeft } from "lucide-react";
import printAgentLogo from "../../assets/images/printAgentLogo.png";

export default function ForgotPasswordPage() {
	const { theme } = useTheme();
	const { success, error: showError } = useToast();
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await apiService.forgotPassword(email);
			setIsSubmitted(true);
			success(
				"Password reset link has been sent to your email",
				"Email Sent",
				5000
			);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to send reset email";
			showError(errorMessage, "Error", 5000);
		} finally {
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
					{!isSubmitted ? (
						<>
							<div className="text-center mb-6">
								<div
									className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
										theme === "dark" ? "bg-gray-700" : "bg-gray-100"
									}`}
								>
									<Mail
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
									Forgot Password?
								</h2>
								<p
									className={`text-sm ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}
								>
									Enter your email address and we'll send you a link to reset
									your password.
								</p>
							</div>

							<form onSubmit={handleSubmit} className="space-y-6">
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

								<button
									type="submit"
									disabled={isLoading}
									className={`w-full py-3 px-4 rounded-md font-semibold text-sm transition-all ${
										isLoading
											? "bg-amber-300 cursor-not-allowed"
											: "bg-amber-400 hover:bg-amber-500 active:bg-amber-600"
									} text-gray-900`}
								>
									{isLoading ? "Sending..." : "Send Reset Link"}
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
								<Mail
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
								Check Your Email
							</h2>
							<p
								className={`text-sm mb-6 ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}
							>
								We've sent a password reset link to <strong>{email}</strong>.
								Please check your inbox and follow the instructions to reset your
								password.
							</p>
							<button
								onClick={() => {
									setIsSubmitted(false);
									setEmail("");
								}}
								className={`text-sm ${
									theme === "dark"
										? "text-amber-400 hover:text-amber-300"
										: "text-amber-600 hover:text-amber-700"
								} font-medium`}
							>
								Send to a different email
							</button>
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

