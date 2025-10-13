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
        'inline-flex items-center px-3 py-1 text-xs rounded-full font-medium transition-colors',
        'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
        !onClick && 'cursor-default',
        onClick &&
          'cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-700 border border-transparent',
        className
      )}
    >
      {children}
    </Component>
  );
}
