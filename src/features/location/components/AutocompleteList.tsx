import React from 'react';
import { Plus } from 'lucide-react';
import { GlassCard } from '../../shared/components/GlassCard';

interface AutocompleteListProps {
  results: string[];
  onSelect: (location: string) => void;
  emptyMessage?: string;
}

export const AutocompleteList: React.FC<AutocompleteListProps> = ({
  results,
  onSelect,
  emptyMessage = "검색 결과가 없습니다.",
}) => (
  <div className="flex flex-col gap-3">
    {results.length > 0 ? (
      results.map((result, i) => (
        <button
          key={i}
          onClick={() => onSelect(result)}
          className="glass text-left p-5 rounded-3xl hover:bg-white/30 active:scale-[0.98] transition-all flex items-center justify-between group"
        >
          <span className="font-bold text-lg">{result}</span>
          <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/40">
            <Plus size={20} />
          </div>
        </button>
      ))
    ) : (
      <div className="flex flex-col items-center py-20 opacity-60">
        <p className="font-bold text-lg">{emptyMessage}</p>
      </div>
    )}
  </div>
);
