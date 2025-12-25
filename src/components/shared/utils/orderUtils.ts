/**
 * Get status color classes based on order status
 */
export function getStatusColor(status: string, theme: 'dark' | 'light' = 'light'): string {
	switch (status) {
		case 'COMPLETED':
			return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
		case 'PENDING':
			return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
		case 'QUOTED':
			return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
		case 'PAID':
			return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
		case 'IN_PROGRESS':
			return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
		default:
			return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
	}
}

/**
 * Format order date for display
 */
export function formatOrderDate(date: string | Date | null | undefined): string {
	if (!date) return 'N/A';
	return new Date(date).toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}

/**
 * Download file utility
 */
export async function downloadFile(fileUrl: string, fileName: string): Promise<void> {
	try {
		const response = await fetch(fileUrl);
		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	} catch (error) {
		console.error('Failed to download file:', error);
		throw new Error('Failed to download file');
	}
}

