'use client';

import { useActiveContexts } from '@/hooks/useContexts';

export function ActiveContextsInfo() {
  const { activeContexts, isLoading } = useActiveContexts();

  // Filtrar contextos obvios por ID
  const filteredContexts = activeContexts.filter(
    (context) => context.id !== 9 // ID del contexto que no queremos mostrar
  );

  if (isLoading || filteredContexts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {filteredContexts.map((context) => (
        <span title={context.id.toString()} key={context.id}>
          {context.label}
        </span>
      ))}
    </div>
  );
}
