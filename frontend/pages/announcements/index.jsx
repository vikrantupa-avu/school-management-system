import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import FormInput from '../../components/ui/FormInput';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

export default function AnnouncementsPage() {
  return (
    <DashboardLayout title="Announcements">
      <Card title="Create Announcement">
        <form className="grid gap-3 md:grid-cols-2">
          <FormInput label="Title" required />
          <Select
            label="Audience"
            options={[
              { label: 'All', value: 'all' },
              { label: 'Teachers', value: 'teachers' },
              { label: 'Parents', value: 'parents' },
              { label: 'Students', value: 'students' }
            ]}
          />
          <label className="md:col-span-2 grid gap-1 text-sm text-slate-700">
            <span>Description</span>
            <textarea className="rounded-lg border border-slate-300 px-3 py-2" rows={4} />
          </label>
          <FormInput label="Date" type="date" />
          <div className="md:col-span-2"><Button type="submit">Publish</Button></div>
        </form>
      </Card>
    </DashboardLayout>
  );
}
