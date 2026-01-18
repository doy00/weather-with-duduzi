import { WeatherData } from '../../../types/weather.types';

export const getWeatherSuggestion = (data: WeatherData | undefined): string => {
  if (!data) return "날씨 정보를 확인하고 있습니다...";

  const main = data.weather[0].main.toLowerCase();
  const temp = data.main.temp;

  if (main.includes('rain') || main.includes('drizzle')) {
    return "비가 오고 있어요. 외출 시 우산을 챙기세요! ☂️";
  }
  if (main.includes('snow')) {
    return "눈이 내리고 있습니다. 길이 미끄러우니 주의하세요. ❄️";
  }
  if (temp < 5) {
    return "날씨가 꽤 춥습니다. 따뜻한 옷차림으로 체온을 유지하세요. 🧣";
  }
  if (temp > 28) {
    return "무더운 날씨입니다. 충분한 수분을 섭취하고 휴식을 취하세요. ☀️";
  }
  return "맑고 쾌적한 날씨입니다. 기분 좋은 하루 보내세요! 😊";
};
