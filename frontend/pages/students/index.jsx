import Select from '../../components/Select';
import ModuleListPage from '../../components/ModuleListPage';

export default function StudentsIndexPage() {
  const columns = [
    { key: 'name', title: 'Name', render: (_, row) => `${row.firstName || ''} ${row.lastName || ''}`.trim() },
    { key: 'admissionNumber', title: 'Admission No' },
    { key: 'classLevel', title: 'Class' },
    { key: 'section', title: 'Section' },
    { key: 'guardianName', title: 'Parent' }
  ];

  const formFields = [
    { name: 'firstName', label: 'First Name' },
    { name: 'lastName', label: 'Last Name' },
    { name: 'admissionNumber', label: 'Admission Number' },
    { name: 'classLevel', label: 'Class' },
    { name: 'section', label: 'Section' },
    { name: 'guardianName', label: 'Parent Name' },
    { name: 'guardianPhone', label: 'Parent Phone' },
    { name: 'address', label: 'Address' }
  ];

  const filters = (
    <>
      <Select options={[{ label: 'All classes', value: '' }, { label: 'Grade 1', value: '1' }, { label: 'Grade 2', value: '2' }]} />
      <Select options={[{ label: 'All sections', value: '' }, { label: 'A', value: 'A' }, { label: 'B', value: 'B' }]} />
      <div />
    </>
  );

  return (
    <ModuleListPage
      title="Students"
      subtitle="Manage admissions, guardians, and class allocation from a single page."
      queryKey="students"
      apiPath="/api/students"
      columns={columns}
      formFields={formFields}
      filters={filters}
    />
  );
}
