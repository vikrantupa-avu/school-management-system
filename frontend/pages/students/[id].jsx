import { useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import PageHeader from '../../components/PageHeader';

export default function StudentProfilePage() {
  const { id } = useParams();

  return (
    <MainLayout title="Student Profile">
      <PageHeader title="Student Profile" subtitle={`Viewing record: ${id}`} />
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        Detailed profile, attendance, and fee tabs can be progressively enhanced here while keeping API contracts unchanged.
      </div>
    </MainLayout>
  );
}
