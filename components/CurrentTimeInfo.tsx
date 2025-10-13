'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/Badge';
import { useActiveContexts } from '@/hooks/useContexts';

export function CurrentTimeInfo() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { activeContexts, isLoading } = useActiveContexts();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const timeString = currentTime.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const dayString = currentTime.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <p className="text-hero-display font-black leading-none text-neutral-900 dark:text-neutral-100">
          {timeString}
        </p>
        <p className="text-xl capitalize text-neutral-500 dark:text-neutral-400">{dayString}</p>
      </div>

      {!isLoading && activeContexts.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {activeContexts.slice(0, 3).map((context) => (
            <Badge
              key={context.id}
              className="rounded-2xl bg-neutral-200/70 px-4 py-2 text-sm font-medium text-neutral-700 dark:bg-neutral-800/70 dark:text-neutral-200"
            >
              {context.label}
            </Badge>
          ))}
          {activeContexts.length > 3 && (
            <Badge className="rounded-2xl bg-neutral-200/70 px-4 py-2 text-sm font-medium text-neutral-700 dark:bg-neutral-800/70 dark:text-neutral-200">
              +{activeContexts.length - 3}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
