import { Download, FileText } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface FileThumbnailProps {
	file: any;
	fileIndex: number;
	isSelected: boolean;
	onClick: () => void;
	onDownload: (fileUrl: string, fileName: string) => void;
}

export interface FileData {
	url?: string;
	fileUrl?: string;
	secure_url?: string;
	name?: string;
	publicId?: string;
	format?: string;
	size?: number;
}

export function FileThumbnail({
	file,
	fileIndex,
	isSelected,
	onClick,
	onDownload,
}: FileThumbnailProps) {
	const { theme } = useTheme();

	const fileUrl = file.url || file.fileUrl || file.secure_url || '';
	const fileName =
		file.name || file.publicId?.split('/').pop() || `File ${fileIndex + 1}`;

	return (
		<div
			onClick={onClick}
			className={`relative border-2 rounded-md overflow-hidden cursor-pointer transition-all ${
				isSelected
					? 'border-amber-400 ring-2 ring-amber-400'
					: theme === 'dark'
					? 'border-gray-600 hover:border-gray-500'
					: 'border-gray-200 hover:border-gray-300'
			}`}
		>
			{/* File Preview Thumbnail */}
			<div
				className={`w-full h-[120px] flex items-center justify-center ${
					theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
				}`}
			>
				{file.format === 'pdf' ? (
					<FileText
						className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
						size={40}
					/>
				) : (
					<img
						src={fileUrl}
						alt={fileName}
						className="w-full h-full object-cover"
						onError={(e) => {
							(e.target as HTMLImageElement).style.display = 'none';
						}}
					/>
				)}
			</div>
			{/* File Info */}
			<div className={`p-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
				<p
					className={`text-xs font-medium truncate ${
						theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
					}`}
				>
					{fileName}
				</p>
				{file.size && (
					<p
						className={`text-[10px] mt-0.5 ${
							theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
						}`}
					>
						{(file.size / 1024).toFixed(1)} KB
					</p>
				)}
			</div>
			{/* Download Button Overlay */}
			{fileUrl && (
				<button
					onClick={(e) => {
						e.stopPropagation();
						onDownload(fileUrl, fileName);
					}}
					className="absolute top-1 right-1 p-1.5 rounded bg-black/60 hover:bg-black/80 text-white transition-all"
				>
					<Download size={14} />
				</button>
			)}
		</div>
	);
}

