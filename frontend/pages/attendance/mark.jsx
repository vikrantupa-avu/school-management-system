import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { useState } from 'react';

const seed = [
  { id: '1', name: 'Aanya Sharma', present: true },
  { id: '2', name: 'Rohan Patel', present: true },
  { id: '3', name: 'Meera Nair', present: true }
];

export default function AttendanceMarkPage() {
  const [students, setStudents] = useState(seed);

  const toggle = (id) => setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, present: !s.present } : s)));
  const markAllPresent = () => setStudents((prev) => prev.map((s) => ({ ...s, present: true })));

  return (
    <DashboardLayout title="Mark Attendance">
      <Card title="Class Selection">
        <div className="grid gap-3 md:grid-cols-3">
          <Select label="Class" options={[{ label: 'Class 5', value: '5' }]} />
          <Select label="Section" options={[{ label: 'A', value: 'A' }, { label: 'B', value: 'B' }]} />
          <div className="flex items-end"><Button onClick={markAllPresent}>Mark All Present</Button></div>
        </div>
      </Card>

      <Card title="Students" className="mt-4">
        <div className="space-y-2">
          {students.map((student) => (
            <label key={student.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <span>{student.name}</span>
              <input type="checkbox" checked={student.present} onChange={() => toggle(student.id)} />
            </label>
          ))}
        </div>
        <div className="mt-4"><Button>Submit</Button></div>
      </Card>
    </DashboardLayout>
  );
}
