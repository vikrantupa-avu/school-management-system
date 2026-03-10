export default function Select({ label, options = [], className = '', ...props }) {
  return (
    <label className="grid gap-1 text-sm text-slate-700">
      <span>{label}</span>
      <select className={`rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 ${className}`} {...props}>
        {options.map((option) => (
          <option key={option.value ?? option} value={option.value ?? option}>
            {option.label ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}
