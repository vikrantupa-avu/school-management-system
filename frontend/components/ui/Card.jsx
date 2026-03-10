export default function Card({ title, children, className = '' }) {
  return (
    <section className={`rounded-xl bg-white p-6 shadow-sm ${className}`}>
      {title ? <h3 className="mb-4 text-base font-semibold text-slate-800">{title}</h3> : null}
      {children}
    </section>
  );
}
