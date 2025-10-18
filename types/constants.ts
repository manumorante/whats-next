// UI Constants
export const ENERGY_OPTIONS = [
  { value: 1 as const, label: 'Baja energía' },
  { value: 2 as const, label: 'Media energía' },
  { value: 3 as const, label: 'Alta energía' },
] as const;

export const PRIORITY_OPTIONS = [
  { value: 1 as const, label: 'Alta prioridad' },
  { value: 2 as const, label: 'Media prioridad' },
  { value: 3 as const, label: 'Baja prioridad' },
] as const;

export const CATEGORY_OPTIONS = [
  { value: 1 as const, label: 'General' },
  { value: 2 as const, label: 'Ocio' },
  { value: 3 as const, label: 'Social' },
  { value: 4 as const, label: 'Bienestar' },
  { value: 5 as const, label: 'Mantenimiento' },
] as const;
