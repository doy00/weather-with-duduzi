import type { TimePeriod, TimeBasedBackground } from '../types/time.types';

// 🧪 Testing override: Set to a specific hour (0-23) to test different time periods
// Examples: 6 (dawn), 10 (morning), 14 (afternoon), 18 (evening), 22 (night)
// Set to null to use actual system time
const TEST_HOUR_OVERRIDE: number | null = null;

/**
 * Maps hour (0-23) to time period
 */
export function getTimePeriod(hour: number): TimePeriod {
  // Apply test override if set
  if (TEST_HOUR_OVERRIDE !== null) {
    hour = TEST_HOUR_OVERRIDE;
  }

  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'evening';
  return 'night'; // 20-4
}

/**
 * Returns gradient Tailwind classes based on time period
 */
export function getGradientClasses(timePeriod: TimePeriod): string {
  const gradientMap: Record<TimePeriod, string> = {
    dawn: 'from-dawn-start to-dawn-end',
    morning: 'from-morning-start to-morning-end',
    afternoon: 'from-afternoon-start to-afternoon-end',
    evening: 'from-evening-start to-evening-end',
    night: 'from-night-start to-night-end',
  };

  return gradientMap[timePeriod];
}

/**
 * Gets time-based background gradient classes for current hour
 */
export function getTimeBasedGradient(hour: number): TimeBasedBackground {
  const timePeriod = getTimePeriod(hour);
  const gradientClasses = getGradientClasses(timePeriod);

  return {
    timePeriod,
    gradientClasses,
  };
}
