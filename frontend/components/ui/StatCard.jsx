import Card from './Card';

export default function StatCard({ label, value, delta }) {
  return (
    <Card>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      {delta ? <p className="mt-2 text-xs text-emerald-600">{delta}</p> : null}
    </Card>
  );
}
