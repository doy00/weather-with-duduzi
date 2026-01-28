import type { MessageData } from '@/types/message.types';

export const mockMessages: MessageData[] = [
  {
    id: 1,
    text: '비가 오는 날이에요 🌧️',
    conditions: { type: 'weather', weatherMain: 'Rain' },
    priority: 80,
  },
  {
    id: 2,
    text: '눈이 내리는 날이에요 ❄️',
    conditions: { type: 'weather', weatherMain: 'Snow' },
    priority: 80,
  },
  {
    id: 3,
    text: '추운 날씨네요 🥶',
    conditions: { type: 'temperature', feelsLike: { min: null, max: 5 } },
    priority: 70,
  },
  {
    id: 4,
    text: '더운 날씨네요 🔥',
    conditions: { type: 'temperature', feelsLike: { min: 28, max: null } },
    priority: 70,
  },
  {
    id: 5,
    text: '새해 복 많이 받으세요! 🎉',
    conditions: { type: 'specificDate', date: '01-01' },
    priority: 100,
  },
  {
    id: 6,
    text: '크리스마스입니다! 🎄',
    conditions: { type: 'specificDate', date: '12-25' },
    priority: 100,
  },
  {
    id: 7,
    text: '좋은 하루 보내세요!',
    conditions: { type: 'default' },
    priority: 10,
  },
];
