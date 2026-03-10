import { useMemo, useState } from 'react';
import Button from './Button';
import SearchBar from './SearchBar';

export default function DataTable({
  title,
  columns = [],
  data = [],
  loading,
  search,
  onSearch,
  filters,
  actions,
  emptyState,
  pageSize = 10
}) {
  const [sort, setSort] = useState({ key: columns[0]?.key, dir: 'asc' });
  const [page, setPage] = useState(1);

  const sortedData = useMemo(() => {
    const next = [...data];
    if (!sort.key) return next;
    next.sort((a, b) => {
      const av = a?.[sort.key] ?? '';
      const bv = b?.[sort.key] ?? '';
      if (av === bv) return 0;
      return av > bv ? 1 : -1;
    });
    return sort.dir === 'asc' ? next : next.reverse();
  }, [data, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const updateSort = (key) => {
    setSort((curr) => (curr.key === key ? { key, dir: curr.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
  };

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {actions}
      </div>

      {(onSearch || filters) && (
        <div className="grid gap-2 md:grid-cols-4">
          {onSearch ? <SearchBar value={search} onChange={(event) => onSearch(event.target.value)} /> : null}
          {filters}
        </div>
      )}

      {loading ? (
        <div className="py-10 text-center text-sm text-slate-500">Loading records…</div>
      ) : pageData.length === 0 ? (
        emptyState
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full text-sm">
              <thead className="border-b border-slate-200 text-left text-slate-500">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="px-3 py-2">
                      <button type="button" className="font-medium" onClick={() => updateSort(col.key)}>
                        {col.title}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageData.map((row, index) => (
                  <tr key={row._id ?? index} className="border-b border-slate-100">
                    {columns.map((col) => (
                      <td key={col.key} className="px-3 py-2 text-slate-700">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 md:hidden">
            {pageData.map((row, index) => (
              <article key={row._id ?? index} className="rounded-lg border border-slate-200 p-3">
                {columns.map((col) => (
                  <p key={col.key} className="text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">{col.title}: </span>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </p>
                ))}
              </article>
            ))}
          </div>
        </>
      )}

      <div className="flex items-center justify-end gap-2">
        <Button variant="secondary" disabled={currentPage <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
        <span className="text-xs text-slate-500">{currentPage} / {totalPages}</span>
        <Button variant="secondary" disabled={currentPage >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
      </div>
    </section>
  );
}
