export type TimePeriod = 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';

export interface TimeBasedBackground {
  gradientClasses: string;
  timePeriod: TimePeriod;
}
