import { Link } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/Button';

const navItems = [
  ['Dashboard', '/dashboard'],
  ['Students', '/students'],
  ['Teachers', '/teachers'],
  ['Classes', '/classes'],
  ['Attendance', '/attendance/mark'],
  ['Homework', '/homework'],
  ['Exams', '/exams'],
  ['Fees', '/fees/collection'],
  ['Messages', '/messages'],
  ['Settings', '/announcements']
];

function Sidebar({ mobile, onClose }) {
  return (
    <aside className={`bg-slate-900 text-slate-100 ${mobile ? 'h-full w-72 p-4' : 'hidden w-64 p-4 md:block'}`}>
      <div className="mb-6 text-lg font-bold">🏫 IRAGyan School</div>
      <nav className="grid gap-1">
        {navItems.map(([label, to]) => (
          <Link key={to} to={to} className="rounded-lg px-3 py-2 text-sm hover:bg-slate-800" onClick={onClose}>
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default function MainLayout({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className={`fixed inset-0 z-40 ${open ? 'block' : 'hidden'} md:hidden`}>
        <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
        <div className="relative z-10 h-full">
          <Sidebar mobile onClose={() => setOpen(false)} />
        </div>
      </div>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="md:hidden" onClick={() => setOpen(true)}>☰</Button>
            <div>
              <div className="text-sm text-slate-500">Springfield High School</div>
              <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded-full bg-slate-100 px-3 py-1">Admin User</span>
            <Button variant="ghost">Logout</Button>
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
