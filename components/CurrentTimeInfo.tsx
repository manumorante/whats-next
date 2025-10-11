'use client';

import { useEffect, useState } from 'react';
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
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-2xl font-bold text-neutral-100">{timeString}</p>
          <p className="text-sm text-neutral-400 capitalize">{dayString}</p>
        </div>
      </div>

      {/* Active contexts */}
      {!isLoading && activeContexts.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-neutral-500">Contextos activos:</span>
          {activeContexts.map((context) => (
            <span
              key={context.id}
              className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20"
            >
              ✓ {context.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
