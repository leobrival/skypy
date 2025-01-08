'use client';

import { useRandomSelectionColor } from '@/hooks/useRandomSelectionColor';
import { z } from 'zod';

// Validate provider props
const selectionColorProviderSchema = z.object({
  children: z.custom<React.ReactNode>((data) => {
    return data !== undefined && data !== null;
  }, 'Must be a valid React node'),
});

type SelectionColorProviderProps = z.infer<typeof selectionColorProviderSchema>;

/**
 * Provider component that manages text selection color
 * Wraps the application to provide random selection colors
 */
export function SelectionColorProvider({ children }: SelectionColorProviderProps) {
  // Validate props at runtime
  selectionColorProviderSchema.parse({ children });

  // Use the hook to manage selection color
  useRandomSelectionColor();

  return <>{children}</>;
}
