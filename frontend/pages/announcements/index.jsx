import ModuleListPage from '../../components/ModuleListPage';

export default function AnnouncementsPage() {
  return (
    <ModuleListPage
      title="Messages"
      subtitle="Broadcast announcements and school updates to staff, students, and parents."
      queryKey="announcements"
      apiPath="/api/announcements"
      columns={[
        { key: 'title', title: 'Title' },
        { key: 'audience', title: 'Audience' },
        { key: 'priority', title: 'Priority' },
        { key: 'publishDate', title: 'Publish Date' }
      ]}
      formFields={[
        { name: 'title', label: 'Title' },
        { name: 'message', label: 'Message' },
        { name: 'audience', label: 'Audience' },
        {
          name: 'priority',
          label: 'Priority',
          type: 'select',
          options: [
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' }
          ]
        }
      ]}
    />
  );
}
