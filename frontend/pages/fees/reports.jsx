import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';

export default function FeesReportsPage() {
  return (
    <DashboardLayout title="Fee Reports">
      <Card title="Collection Overview"><div className="h-72 rounded-lg bg-slate-100" /></Card>
    </DashboardLayout>
  );
}
