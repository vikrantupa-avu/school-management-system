export default function Avatar({ name = 'User' }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return <div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{initials}</div>;
}
