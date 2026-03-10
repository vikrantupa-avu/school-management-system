import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';

const rows = [
  { id: 1, student: 'Aanya Sharma', class: '5A', total: 24000, paid: 12000, balance: 12000 },
  { id: 2, student: 'Rohan Patel', class: '6B', total: 24000, paid: 24000, balance: 0 }
];

export default function FeesCollectionPage() {
  const columns = [
    { key: 'student', title: 'Student' },
    { key: 'class', title: 'Class' },
    { key: 'total', title: 'Total Fee' },
    { key: 'paid', title: 'Paid' },
    { key: 'balance', title: 'Balance' },
    { key: 'collect', title: 'Action', render: () => <Button>Collect Fee</Button> }
  ];

  return (
    <DashboardLayout title="Fee Collection">
      <DataTable columns={columns} rows={rows} pageSize={8} />
    </DashboardLayout>
  );
}
