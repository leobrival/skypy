import { useEffect } from 'react';
import { getRandomTailwindColor } from '@/lib/colors';

/**
 * Hook to manage random text selection color
 * Changes the selection color on every click
 */
export function useRandomSelectionColor() {
  useEffect(() => {
    // Function to update the selection color
    const updateSelectionColor = () => {
      const color = getRandomTailwindColor();
      
      // Create or update CSS rule for selection
      const style = document.createElement('style');
      style.textContent = `
        ::selection {
          background-color: ${color};
          color: white;
        }
        ::-moz-selection {
          background-color: ${color};
          color: white;
        }
      `;

      // Remove old rule if exists
      const existingStyle = document.querySelector('style[data-selection-color]');
      if (existingStyle) {
        existingStyle.remove();
      }

      // Add new rule
      style.setAttribute('data-selection-color', '');
      document.head.appendChild(style);
    };

    // Update initial color
    updateSelectionColor();

    // Update color on click
    const handleClick = () => {
      updateSelectionColor();
    };

    document.addEventListener('click', handleClick);

    // Cleanup function
    return () => {
      document.removeEventListener('click', handleClick);
      const style = document.querySelector('style[data-selection-color]');
      if (style) {
        style.remove();
      }
    };
  }, []);
}
