export function Badge({ children, className = '' }) {
  return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${className}`}>{children}</span>;
}
