import ModuleListPage from '../../components/ModuleListPage';

export default function TeachersPage() {
  return (
    <ModuleListPage
      title="Teachers"
      subtitle="Manage teacher profiles, departments, and contacts."
      queryKey="teachers"
      apiPath="/api/teachers"
      columns={[
        { key: 'name', title: 'Name', render: (_, row) => `${row.firstName || ''} ${row.lastName || ''}`.trim() },
        { key: 'employeeId', title: 'Employee ID' },
        { key: 'department', title: 'Department' },
        { key: 'phone', title: 'Phone' }
      ]}
      formFields={[
        { name: 'firstName', label: 'First Name' },
        { name: 'lastName', label: 'Last Name' },
        { name: 'employeeId', label: 'Employee ID' },
        { name: 'department', label: 'Department' },
        { name: 'phone', label: 'Phone' }
      ]}
    />
  );
}
