import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import FormInput from '../../components/ui/FormInput';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { useApiQuery } from '../../hooks/useApiQuery';

export default function StudentsIndexPage() {
  const [search, setSearch] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [section, setSection] = useState('');
  const [status, setStatus] = useState('');
  const { data = [] } = useApiQuery(['students', search], `/api/students?search=${encodeURIComponent(search)}&limit=100`);

  const filtered = useMemo(
    () =>
      data.filter((student) => {
        if (classLevel && student.classLevel !== classLevel) return false;
        if (section && student.section !== section) return false;
        if (status && String(student.active) !== status) return false;
        return true;
      }),
    [data, classLevel, section, status]
  );

  const columns = [
    { key: 'name', title: 'Name', render: (_, row) => `${row.firstName} ${row.lastName}` },
    { key: 'admissionNumber', title: 'Roll Number' },
    { key: 'classLevel', title: 'Class' },
    { key: 'guardianName', title: 'Parent' },
    { key: 'feesStatus', title: 'Fees Status', render: () => 'Pending' },
    { key: 'attendance', title: 'Attendance', render: () => 'N/A' },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Link to={`/students/${row._id}`} className="text-indigo-600">View</Link>
          <button type="button" className="text-slate-600">Edit</button>
          <button type="button" className="text-red-600">Delete</button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout title="Students">
      <div className="mb-4 grid gap-3 md:grid-cols-5">
        <FormInput label="Search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name or roll number" />
        <FormInput label="Class" value={classLevel} onChange={(e) => setClassLevel(e.target.value)} placeholder="Class" />
        <FormInput label="Section" value={section} onChange={(e) => setSection(e.target.value)} placeholder="Section" />
        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} options={[{ label: 'All', value: '' }, { label: 'Active', value: 'true' }, { label: 'Inactive', value: 'false' }]} />
        <div className="flex items-end"><Button>Apply</Button></div>
      </div>
      <DataTable columns={columns} rows={filtered} pageSize={10} />
    </DashboardLayout>
  );
}
