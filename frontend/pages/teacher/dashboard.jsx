import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function TeacherDashboardPage() {
  return (
    <DashboardLayout title="Teacher Dashboard">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Today's Classes">
          <ul className="space-y-2 text-sm text-slate-700">
            <li>9:00 AM — Class 5A Math</li>
            <li>10:00 AM — Class 6B Science</li>
          </ul>
        </Card>
        <Card title="Quick Actions">
          <div className="grid gap-2">
            <Button>Mark Attendance</Button>
            <Button variant="secondary">Upload Homework</Button>
            <Button variant="secondary">Enter Grades</Button>
          </div>
        </Card>
        <Card title="Recent Announcements">
          <ul className="space-y-2 text-sm text-slate-700">
            <li>Monthly staff meeting on Friday.</li>
            <li>Exam schedule published.</li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  );
}
