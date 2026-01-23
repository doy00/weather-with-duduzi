import React, { useEffect } from 'react';
import { Search, ChevronLeft, X, AlertCircle } from 'lucide-react';
import { GlassCard } from '@/features/shared/components/GlassCard';
import { POPULAR_CITIES } from '@/features/location/constants/regions';
import { AutocompleteList } from '@/features/location/components/AutocompleteList';
import { Portal } from '@/features/shared/components/Portal';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

interface SearchOverlayProps {
  isOpen: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClose: () => void;
  onSelectLocation: (location: string) => void;
  searchResults: string[];
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  searchQuery,
  onSearchChange,
  onClose,
  onSelectLocation,
  searchResults,
}) => {
  // Body scroll lock
  useBodyScrollLock(isOpen);

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Portal>
    <div className="fixed inset-0 z-50 bg-galaxy-blue-start flex flex-col animate-in slide-in-from-bottom duration-500">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onClose} className="p-2 glass rounded-full">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 glass rounded-2xl flex items-center px-4 border border-white/20">
            <Search size={18} className="opacity-50" />
            <input
              autoFocus
              placeholder="지역 이름 또는 동 이름 (예: 청운동)"
              className="bg-transparent border-none outline-none py-4 px-3 flex-1 placeholder:text-white/40 text-white font-medium"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <X
                size={20}
                onClick={() => onSearchChange("")}
                className="cursor-pointer opacity-60"
              />
            )}
          </div>
        </div>

        <div className="overflow-y-auto custom-scrollbar max-h-[70vh]">
          {searchQuery.length > 0 ? (
            searchResults.length > 0 ? (
              <AutocompleteList results={searchResults} onSelect={onSelectLocation} />
            ) : (
              <div className="flex flex-col items-center py-20 opacity-60">
                <AlertCircle size={40} className="mb-4" />
                <p className="font-bold text-lg">해당 장소의 정보가 제공되지 않습니다.</p>
              </div>
            )
          ) : (
            <div className="flex flex-col gap-6">
              <p className="text-xs font-black opacity-50 uppercase tracking-widest px-2">
                인기 도시
              </p>
              <div className="grid grid-cols-2 gap-4">
                {POPULAR_CITIES.map(city => (
                  <button
                    key={city}
                    onClick={() => onSelectLocation(city)}
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
    </Portal>
  );
};
