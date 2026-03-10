import ModuleListPage from '../../components/ModuleListPage';

export default function AttendancePage() {
  return (
    <ModuleListPage
      title="Attendance"
      subtitle="Track daily attendance with live search and quick updates."
      queryKey="attendance"
      apiPath="/api/attendance"
      columns={[
        { key: 'studentName', title: 'Student', render: (_, row) => row.student?.firstName || row.student || 'N/A' },
        { key: 'classRoom', title: 'Class' },
        { key: 'date', title: 'Date' },
        { key: 'status', title: 'Status' }
      ]}
      formFields={[
        { name: 'student', label: 'Student ID' },
        { name: 'classRoom', label: 'Class ID' },
        { name: 'subject', label: 'Subject ID' },
        { name: 'date', label: 'Date' },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { label: 'Present', value: 'Present' },
            { label: 'Absent', value: 'Absent' },
            { label: 'Late', value: 'Late' }
          ]
        }
      ]}
    />
  );
}
