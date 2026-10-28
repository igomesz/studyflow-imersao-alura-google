import React from 'react';
import { BookMarked, Plus, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onOpenCreateModal: () => void;
  onRestoreExamples?: () => void;
  isFiltered?: boolean;
  onClearFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onOpenCreateModal,
  onRestoreExamples,
  isFiltered = false,
  onClearFilters,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center max-w-md mx-auto my-8">
        <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-500 mb-3">
          <BookMarked className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-stone-900 mb-1">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-sm text-stone-600 mb-4">
          Não encontramos objetivos correspondentes aos filtros ou à busca aplicada.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            Limpar filtros e ver todos
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-8 sm:p-12 text-center max-w-lg mx-auto my-6">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-xs">
        <BookMarked className="w-8 h-8" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-2 font-sans">
        Você ainda não tem objetivos cadastrados
      </h3>
      
      <p className="text-sm text-stone-600 max-w-md mx-auto mb-6 leading-relaxed">
        Não se preocupe com perfeição! O segredo é escolher um pequeno tópico que você quer aprender e dar o primeiro passo hoje.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar meu primeiro objetivo</span>
        </button>

        {onRestoreExamples && (
          <button
            type="button"
            onClick={onRestoreExamples}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-sm font-medium transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Carregar exemplos prontos</span>
          </button>
        )}
      </div>
    </div>
  );
};
