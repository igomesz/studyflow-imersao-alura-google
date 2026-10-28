import React, { useState, useMemo } from 'react';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';
import { GoalStatus, StudyGoal } from '../types/goal';
import { GoalCard } from './GoalCard';
import { EmptyState } from './EmptyState';

interface GoalListProps {
  goals: StudyGoal[];
  onEdit: (goal: StudyGoal) => void;
  onRequestDelete: (goal: StudyGoal) => void;
  onQuickStatusChange: (id: string, newStatus: GoalStatus) => void;
  onOpenCreateModal: () => void;
  onRestoreExamples: () => void;
}

type FilterOption = 'todos' | GoalStatus;
type SortOption = 'prazo_proximo' | 'mais_recentes' | 'alfabetico';

export const GoalList: React.FC<GoalListProps> = ({
  goals,
  onEdit,
  onRequestDelete,
  onQuickStatusChange,
  onOpenCreateModal,
  onRestoreExamples,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('prazo_proximo');

  // Filtragem e ordenação computadas
  const filteredAndSortedGoals = useMemo(() => {
    let result = [...goals];

    // Filtro por status
    if (activeFilter !== 'todos') {
      result = result.filter((g) => g.status === activeFilter);
    }

    // Filtro por busca textual
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(query) ||
          g.description.toLowerCase().includes(query)
      );
    }

    // Ordenação
    result.sort((a, b) => {
      if (sortBy === 'prazo_proximo') {
        // Concluídos vão para o final quando ordenando por prazo
        if (a.status === 'concluido' && b.status !== 'concluido') return 1;
        if (a.status !== 'concluido' && b.status === 'concluido') return -1;
        return a.deadline.localeCompare(b.deadline);
      }
      if (sortBy === 'mais_recentes') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'alfabetico') {
        return a.title.localeCompare(b.title, 'pt-BR');
      }
      return 0;
    });

    return result;
  }, [goals, activeFilter, searchTerm, sortBy]);

  // Se não há nenhum objetivo em toda a base
  if (goals.length === 0) {
    return (
      <EmptyState
        onOpenCreateModal={onOpenCreateModal}
        onRestoreExamples={onRestoreExamples}
      />
    );
  }

  const isFiltered = activeFilter !== 'todos' || searchTerm.trim().length > 0;

  return (
    <section aria-labelledby="goals-section-title" className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
        
        {/* Barra de Filtros por Status */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveFilter('todos')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'todos'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Todos ({goals.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('em_andamento')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'em_andamento'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Em andamento ({goals.filter((g) => g.status === 'em_andamento').length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('nao_iniciado')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'nao_iniciado'
                ? 'bg-stone-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Não iniciados ({goals.filter((g) => g.status === 'nao_iniciado').length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('concluido')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'concluido'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Concluídos ({goals.filter((g) => g.status === 'concluido').length})
          </button>
        </div>

        {/* Busca e Ordenação */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Campo de Busca */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por termo..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 bg-stone-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Seletor de Ordenação */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-2.5 py-1.5 rounded-xl border border-stone-200 bg-stone-50/70 text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
            >
              <option value="prazo_proximo">Prazo mais próximo</option>
              <option value="mais_recentes">Mais recentes primeiro</option>
              <option value="alfabetico">Ordem alfabética (A-Z)</option>
            </select>
          </div>
        </div>

      </div>

      {/* Grid de Cards ou Estado Filtrado Vazio */}
      {filteredAndSortedGoals.length === 0 ? (
        <EmptyState
          isFiltered={isFiltered}
          onOpenCreateModal={onOpenCreateModal}
          onClearFilters={() => {
            setActiveFilter('todos');
            setSearchTerm('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAndSortedGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={onEdit}
              onRequestDelete={onRequestDelete}
              onQuickStatusChange={onQuickStatusChange}
            />
          ))}
        </div>
      )}
    </section>
  );
};
