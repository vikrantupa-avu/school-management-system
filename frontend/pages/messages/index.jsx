import MainLayout from '../../layouts/MainLayout';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

export default function MessagesPage() {
  return (
    <MainLayout title="Messages">
      <PageHeader title="Messages" subtitle="Unified inbox for teachers, parents, and admin communications." />
      <EmptyState title="No messages yet" description="Use announcements as interim broadcast tool while direct messaging API is added." />
    </MainLayout>
  );
}
