import ModuleListPage from '../../components/ModuleListPage';

export default function ClassesPage() {
  return (
    <ModuleListPage
      title="Classes"
      subtitle="Manage classrooms, academic year, and class teacher assignments."
      queryKey="classes"
      apiPath="/api/classes"
      columns={[
        { key: 'name', title: 'Class' },
        { key: 'academicYear', title: 'Academic Year' },
        { key: 'roomNumber', title: 'Room' }
      ]}
      formFields={[
        { name: 'name', label: 'Class Name' },
        { name: 'academicYear', label: 'Academic Year' },
        { name: 'roomNumber', label: 'Room Number' },
        { name: 'classTeacher', label: 'Class Teacher ID' }
      ]}
    />
  );
}
