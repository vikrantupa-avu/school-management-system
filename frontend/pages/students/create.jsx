import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';

export default function StudentCreatePage() {
  return (
    <DashboardLayout title="Create Student">
      <Card title="New Student">
        <form className="grid gap-3 md:grid-cols-2">
          <FormInput label="First Name" />
          <FormInput label="Last Name" />
          <FormInput label="Roll Number" />
          <FormInput label="Class" />
          <FormInput label="Section" />
          <FormInput label="Parent Name" />
          <div className="md:col-span-2"><Button type="submit">Create Student</Button></div>
        </form>
      </Card>
    </DashboardLayout>
  );
}
