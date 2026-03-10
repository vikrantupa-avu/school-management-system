import MainLayout from '../../layouts/MainLayout';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';

export default function TeacherDashboardPage() {
  return (
    <MainLayout title="Teacher Dashboard">
      <PageHeader title="Teacher Dashboard" subtitle="Class schedule and daily teaching actions." />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-semibold">Today's Classes</h3>
          <ul className="mt-2 text-sm text-slate-600">
            <li>9:00 AM — Class 5A Math</li>
            <li>10:00 AM — Class 6B Science</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-semibold">Quick Actions</h3>
          <div className="mt-3 grid gap-2">
            <Button>Mark Attendance</Button>
            <Button variant="secondary">Upload Homework</Button>
            <Button variant="secondary">Enter Grades</Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
