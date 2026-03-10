import { useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import { useApiQuery } from '../../hooks/useApiQuery';

const TABS = ['Profile', 'Attendance', 'Fees', 'Exams', 'Documents'];

export default function StudentProfilePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Profile');
  const { data } = useApiQuery(['student', id], `/api/students/${id}`);

  return (
    <DashboardLayout title="Student Profile">
      <Card>
        <h3 className="text-xl font-semibold">{data ? `${data.firstName} ${data.lastName}` : 'Loading...'}</h3>
        <p className="text-sm text-slate-500">Roll: {data?.admissionNumber ?? '-'}</p>
      </Card>
      <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">
        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
        <div className="pt-4 text-sm text-slate-600">{activeTab} details will load from IRAGyan APIs.</div>
      </div>
    </DashboardLayout>
  );
}
