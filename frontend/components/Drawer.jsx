export default function Drawer({ open, title, children, footer, onClose }) {
  return (
    <div className={`fixed inset-0 z-40 transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-slate-900/40 transition ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <aside className={`absolute right-0 top-0 h-full w-full max-w-md bg-white p-5 shadow-2xl transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button type="button" className="text-slate-500" onClick={onClose}>✕</button>
        </div>
        <div className="max-h-[calc(100%-7rem)] overflow-auto">{children}</div>
        {footer ? <div className="mt-4 border-t border-slate-200 pt-3">{footer}</div> : null}
      </aside>
    </div>
  );
}
