import {
	createContext,
	useContext,
	useState,
	useCallback,
	type ReactNode,
} from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
	id: string;
	type: ToastType;
	message: string;
	title?: string;
	duration?: number; // in milliseconds, 0 means persistent
}

interface ToastContextType {
	toasts: Toast[];
	showToast: (toast: Omit<Toast, "id">) => void;
	removeToast: (id: string) => void;
	success: (message: string, title?: string, duration?: number) => void;
	error: (message: string, title?: string, duration?: number) => void;
	warning: (message: string, title?: string, duration?: number) => void;
	info: (message: string, title?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const showToast = useCallback((toast: Omit<Toast, "id">) => {
		const id = `toast-${Date.now()}-${Math.random()}`;
		const newToast: Toast = {
			...toast,
			id,
			duration: toast.duration ?? 5000, // Default 5 seconds
		};

		setToasts((prev) => [...prev, newToast]);
	}, []);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const success = useCallback(
		(message: string, title?: string, duration?: number) => {
			showToast({ type: "success", message, title, duration });
		},
		[showToast]
	);

	const error = useCallback(
		(message: string, title?: string, duration?: number) => {
			showToast({ type: "error", message, title, duration });
		},
		[showToast]
	);

	const warning = useCallback(
		(message: string, title?: string, duration?: number) => {
			showToast({ type: "warning", message, title, duration });
		},
		[showToast]
	);

	const info = useCallback(
		(message: string, title?: string, duration?: number) => {
			showToast({ type: "info", message, title, duration });
		},
		[showToast]
	);

	return (
		<ToastContext.Provider
			value={{
				toasts,
				showToast,
				removeToast,
				success,
				error,
				warning,
				info,
			}}
		>
			{children}
		</ToastContext.Provider>
	);
}

function useToast() {
	const context = useContext(ToastContext);
	if (context === undefined) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
}
export { useToast };
