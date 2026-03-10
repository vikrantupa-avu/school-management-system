import MainLayout from '../../layouts/MainLayout';
import PageHeader from '../../components/PageHeader';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function FeesStructurePage() {
  return (
    <MainLayout title="Fee Structure">
      <PageHeader title="Fee Structure" subtitle="Configure class-wise fee templates." />
      <form className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2">
        <Input label="Class" />
        <Input label="Academic Year" />
        <Input label="Tuition" type="number" />
        <Input label="Transport" type="number" />
        <div className="md:col-span-2">
          <Button>Save Structure</Button>
        </div>
      </form>
    </MainLayout>
  );
}
