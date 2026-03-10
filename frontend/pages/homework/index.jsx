import MainLayout from '../../layouts/MainLayout';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

export default function HomeworkPage() {
  return (
    <MainLayout title="Homework">
      <PageHeader title="Homework" subtitle="Homework module scaffold is ready for API integration." />
      <EmptyState title="No homework records found" description="Connect this module to a homework API endpoint to enable assignment workflows." />
    </MainLayout>
  );
}
