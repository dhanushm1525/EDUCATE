import { useEffect } from "react";
import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";
import { useToastStore, type Toast } from "../../store/toastStore";

const toastIcon = {
  success: CheckCircle2,
  error: CircleAlert,
  info: Info,
} as const;

export default function ToastProvider() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: (id: string) => void;
}) {
  const Icon = toastIcon[toast.type];

  useEffect(() => {
    const timeoutId = window.setTimeout(() => onClose(toast.id), 4500);
    return () => window.clearTimeout(timeoutId);
  }, [onClose, toast.id]);

  return (
    <div className={`toast toast-${toast.type}`} role={toast.type === "error" ? "alert" : "status"}>
      <Icon className="toast-icon" aria-hidden="true" />
      <p className="toast-message">{toast.message}</p>
      <button
        type="button"
        className="toast-close"
        onClick={() => onClose(toast.id)}
        aria-label="Dismiss notification"
      >
        <X size={16} aria-hidden="true" />
      </button>
      <span className="toast-progress" aria-hidden="true" />
    </div>
  );
}