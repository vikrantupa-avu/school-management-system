import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import { useApiQuery } from '../hooks/useApiQuery';

export default function DashboardPage() {
  const { data } = useApiQuery(['dashboard'], '/api/dashboard');

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Students" value={data?.students ?? '-'} />
        <StatCard label="Total Teachers" value={data?.teachers ?? '-'} />
        <StatCard label="Attendance Today" value={data?.attendanceToday ?? '-'} />
        <StatCard label="Fees Collected" value={data?.feesCollected ?? '-'} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card title="Student Growth"><div className="h-52 rounded-lg bg-slate-100" /></Card>
        <Card title="Attendance Trend"><div className="h-52 rounded-lg bg-slate-100" /></Card>
        <Card title="Fee Collection"><div className="h-52 rounded-lg bg-slate-100" /></Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card title="Recent Activities"><ul className="text-sm text-slate-600"><li>Admissions updated</li><li>Attendance submitted</li></ul></Card>
        <Card title="Upcoming Exams"><ul className="text-sm text-slate-600"><li>Math Midterm - Monday</li></ul></Card>
        <Card title="Announcements"><ul className="text-sm text-slate-600"><li>PTM on Friday</li></ul></Card>
      </div>
    </DashboardLayout>
  );
}
