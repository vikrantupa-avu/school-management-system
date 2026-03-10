import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

export default function Topbar({ title, onToggleSidebar }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        <Button variant="secondary" className="md:hidden" onClick={onToggleSidebar}>☰</Button>
        <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">IRAGyan Admin</span>
        <Avatar name="IRAGyan User" />
      </div>
    </header>
  );
}
