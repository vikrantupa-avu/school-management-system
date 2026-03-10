export default function Tabs({ tabs = [], active, onChange }) {
  return (
    <div className="border-b border-slate-200">
      <nav className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`rounded-t-lg px-4 py-2 text-sm ${active === tab ? 'bg-white font-semibold text-indigo-600' : 'text-slate-500'}`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}
