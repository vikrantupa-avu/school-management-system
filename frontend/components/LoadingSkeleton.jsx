export default function LoadingSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-10 animate-pulse rounded bg-slate-100" />
      ))}
    </div>
  );
}
