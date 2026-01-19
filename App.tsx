
import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { Search, MapPin, Heart, Plus, ChevronLeft, Edit2, X, Info, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { fetchCurrentWeather, fetchHourlyWeather, geocodeLocation } from './services/weatherService';
import { REGIONS } from './constants';
import { FavoriteLocation, LocationItem, WeatherData } from './types';

const GlassCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`glass rounded-3xl p-6 mb-4 transition-all duration-300 ${onClick ? 'cursor-pointer active:scale-95' : ''} ${className}`}
  >
    {children}
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<'main' | 'search'>('main');
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nicknameInput, setNicknameInput] = useState("");
  const [locationStatus, setLocationStatus] = useState<string>("위치 정보 확인 중...");

  // Initialize: Geolocation with timeout and explicit error handling
  const initLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("브라우저가 위치 정보를 지원하지 않습니다.");
      setDefaultLocation();
      return;
    }

    setLocationStatus("사용자 위치를 파악하고 있습니다...");
    
    const geoOptions = {
      enableHighAccuracy: false,
      timeout: 5000, // 5 seconds timeout
      maximumAge: Infinity
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setCurrentCoords(coords);
        const initialLoc = {
          id: 'current',
          fullName: '내 위치',
          name: '내 위치',
          lat: coords.lat,
          lon: coords.lon
        };
        setSelectedLocation(initialLoc);
        setLocationStatus("");
      },
      (err) => {
        console.warn(`Geolocation error (${err.code}): ${err.message}`);
        setLocationStatus("위치 정보를 가져올 수 없어 기본 위치(서울)를 사용합니다.");
        setDefaultLocation();
      },
      geoOptions
    );
  };

  const setDefaultLocation = () => {
    const seoul = { lat: 37.5665, lon: 126.9780 };
    setCurrentCoords(seoul);
    setSelectedLocation({
      id: 'seoul',
      fullName: '서울특별시',
      name: '서울특별시',
      lat: seoul.lat,
      lon: seoul.lon
    });
  };

  useEffect(() => {
    initLocation();
    const saved = localStorage.getItem('weather_favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // Main Weather Query
  const lat = selectedLocation?.lat || currentCoords?.lat || 0;
  const lon = selectedLocation?.lon || currentCoords?.lon || 0;

  const { data: weather, isLoading: isWeatherLoading, isError: isWeatherError, error: weatherError, refetch: refetchWeather } = useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => fetchCurrentWeather(lat, lon),
    enabled: !!lat && !!lon,
    retry: 1
  });

  const { data: hourly } = useQuery({
    queryKey: ['hourly', lat, lon],
    queryFn: () => fetchHourlyWeather(lat, lon),
    enabled: !!lat && !!lon,
  });

  // Queries for Favorite Cards
  const favoriteWeatherResults = useQueries<WeatherData[]>({
    queries: favorites.map(fav => ({
      queryKey: ['weather', fav.lat, fav.lon],
      queryFn: () => fetchCurrentWeather(fav.lat, fav.lon),
      staleTime: 1000 * 60 * 5,
    }))
  });

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    return REGIONS.filter(r => r.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 15);
  }, [searchQuery]);

  const getWeatherSuggestion = (data: WeatherData | undefined) => {
    if (!data) return "날씨 정보를 확인하고 있습니다...";
    const main = data.weather[0].main.toLowerCase();
    const temp = data.main.temp;
    if (main.includes('rain') || main.includes('drizzle')) return "비가 오고 있어요. 외출 시 우산을 챙기세요! ☂️";
    if (main.includes('snow')) return "눈이 내리고 있습니다. 길이 미끄러우니 주의하세요. ❄️";
    if (temp < 5) return "날씨가 꽤 춥습니다. 따뜻한 옷차림으로 체온을 유지하세요. 🧣";
    if (temp > 28) return "무더운 날씨입니다. 충분한 수분을 섭취하고 휴식을 취하세요. ☀️";
    return "맑고 쾌적한 날씨입니다. 기분 좋은 하루 보내세요! 😊";
  };

  const handleSelectLocation = async (fullName: string) => {
    const parts = fullName.split('-');
    const name = parts[parts.length - 1];
    try {
      const geo = await geocodeLocation(name);
      if (geo && geo.length > 0) {
        setSelectedLocation({
          id: Date.now().toString(),
          fullName,
          name,
          lat: geo[0].lat,
          lon: geo[0].lon
        });
        setView('main');
        setSearchQuery("");
      } else {
        alert("해당 장소의 위치 정보를 찾을 수 없습니다.");
      }
    } catch {
      alert("날씨 정보를 가져오는 중 오류가 발생했습니다.");
    }
  };

  const toggleFavorite = () => {
    if (!selectedLocation) return;
    const isFav = favorites.find(f => f.fullName === selectedLocation.fullName);
    if (isFav) {
      const newFavs = favorites.filter(f => f.fullName !== selectedLocation.fullName);
      setFavorites(newFavs);
      localStorage.setItem('weather_favorites', JSON.stringify(newFavs));
    } else {
      if (favorites.length >= 6) {
        alert("즐겨찾기는 최대 6개까지 가능합니다.");
        return;
      }
      const newFavs = [...favorites, { ...selectedLocation, id: Date.now().toString() }];
      setFavorites(newFavs);
      localStorage.setItem('weather_favorites', JSON.stringify(newFavs));
    }
  };

  const saveNickname = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = favorites.map(f => f.id === id ? { ...f, nickname: nicknameInput } : f);
    setFavorites(updated);
    localStorage.setItem('weather_favorites', JSON.stringify(updated));
    setEditingId(null);
  };

  const removeFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavs = favorites.filter(f => f.id !== id);
    setFavorites(newFavs);
    localStorage.setItem('weather_favorites', JSON.stringify(newFavs));
  };

  // UI for loading state
  if ((isWeatherLoading || locationStatus) && !weather) return (
    <div className="flex flex-col items-center justify-center h-screen text-white bg-gradient-to-b from-[#4facfe] to-[#00f2fe] p-10 text-center">
      <Loader2 size={48} className="animate-spin mb-6 text-white/80" />
      <p className="font-bold text-2xl mb-2">날씨를 불러오고 있습니다</p>
      <p className="opacity-70 text-lg">{locationStatus || "전 세계 기상 데이터를 확인 중..."}</p>
    </div>
  );

  // UI for error state
  if (isWeatherError) return (
    <div className="flex flex-col items-center justify-center h-screen text-white bg-gradient-to-b from-[#4facfe] to-[#00f2fe] p-6 text-center">
      <AlertCircle size={64} className="mb-6 text-white/50" />
      <p className="font-bold text-2xl mb-2">날씨 데이터를 가져올 수 없습니다.</p>
      <p className="opacity-70 mb-8 leading-relaxed">
        API 키가 아직 활성화되지 않았거나,<br/>네트워크 연결 상태가 불안정합니다.
      </p>
      <button 
        onClick={() => refetchWeather()} 
        className="glass px-8 py-4 rounded-3xl font-bold flex items-center gap-2 active:scale-95 transition-all"
      >
        <RefreshCw size={20} /> 다시 시도
      </button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen text-white relative flex flex-col">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#4facfe] to-[#00f2fe]"></div>
      
      <div className="relative z-10 px-4 pt-8 pb-20 flex-1 overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => setView('search')} className="p-3 glass rounded-full active:scale-90 transition-all">
            <Search size={24} />
          </button>
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-white/80" />
            <h1 className="text-xl font-bold tracking-tight">{selectedLocation?.name}</h1>
          </div>
          <button onClick={toggleFavorite} className="p-3 glass rounded-full active:scale-90 transition-all">
            <Heart size={24} fill={favorites.some(f => f.fullName === selectedLocation?.fullName) ? "white" : "none"} />
          </button>
        </div>

        {/* Main Weather Display */}
        {weather && (
          <div className="text-center mb-10 animate-in fade-in zoom-in duration-500">
            <p className="text-[100px] font-thin leading-none mb-4 tracking-tighter">{Math.round(weather.main.temp)}°</p>
            <div className="flex justify-center gap-4 text-xl font-semibold opacity-90">
              <span className="flex items-center gap-1">↑{Math.round(weather.main.temp_max)}°</span>
              <span className="opacity-40">|</span>
              <span className="flex items-center gap-1">↓{Math.round(weather.main.temp_min)}°</span>
            </div>
            <p className="mt-4 text-2xl font-light opacity-90">{weather.weather[0].description}</p>
          </div>
        )}

        {/* Smart Suggestion Section (Shortcut Logic) */}
        <GlassCard className="bg-white/10 border-white/20 mb-6">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-2.5 rounded-2xl">
              <Info className="text-white" size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">스마트 기상 브리핑</p>
              <p className="text-[15px] font-semibold leading-relaxed">
                {getWeatherSuggestion(weather)}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Hourly Forecast */}
        <GlassCard>
          <h3 className="text-xs font-black opacity-60 mb-6 uppercase tracking-widest">오늘의 시간대별 날씨</h3>
          <div className="flex overflow-x-auto gap-8 pb-4 custom-scrollbar">
            {hourly?.list.slice(0, 15).map((item, idx) => (
              <div key={idx} className="flex flex-col items-center min-w-[55px] animate-in fade-in slide-in-from-right-2 duration-300" style={{animationDelay: `${idx * 50}ms`}}>
                <span className="text-[11px] font-bold opacity-60 mb-3">
                  {idx === 0 ? "지금" : `${new Date(item.dt * 1000).getHours()}시`}
                </span>
                <img 
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} 
                  alt="weather"
                  className="w-12 h-12 drop-shadow-md"
                />
                <span className="text-lg font-bold mt-2">{Math.round(item.main.temp)}°</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Favorites Grid */}
        {favorites.length > 0 && (
          <div className="mt-10 mb-6">
            <h3 className="text-xs font-black opacity-60 mb-4 uppercase tracking-widest px-2">즐겨찾는 지역</h3>
            <div className="grid grid-cols-2 gap-4">
              {favorites.map((fav, index) => {
                const favWeather = favoriteWeatherResults[index]?.data;
                const favLoading = favoriteWeatherResults[index]?.isLoading;
                
                return (
                  <GlassCard 
                    key={fav.id}
                    onClick={() => { setSelectedLocation(fav); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                    className="p-5 relative"
                  >
                    <button 
                      onClick={(e) => removeFavorite(fav.id, e)}
                      className="absolute top-3 right-3 p-1 glass bg-black/10 rounded-full hover:bg-black/20"
                    >
                      <X size={14} />
                    </button>
                    
                    <div className="flex flex-col h-full justify-between">
                      <div className="mb-4">
                        {editingId === fav.id ? (
                          <div className="flex flex-col gap-2">
                            <input 
                              autoFocus
                              className="bg-white/20 rounded-lg px-2 py-1 text-sm outline-none border border-white/40 text-white"
                              value={nicknameInput}
                              onChange={(e) => setNicknameInput(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <button 
                              onClick={(e) => saveNickname(fav.id, e)}
                              className="text-[10px] font-bold bg-white/40 rounded-md py-1"
                            >완료</button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-start">
                            <span className="text-[15px] font-bold truncate max-w-[100px]">
                              {fav.nickname || fav.name}
                            </span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setEditingId(fav.id); setNicknameInput(fav.nickname || fav.name); }}
                              className="text-[10px] opacity-60 flex items-center gap-1 mt-1 font-semibold"
                            >
                              <Edit2 size={10} /> 별칭
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-end justify-between">
                        {favLoading ? (
                          <div className="w-8 h-8 bg-white/10 animate-pulse rounded-full" />
                        ) : favWeather ? (
                          <>
                            <p className="text-3xl font-light">{Math.round(favWeather.main.temp)}°</p>
                            <div className="text-[10px] font-bold opacity-70 text-right leading-tight">
                              <div>↑{Math.round(favWeather.main.temp_max)}°</div>
                              <div>↓{Math.round(favWeather.main.temp_min)}°</div>
                            </div>
                          </>
                        ) : (
                          <span className="text-[10px] opacity-40">정보 없음</span>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        )}

        {/* Detailed Statistics */}
        {weather && (
          <GlassCard className="mt-4 mb-10">
             <div className="grid grid-cols-2 gap-8 py-2">
                <div className="border-r border-white/10">
                   <p className="text-[11px] font-black opacity-40 mb-2 tracking-widest uppercase">체감 온도</p>
                   <p className="text-2xl font-semibold">{Math.round(weather.main.feels_like)}°</p>
                </div>
                <div className="pl-4">
                   <p className="text-[11px] font-black opacity-40 mb-2 tracking-widest uppercase">습도</p>
                   <p className="text-2xl font-semibold">{weather.main.humidity}%</p>
                </div>
             </div>
          </GlassCard>
        )}
      </div>

      {/* Search Overlay */}
      {view === 'search' && (
        <div className="fixed inset-0 z-50 bg-[#4facfe] flex flex-col animate-in slide-in-from-bottom duration-500">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setView('main')} className="p-2 glass rounded-full">
                <ChevronLeft size={24} />
              </button>
              <div className="flex-1 glass rounded-2xl flex items-center px-4 border border-white/20">
                <Search size={18} className="opacity-50" />
                <input 
                  autoFocus
                  placeholder="지역 이름 또는 동 이름 (예: 청운동)"
                  className="bg-transparent border-none outline-none py-4 px-3 flex-1 placeholder:text-white/40 text-white font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && <X size={20} onClick={() => setSearchQuery("")} className="cursor-pointer opacity-60" />}
              </div>
            </div>
            
            <div className="overflow-y-auto custom-scrollbar max-h-[70vh]">
              {searchQuery.length > 0 ? (
                searchResults.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {searchResults.map((result, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSelectLocation(result)}
                        className="glass text-left p-5 rounded-3xl hover:bg-white/30 active:scale-[0.98] transition-all flex items-center justify-between group"
                      >
                        <span className="font-bold text-lg">{result}</span>
                        <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/40">
                          <Plus size={20} />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-20 opacity-60">
                     <AlertCircle size={40} className="mb-4" />
                     <p className="font-bold text-lg">해당 장소의 정보가 제공되지 않습니다.</p>
                  </div>
                )
              ) : (
                <div className="flex flex-col gap-6">
                  <p className="text-xs font-black opacity-50 uppercase tracking-widest px-2">인기 도시</p>
                  <div className="grid grid-cols-2 gap-4">
                    {['서울특별시', '부산광역시', '제주특별자치도', '인천광역시', '대전광역시', '광주광역시'].map(city => (
                      <button 
                        key={city}
                        onClick={() => handleSelectLocation(city)}
                        className="glass p-5 rounded-3xl text-center font-bold text-lg hover:bg-white/30 active:scale-95 transition-all"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
