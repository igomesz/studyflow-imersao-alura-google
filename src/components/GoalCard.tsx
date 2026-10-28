import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  MoreVertical,
  PlayCircle,
  Trash2,
} from 'lucide-react';
import { GoalStatus, StudyGoal } from '../types/goal';
import { formatDateBr, getDeadlineInfo } from '../utils/dateUtils';

interface GoalCardProps {
  goal: StudyGoal;
  onEdit: (goal: StudyGoal) => void;
  onRequestDelete: (goal: StudyGoal) => void;
  onQuickStatusChange: (id: string, newStatus: GoalStatus) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onRequestDelete,
  onQuickStatusChange,
}) => {
  const isCompleted = goal.status === 'concluido';
  const deadlineInfo = getDeadlineInfo(goal.deadline, isCompleted);

  // Mapeamento visual dos status
  const statusConfig: Record<
    GoalStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    nao_iniciado: {
      label: 'Não iniciado',
      bg: 'bg-stone-100',
      text: 'text-stone-700',
      border: 'border-stone-200',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    em_andamento: {
      label: 'Em andamento',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: <PlayCircle className="w-3.5 h-3.5 text-amber-600" />,
    },
    concluido: {
      label: 'Concluído',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
    },
  };

  const currentStatus = statusConfig[goal.status];

  return (
    <article
      className={`group relative bg-white rounded-2xl border transition-all duration-200 hover:shadow-md flex flex-col justify-between overflow-hidden ${
        isCompleted
          ? 'border-emerald-200/80 bg-gradient-to-b from-white to-emerald-50/20'
          : deadlineInfo.isOverdue
          ? 'border-rose-200/80'
          : 'border-stone-200 hover:border-stone-300'
      }`}
    >
      {/* Faixa superior de destaque sutil */}
      <div
        className={`h-1.5 w-full ${
          isCompleted
            ? 'bg-emerald-500'
            : goal.status === 'em_andamento'
            ? 'bg-amber-400'
            : 'bg-stone-300'
        }`}
      />

      <div className="p-5 flex-1 flex flex-col">
        {/* Cabeçalho do Card: Status Badge e Ações */}
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Status Badge Interativo */}
          <div className="relative inline-block">
            <select
              value={goal.status}
              onChange={(e) => onQuickStatusChange(goal.id, e.target.value as GoalStatus)}
              className={`appearance-none cursor-pointer inline-flex items-center gap-1.5 pl-2.5 pr-7 py-1 rounded-full text-xs font-semibold border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}
              title="Clique para alterar o status rapidamente"
            >
              <option value="nao_iniciado">⏳ Não iniciado</option>
              <option value="em_andamento">⚡ Em andamento</option>
              <option value="concluido">✅ Concluído</option>
            </select>
            {/* Ícone discreto indicando que é clicável */}
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs opacity-60">
              ▾
            </span>
          </div>

          {/* Botões de Ação: Editar e Excluir */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(goal)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Editar este objetivo"
              aria-label={`Editar ${goal.title}`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onRequestDelete(goal)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Excluir este objetivo"
              aria-label={`Excluir ${goal.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base font-bold tracking-tight text-stone-900 mb-2 leading-snug break-words ${
            isCompleted ? 'line-through text-stone-500' : ''
          }`}
        >
          {goal.title}
        </h3>

        {/* Descrição */}
        {goal.description ? (
          <p
            className={`text-sm text-stone-600 mb-4 whitespace-pre-line line-clamp-3 leading-relaxed flex-1 ${
              isCompleted ? 'text-stone-400' : ''
            }`}
          >
            {goal.description}
          </p>
        ) : (
          <p className="text-xs text-stone-400 italic mb-4 flex-1">
            Nenhuma anotação adicional informada.
          </p>
        )}

        {/* Rodapé do Card: Prazo e Botão Rápido de Concluir */}
        <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Prazo */}
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs ${deadlineInfo.badgeClass}`}
            title={`Prazo definido: ${formatDateBr(goal.deadline)}`}
          >
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{deadlineInfo.label}</span>
          </div>

          {/* Botão de Conclusão Rápida */}
          <button
            type="button"
            onClick={() =>
              onQuickStatusChange(goal.id, isCompleted ? 'em_andamento' : 'concluido')
            }
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              isCompleted
                ? 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isCompleted ? 'Reabrir meta' : 'Marcar concluído'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
