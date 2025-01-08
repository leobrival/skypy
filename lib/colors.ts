import { z } from 'zod';

// Define Tailwind 400 colors schema
const tailwindColorSchema = z.object({
  slate: z.string().regex(/^#[0-9a-f]{6}$/i),
  gray: z.string().regex(/^#[0-9a-f]{6}$/i),
  zinc: z.string().regex(/^#[0-9a-f]{6}$/i),
  neutral: z.string().regex(/^#[0-9a-f]{6}$/i),
  stone: z.string().regex(/^#[0-9a-f]{6}$/i),
  red: z.string().regex(/^#[0-9a-f]{6}$/i),
  orange: z.string().regex(/^#[0-9a-f]{6}$/i),
  amber: z.string().regex(/^#[0-9a-f]{6}$/i),
  yellow: z.string().regex(/^#[0-9a-f]{6}$/i),
  lime: z.string().regex(/^#[0-9a-f]{6}$/i),
  green: z.string().regex(/^#[0-9a-f]{6}$/i),
  emerald: z.string().regex(/^#[0-9a-f]{6}$/i),
  teal: z.string().regex(/^#[0-9a-f]{6}$/i),
  cyan: z.string().regex(/^#[0-9a-f]{6}$/i),
  sky: z.string().regex(/^#[0-9a-f]{6}$/i),
  blue: z.string().regex(/^#[0-9a-f]{6}$/i),
  indigo: z.string().regex(/^#[0-9a-f]{6}$/i),
  violet: z.string().regex(/^#[0-9a-f]{6}$/i),
  purple: z.string().regex(/^#[0-9a-f]{6}$/i),
  fuchsia: z.string().regex(/^#[0-9a-f]{6}$/i),
  pink: z.string().regex(/^#[0-9a-f]{6}$/i),
  rose: z.string().regex(/^#[0-9a-f]{6}$/i),
});

// Couleurs Tailwind 400
export const TAILWIND_400_COLORS = {
  slate: '#94a3b8',
  gray: '#9ca3af',
  zinc: '#a1a1aa',
  neutral: '#a3a3a3',
  stone: '#a8a29e',
  red: '#f87171',
  orange: '#fb923c',
  amber: '#fbbf24',
  yellow: '#facc15',
  lime: '#a3e635',
  green: '#4ade80',
  emerald: '#34d399',
  teal: '#2dd4bf',
  cyan: '#22d3ee',
  sky: '#38bdf8',
  blue: '#60a5fa',
  indigo: '#818cf8',
  violet: '#a78bfa',
  purple: '#c084fc',
  fuchsia: '#e879f9',
  pink: '#f472b6',
  rose: '#fb7185',
} as const;

// Validate colors at runtime
tailwindColorSchema.parse(TAILWIND_400_COLORS);

// Type for color names
export type TailwindColor = keyof typeof TAILWIND_400_COLORS;

// Type for the color object
export type TailwindColorObject = typeof TAILWIND_400_COLORS;

/**
 * Get a random Tailwind color from the available colors
 * @returns A random color hex value
 */
export function getRandomTailwindColor(): string {
  const colors = Object.values(TAILWIND_400_COLORS);
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

/**
 * Get the name of a Tailwind color from its hex value
 * @param color - The hex color value to look up
 * @returns The name of the color or undefined if not found
 */
export function getTailwindColorName(color: string): TailwindColor | undefined {
  const entries = Object.entries(TAILWIND_400_COLORS);
  const found = entries.find(([_, value]) => value === color);
  return found ? (found[0] as TailwindColor) : undefined;
}
