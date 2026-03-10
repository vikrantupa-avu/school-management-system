import { useMemo, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import DataTable from './DataTable';
import PageHeader from './PageHeader';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import Drawer from './Drawer';
import ConfirmDialog from './ConfirmDialog';
import EmptyState from './EmptyState';
import ToastNotification from './ToastNotification';
import LoadingSkeleton from './LoadingSkeleton';
import { useDebouncedValue } from '../utils/debounce';
import { useApiQuery } from '../hooks/useApiQuery';
import { createModuleRecord, deleteModuleRecord } from '../services/modules';

export default function ModuleListPage({
  title,
  subtitle,
  queryKey,
  apiPath,
  columns,
  formFields = [],
  filters,
  mapRecord = (records) => records
}) {
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [formState, setFormState] = useState(() =>
    Object.fromEntries(formFields.map((field) => [field.name, field.defaultValue ?? '']))
  );
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data = [], isLoading, refetch } = useApiQuery(
    [queryKey, debouncedSearch],
    `${apiPath}?search=${encodeURIComponent(debouncedSearch)}&limit=50`
  );

  const rows = useMemo(() => mapRecord(data), [data, mapRecord]);

  const onSave = async () => {
    try {
      await createModuleRecord(apiPath, formState);
      setToast({ type: 'success', message: `${title.slice(0, -1)} created successfully.` });
      setDrawerOpen(false);
      setFormState(Object.fromEntries(formFields.map((field) => [field.name, field.defaultValue ?? ''])));
      refetch();
    } catch (error) {
      setToast({ type: 'error', message: error.message });
    }
  };

  const onDelete = async () => {
    if (!confirmTarget) return;
    try {
      await deleteModuleRecord(apiPath, confirmTarget._id);
      setToast({ type: 'success', message: `${title.slice(0, -1)} deleted successfully.` });
      setConfirmTarget(null);
      refetch();
    } catch (error) {
      setToast({ type: 'error', message: error.message });
    }
  };

  const withActions = columns.concat({
    key: 'actions',
    title: 'Actions',
    render: (_, row) => (
      <div className="flex gap-2">
        <Button size="sm" variant="ghost">View</Button>
        <Button size="sm" variant="secondary" onClick={() => { setFormState(row); setDrawerOpen(true); }}>Edit</Button>
        <Button size="sm" variant="danger" onClick={() => setConfirmTarget(row)}>Delete</Button>
      </div>
    )
  });

  return (
    <MainLayout title={title}>
      <PageHeader title={title} subtitle={subtitle} actions={<Button onClick={() => setDrawerOpen(true)}>Add {title.slice(0, -1)}</Button>} />

      {isLoading ? <LoadingSkeleton /> : null}

      <DataTable
        title={title}
        columns={withActions}
        data={rows}
        loading={isLoading}
        search={search}
        onSearch={setSearch}
        filters={filters}
        actions={null}
        emptyState={<EmptyState title={`No ${title.toLowerCase()} found`} actionLabel={`Add ${title.slice(0, -1)}`} onAction={() => setDrawerOpen(true)} />}
      />

      <Drawer
        open={drawerOpen}
        title={`Add ${title.slice(0, -1)}`}
        onClose={() => setDrawerOpen(false)}
        footer={(
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button onClick={onSave}>Save</Button>
          </div>
        )}
      >
        <div className="grid gap-3">
          {formFields.map((field) =>
            field.type === 'select' ? (
              <Select
                key={field.name}
                label={field.label}
                value={formState[field.name] || ''}
                onChange={(event) => setFormState((curr) => ({ ...curr, [field.name]: event.target.value }))}
                options={field.options}
              />
            ) : (
              <Input
                key={field.name}
                label={field.label}
                value={formState[field.name] || ''}
                onChange={(event) => setFormState((curr) => ({ ...curr, [field.name]: event.target.value }))}
              />
            )
          )}
        </div>
      </Drawer>

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        message={`Are you sure you want to delete this ${title.slice(0, -1).toLowerCase()}?`}
        onCancel={() => setConfirmTarget(null)}
        onConfirm={onDelete}
      />

      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </MainLayout>
  );
}
