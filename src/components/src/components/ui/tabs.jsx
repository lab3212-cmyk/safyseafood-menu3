import { useState } from 'react';
export function Tabs({ children, defaultValue, className = '' }) {
  const [value, setValue] = useState(defaultValue);
  const tabs = [];
  const contents = [];
  children.forEach(child => {
    if (child.type === TabsList) tabs.push(child);
    if (child.type === TabsContent) contents.push(child);
  });
  return (
    <div className={className}>
      {tabs.map(tab => React.cloneElement(tab, { value, setValue }))}
      {contents.filter(content => content.props.value === value)}
    </div>
  );
}
export function TabsList({ children, value, setValue, className = '' }) {
  return (
    <div className={className}>
      {children.map(child => React.cloneElement(child, { value, setValue }))}
    </div>
  );
}
export function TabsTrigger({ value: tabValue, value: activeValue, setValue, children, className = '' }) {
  return (
    <button
      className={`px-2 py-1 rounded ${activeValue === tabValue ? 'bg-blue-600 text-white' : ''} ${className}`}
      onClick={() => setValue(tabValue)}
    >
      {children}
    </button>
  );
}
export function TabsContent({ value, children, className = '' }) {
  return <div className={className}>{children}</div>;
}
