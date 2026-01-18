export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°`;
};

export const formatHour = (timestamp: number, index: number): string => {
  if (index === 0) return "지금";
  const hours = new Date(timestamp * 1000).getHours();
  return `${hours}시`;
};
