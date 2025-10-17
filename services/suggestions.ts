import type { ActivityWithDetails, ContextParsed } from '@/lib/types';
import { getActivities } from '@/services/activities';

// ==================================================
// TYPES
// ==================================================
export interface ActivityScore {
  activity: ActivityWithDetails;
  score: number;
  reasons: string[];
}

// ==================================================
// SCORING
// ==================================================

/**
 * Calcula la puntuación de una actividad
 */
function calculateActivityScore(
  activity: ActivityWithDetails,
  activeContexts: ContextParsed[]
): ActivityScore {
  let score = 0;
  const reasons: string[] = [];

  // Contexto activo (+50 puntos)
  const hasActiveContext = activity.contexts?.some((context) =>
    activeContexts.some((active) => active.id === context.id)
  );
  if (hasActiveContext) {
    score += 50;
    reasons.push('Coincide con contexto activo');
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

// ==================================================
// MAIN FUNCTIONS
// ==================================================

/**
 * Obtiene todas las actividades ordenadas por puntuación
 * Recibe los contextos activos como parámetro para evitar recalcular
 */
export async function getScoredActivities(
  activeContexts: ContextParsed[]
): Promise<ActivityScore[]> {
  try {
    // Obtener todas las actividades
    const activities = await getActivities({});
    console.log('Activities loaded:', activities.length);

    // Calcular puntuación para cada actividad usando los contextos activos
    const scoredActivities = activities.map((activity) =>
      calculateActivityScore(activity, activeContexts)
    );

    // Ordenar por puntuación (mayor a menor)
    return scoredActivities.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Error in getScoredActivities:', error);
    throw error;
  }
}

/**
 * Obtiene las actividades mejor puntuadas (top N)
 */
export async function getTopActivities(
  activeContexts: ContextParsed[],
  limit = 10
): Promise<ActivityScore[]> {
  const scoredActivities = await getScoredActivities(activeContexts);
  return scoredActivities.slice(0, limit);
}
