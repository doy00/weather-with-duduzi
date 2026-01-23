import { WeatherData, HourlyWeather } from '@/types/weather.types';

export const getWeatherDescription = (weatherMain: string, description: string): string => {
  const main = weatherMain.toLowerCase();

  // 날씨 상태를 쉬운 한국어로 변환
  const weatherMap: Record<string, string> = {
    clear: '맑음',
    clouds: '구름 조금',
    rain: '비',
    drizzle: '이슬비',
    snow: '눈',
    thunderstorm: '천둥번개',
    mist: '안개',
    fog: '안개',
    haze: '안개',
    dust: '먼지',
    sand: '황사',
    smoke: '연기',
    ash: '화산재',
    squall: '돌풍',
    tornado: '토네이도',
  };

  // main 값으로 매핑, 없으면 원본 description 사용
  return weatherMap[main] || description;
};

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

export const calculateDailyMinMax = (hourlyData: HourlyWeather | undefined): { min: number; max: number } | null => {
  if (!hourlyData || !hourlyData.list.length) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayTimestamps = hourlyData.list.filter(item => {
    const itemDate = new Date(item.dt * 1000);
    return itemDate >= today && itemDate < tomorrow;
  });

  if (todayTimestamps.length === 0) return null;

  const temps = todayTimestamps.map(item => item.main.temp);
  return {
    min: Math.min(...temps),
    max: Math.max(...temps)
  };
};
