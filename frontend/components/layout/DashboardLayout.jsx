import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ title, children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar collapsed={collapsed} />
      <div className="flex-1">
        <Topbar title={title} onToggleSidebar={() => setCollapsed((curr) => !curr)} />
        <main className="p-4 md:p-6">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-20 grid grid-cols-5 border-t border-slate-200 bg-white p-2 text-xs md:hidden">
        <Link to="/dashboard" className="text-center">Dashboard</Link>
        <Link to="/students" className="text-center">Students</Link>
        <Link to="/attendance/mark" className="text-center">Attendance</Link>
        <Link to="/fees/collection" className="text-center">Fees</Link>
        <Link to="/profile" className="text-center">Profile</Link>
      </nav>
    </div>
  );
}
