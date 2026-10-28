import React from 'react';
import { CheckCircle2, Clock, ListTodo, PlayCircle, Trophy } from 'lucide-react';
import { GoalStats } from '../types/goal';

interface StatsOverviewProps {
  stats: GoalStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  // Mensagem acolhedora de acordo com o progresso
  const getMotivationalMessage = () => {
    if (stats.total === 0) {
      return 'Nenhum objetivo no momento. Que tal dar o primeiro passo hoje?';
    }
    if (stats.concluidos === stats.total) {
      return '🎉 Incrível! Você completou todos os seus objetivos cadastrados. Parabéns pela dedicação!';
    }
    if (stats.progressoPorcentagem >= 50) {
      return '🚀 Excelente ritmo! Mais da metade dos seus objetivos já foram alcançados.';
    }
    if (stats.emAndamento > 0) {
      return '💡 Foco e consistência: o progresso diário é o segredo do bom aprendizado.';
    }
    return '🌱 Seus objetivos estão prontos. Escolha um para começar quando se sentir confortável!';
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6 mb-8 transition-all">
      {/* Topo com Quantidade Principal e Barra de Progresso */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
              Resumo dos seus estudos
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
              {stats.total} {stats.total === 1 ? 'objetivo' : 'objetivos no total'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {getMotivationalMessage()}
          </p>
        </div>

        {/* Indicador de Conclusão */}
        {stats.total > 0 && (
          <div className="w-full md:w-64 bg-stone-50 p-3 rounded-xl border border-stone-200/70">
            <div className="flex items-center justify-between text-xs font-medium text-stone-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                Conclusão geral
              </span>
              <span className="font-bold text-emerald-700">
                {stats.progressoPorcentagem}%
              </span>
            </div>
            <div className="w-full bg-stone-200/80 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${stats.progressoPorcentagem}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Grid de Contadores dos Status */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-5">
        
        {/* Total Geral */}
        <div className="bg-stone-50/70 hover:bg-stone-50 p-3.5 rounded-xl border border-stone-200/60 transition-colors">
          <div className="flex items-center gap-2 text-stone-600 mb-1">
            <ListTodo className="w-4 h-4 text-stone-700" />
            <span className="text-xs font-medium">Cadastrados</span>
          </div>
          <div className="text-2xl font-bold text-stone-900">
            {stats.total}
          </div>
          <span className="text-[11px] text-stone-500">
            {stats.total === 1 ? '1 meta listada' : `${stats.total} metas listadas`}
          </span>
        </div>

        {/* Não Iniciados */}
        <div className="bg-stone-50/70 hover:bg-stone-50 p-3.5 rounded-xl border border-stone-200/60 transition-colors">
          <div className="flex items-center gap-2 text-stone-600 mb-1">
            <Clock className="w-4 h-4 text-stone-500" />
            <span className="text-xs font-medium">Não iniciados</span>
          </div>
          <div className="text-2xl font-bold text-stone-700">
            {stats.naoIniciados}
          </div>
          <span className="text-[11px] text-stone-500">Aguardando início</span>
        </div>

        {/* Em Andamento */}
        <div className="bg-amber-50/50 hover:bg-amber-50/80 p-3.5 rounded-xl border border-amber-200/60 transition-colors">
          <div className="flex items-center gap-2 text-amber-700 mb-1">
            <PlayCircle className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-medium">Em andamento</span>
          </div>
          <div className="text-2xl font-bold text-amber-900">
            {stats.emAndamento}
          </div>
          <span className="text-[11px] text-amber-700/80">Em estudo ativo</span>
        </div>

        {/* Concluídos */}
        <div className="bg-emerald-50/50 hover:bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200/60 transition-colors">
          <div className="flex items-center gap-2 text-emerald-700 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-medium">Concluídos</span>
          </div>
          <div className="text-2xl font-bold text-emerald-900">
            {stats.concluidos}
          </div>
          <span className="text-[11px] text-emerald-700/80">Metas atingidas</span>
        </div>

      </div>
    </div>
  );
};
