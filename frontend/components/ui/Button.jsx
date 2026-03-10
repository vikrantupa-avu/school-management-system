export default function Button({ className = '', variant = 'primary', ...props }) {
  const styles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  return (
    <button
      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${styles[variant] || styles.primary} ${className}`}
      {...props}
    />
  );
}
