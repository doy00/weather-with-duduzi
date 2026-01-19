import { WeatherData } from '@/types/weather.types';
import { MessageData } from '@/types/message.types';

const getRandomMessage = (messages: MessageData[]): MessageData | undefined => {
  if (messages.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

export const getBubbleMessage = (
  weather: WeatherData,
  messages: MessageData[]
): string => {
  const today = new Date();
  const monthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const feelsLike = Math.round(weather.main.feels_like);
  const weatherMain = weather.weather[0]?.main;

  // Filter messages by matching conditions
  const matchedMessages = messages.filter((message) => {
    const { type, date, weatherMain: msgWeather, feelsLike: tempRange } = message.conditions;

    if (type === 'specificDate') {
      if (date) {
        // Support both "YYYY-MM-DD" (specific year) and "MM-DD" (repeats every year)
        if (date.length === 10) {
          // Full date with year
          const fullDate = `${today.getFullYear()}-${monthDay}`;
          return date === fullDate;
        } else {
          // Month-day only (repeats every year)
          return date === monthDay;
        }
      }
      return false;
    }

    if (type === 'weather') {
      // Match weather condition
      return weatherMain === msgWeather;
    }

    if (type === 'temperature') {
      // Match temperature range
      if (tempRange) {
        const { min, max } = tempRange;
        const minMatch = min === null || feelsLike >= min;
        const maxMatch = max === null || feelsLike <= max;
        return minMatch && maxMatch;
      }
      return false;
    }

    if (type === 'default') {
      // Default message always matches
      return true;
    }

    return false;
  });

  // Sort by priority (highest first) and get random message from highest priority group
  const sortedMessages = matchedMessages.sort((a, b) => b.priority - a.priority);
  const highestPriority = sortedMessages[0]?.priority;
  const highestPriorityMessages = sortedMessages.filter(msg => msg.priority === highestPriority);
  const selectedMessage = getRandomMessage(highestPriorityMessages);

  // Return selected message or fallback to default
  return selectedMessage?.text || 'Error: No message found';
};

export const getDogBubbleMessage = (
  weather: WeatherData,
  messages: MessageData[]
): string => {
  return getBubbleMessage(weather, messages);
};
