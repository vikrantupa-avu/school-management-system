import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';

export default function FeesStructurePage() {
  return (
    <DashboardLayout title="Fee Structure">
      <Card title="Define Fee Structure">
        <form className="grid gap-3 md:grid-cols-2">
          <FormInput label="Class" />
          <FormInput label="Academic Year" />
          <FormInput label="Tuition Fee" type="number" />
          <FormInput label="Transport Fee" type="number" />
          <div className="md:col-span-2"><Button type="submit">Save Structure</Button></div>
        </form>
      </Card>
    </DashboardLayout>
  );
}
