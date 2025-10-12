import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function Badge({ children, className, onClick }: BadgeProps) {
  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs rounded font-medium',
        'bg-neutral-800 text-neutral-300',
        !onClick && 'cursor-default',
        onClick && 'cursor-pointer hover:bg-neutral-700 transition-colors',
        className
      )}
    >
      {children}
    </Component>
  );
}
