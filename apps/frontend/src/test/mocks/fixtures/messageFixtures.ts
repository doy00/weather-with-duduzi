import type { MessageData } from '@/types/message.types';

export const mockMessages: MessageData[] = [
  {
    id: 1,
    textKey: 'test.rain',
    conditions: { type: 'weather', weatherMain: 'Rain' },
    priority: 80,
  },
  {
    id: 2,
    textKey: 'test.snow',
    conditions: { type: 'weather', weatherMain: 'Snow' },
    priority: 80,
  },
  {
    id: 3,
    textKey: 'test.cold',
    conditions: { type: 'temperature', feelsLike: { min: null, max: 5 } },
    priority: 70,
  },
  {
    id: 4,
    textKey: 'test.hot',
    conditions: { type: 'temperature', feelsLike: { min: 28, max: null } },
    priority: 70,
  },
  {
    id: 5,
    textKey: 'test.newYear',
    conditions: { type: 'specificDate', date: '01-01' },
    priority: 100,
  },
  {
    id: 6,
    textKey: 'test.christmas',
    conditions: { type: 'specificDate', date: '12-25' },
    priority: 100,
  },
  {
    id: 7,
    textKey: 'test.default',
    conditions: { type: 'default' },
    priority: 10,
  },
];
