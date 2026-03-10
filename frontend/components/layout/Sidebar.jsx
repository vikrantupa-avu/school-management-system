import { Link } from 'react-router-dom';

const nav = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/students', label: 'Students' },
  { to: '/attendance/mark', label: 'Attendance' },
  { to: '/fees/collection', label: 'Fees' },
  { to: '/announcements', label: 'Announcements' }
];

export default function Sidebar({ collapsed }) {
  return (
    <aside className={`hidden border-r border-slate-200 bg-slate-900 text-slate-100 md:block ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="px-4 py-5 text-lg font-bold">IRAGyan</div>
      <nav className="grid gap-1 px-2">
        {nav.map((item) => (
          <Link key={item.to} to={item.to} className="rounded-lg px-3 py-2 text-sm hover:bg-slate-800">
            {collapsed ? item.label[0] : item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
