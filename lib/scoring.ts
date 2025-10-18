import type { Activity, Context, ScoredActivity } from '@/types';

/**
 * Calcula la puntuación de una actividad
 */
export function calculateActivityScore(activity: Activity, contexts: Context[]): ScoredActivity {
  let score = 0;
  const reasons: string[] = [];

  // Contexto activo (+50 puntos) o sin contexto activo (-50 puntos)
  const hasActiveContext = activity.contexts?.some((context) =>
    contexts.some((active) => active.id === context.id)
  );
  if (hasActiveContext) {
    score += 50;
    reasons.push('Coincide con contexto activo');
  } else {
    score -= 50;
    reasons.push('Contextos inactivos: -50 puntos');
  }

  // Prioridad (+40, +25, +10 puntos)
  const priorityPoints = [0, 40, 25, 10][activity.priority] || 0;
  score += priorityPoints;
  reasons.push(`Prioridad: +${priorityPoints} puntos`);

  // Energía (+30, +20, +10 puntos)
  const energyPoints = activity.energy ? [0, 30, 20, 10][activity.energy] || 0 : 0;
  score += energyPoints;
  reasons.push(`Energía: +${energyPoints} puntos`);

  return { activity, score, reasons };
}
