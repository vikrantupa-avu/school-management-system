import ModuleListPage from '../../components/ModuleListPage';

export default function FeesCollectionPage() {
  return (
    <ModuleListPage
      title="Fees"
      subtitle="Monitor collections, dues, and payment statuses by term."
      queryKey="fees"
      apiPath="/api/fees"
      columns={[
        { key: 'student', title: 'Student ID' },
        { key: 'term', title: 'Term' },
        { key: 'academicYear', title: 'Year' },
        { key: 'paidAmount', title: 'Paid Amount' },
        { key: 'status', title: 'Status' }
      ]}
      formFields={[
        { name: 'student', label: 'Student ID' },
        { name: 'term', label: 'Term' },
        { name: 'academicYear', label: 'Academic Year' },
        { name: 'tuition', label: 'Tuition' },
        { name: 'paidAmount', label: 'Paid Amount' },
        { name: 'status', label: 'Status' }
      ]}
    />
  );
}
