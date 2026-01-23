import { useState, useEffect } from 'react';

import { getTimeBasedGradient } from '../utils/time-helpers';

import type { TimeBasedBackground } from '../types/time.types';

/**
 * Hook that returns time-based background gradient classes
 * Automatically updates every minute to reflect current time period
 */
export function useTimeBasedBackground(): TimeBasedBackground {
  const getCurrentBackground = () => {
    const currentHour = new Date().getHours();
    return getTimeBasedGradient(currentHour);
  };

  const [background, setBackground] = useState<TimeBasedBackground>(getCurrentBackground());

  useEffect(() => {
    // Update background every minute
    const intervalId = setInterval(() => {
      const newBackground = getCurrentBackground();

      // Only update state if time period changed (prevents unnecessary re-renders)
      if (newBackground.timePeriod !== background.timePeriod) {
        setBackground(newBackground);
      }
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [background.timePeriod]);

  return background;
}
