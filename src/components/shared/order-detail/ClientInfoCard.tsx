import { User, Mail, Phone } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import type { ClerkOrder } from '../../../types';

interface ClientInfoCardProps {
	client: ClerkOrder['client'];
}

export function ClientInfoCard({ client }: ClientInfoCardProps) {
	const { theme } = useTheme();

	return (
		<div
			className={`p-3 sm:p-4 rounded-lg ${
				theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
			}`}
		>
			<h3
				className={`text-base sm:text-lg font-semibold mb-3 ${
					theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
				}`}
			>
				Client Information
			</h3>
			<div className="space-y-3">
				<div className="flex items-center gap-3">
					<User
						className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
						size={18}
					/>
					<span className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
						{client.fullName}
					</span>
				</div>
				<div className="flex items-center gap-3">
					<Mail
						className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
						size={18}
					/>
					<span className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
						{client.email}
					</span>
				</div>
				<div className="flex items-center gap-3">
					<Phone
						className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
						size={18}
					/>
					<span className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
						{client.phoneNumber}
					</span>
				</div>
			</div>
		</div>
	);
}

