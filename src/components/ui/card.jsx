export function Card({ children, className = '' }) {
  return <div className={`bg-white rounded-lg shadow ${className}`}>{children}</div>;
}

export function CardHeader({ children, className = '' }) {
  return <div className={`p-4 border-b ${className}`}>{children}</div>;
}
export function CardContent({ children, className = '' }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
export function CardFooter({ children, className = '' }) {
  return <div className={`p-4 border-t flex gap-2 ${className}`}>{children}</div>;
}
export function CardTitle({ children, className = '' }) {
  return <h3 className={`font-bold text-lg ${className}`}>{children}</h3>;
}
export function CardDescription({ children, className = '' }) {
  return <div className={`text-gray-500 text-sm ${className}`}>{children}</div>;
} 
