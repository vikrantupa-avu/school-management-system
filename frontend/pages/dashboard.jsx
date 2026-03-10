import MainLayout from '../layouts/MainLayout';
import PageHeader from '../components/PageHeader';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useApiQuery } from '../hooks/useApiQuery';

function KPI({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useApiQuery(['dashboard'], '/api/dashboard');

  return (
    <MainLayout title="Dashboard">
      <PageHeader title="Dashboard" subtitle="Operational snapshot across students, attendance, and fees." />
      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KPI label="Total Students" value={data?.students ?? '-'} />
          <KPI label="Total Teachers" value={data?.teachers ?? '-'} />
          <KPI label="Attendance Today" value={data?.attendanceToday ?? '-'} />
          <KPI label="Fees Collected" value={data?.feesCollected ?? '-'} />
        </div>
      )}
    </MainLayout>
  );
}
