export default function FormInput({ label, className = '', ...props }) {
  return (
    <label className="grid gap-1 text-sm text-slate-700">
      <span>{label}</span>
      <input className={`rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 ${className}`} {...props} />
    </label>
  );
}
