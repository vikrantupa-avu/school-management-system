import ModuleListPage from '../../components/ModuleListPage';

export default function ExamsPage() {
  return (
    <ModuleListPage
      title="Exams"
      subtitle="Track exam records and marks entry."
      queryKey="exams"
      apiPath="/api/grades"
      columns={[
        { key: 'student', title: 'Student ID' },
        { key: 'subject', title: 'Subject' },
        { key: 'examType', title: 'Exam Type' },
        { key: 'score', title: 'Score' },
        { key: 'gradeLetter', title: 'Grade' }
      ]}
      formFields={[
        { name: 'student', label: 'Student ID' },
        { name: 'subject', label: 'Subject' },
        { name: 'examType', label: 'Exam Type' },
        { name: 'score', label: 'Score' },
        { name: 'maxScore', label: 'Max Score' }
      ]}
    />
  );
}
