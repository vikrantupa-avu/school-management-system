import MainLayout from '../../layouts/MainLayout';
import PageHeader from '../../components/PageHeader';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function CreateStudentPage() {
  return (
    <MainLayout title="Create Student">
      <PageHeader title="Create Student" subtitle="Use drawer from list page for best UX; this route remains for compatibility." />
      <form className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2">
        <Input label="First Name" />
        <Input label="Last Name" />
        <Input label="Admission Number" />
        <Input label="Class" />
        <Input label="Section" />
        <Input label="Guardian Name" />
        <div className="md:col-span-2">
          <Button>Save Student</Button>
        </div>
      </form>
    </MainLayout>
  );
}
