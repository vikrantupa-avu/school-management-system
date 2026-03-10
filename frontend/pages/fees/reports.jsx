import MainLayout from '../../layouts/MainLayout';
import PageHeader from '../../components/PageHeader';

export default function FeesReportsPage() {
  return (
    <MainLayout title="Fee Reports">
      <PageHeader title="Fee Reports" subtitle="Visual analytics and payment trends." />
      <div className="h-72 rounded-xl border border-slate-200 bg-white p-4">
        <div className="h-full animate-pulse rounded bg-slate-100" />
      </div>
    </MainLayout>
  );
}
