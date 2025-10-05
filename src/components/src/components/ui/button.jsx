export function Button({ children, className = '', ...props }) {
  return (
    <button className={`px-3 py-2 rounded font-medium transition ${className}`} {...props}>
      {children}
    </button>
  );
}
