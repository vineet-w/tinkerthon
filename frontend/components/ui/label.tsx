// components/ui/label.tsx
export function Label({
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      {...props}
    >
      {children}
    </label>
  );
}