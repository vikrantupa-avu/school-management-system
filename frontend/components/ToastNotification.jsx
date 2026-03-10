export default function ToastNotification({ toast, onClose }) {
  if (!toast) return null;

  const tone = toast.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600';
  return (
    <div className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${tone}`}>
      <div className="flex items-center gap-4">
        <span>{toast.message}</span>
        <button type="button" onClick={onClose} className="text-white/80">✕</button>
      </div>
    </div>
  );
}
