/**
 * Utilitários para formatação e cálculo amigável de datas em português do Brasil.
 */

export function formatDateBr(dateString: string): string {
  if (!dateString) return 'Sem prazo definido';
  
  // Trata formato YYYY-MM-DD sem distorção de fuso horário
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString('pt-BR');
}

export interface DeadlineStatus {
  label: string;
  isOverdue: boolean;
  isDueToday: boolean;
  daysRemaining: number;
  badgeClass: string;
}

export function getDeadlineInfo(dateString: string, isCompleted: boolean): DeadlineStatus {
  if (!dateString) {
    return {
      label: 'Sem data',
      isOverdue: false,
      isDueToday: false,
      daysRemaining: 0,
      badgeClass: 'bg-stone-100 text-stone-600 border-stone-200',
    };
  }

  if (isCompleted) {
    return {
      label: `Concluído (${formatDateBr(dateString)})`,
      isOverdue: false,
      isDueToday: false,
      daysRemaining: 0,
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      label: overdueDays === 1 ? 'Venceu ontem' : `Venceu há ${overdueDays} dias`,
      isOverdue: true,
      isDueToday: false,
      daysRemaining: diffDays,
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 font-medium',
    };
  }

  if (diffDays === 0) {
    return {
      label: 'Vence hoje!',
      isOverdue: false,
      isDueToday: true,
      daysRemaining: 0,
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200 font-medium animate-pulse',
    };
  }

  if (diffDays === 1) {
    return {
      label: 'Vence amanhã',
      isOverdue: false,
      isDueToday: false,
      daysRemaining: 1,
      badgeClass: 'bg-amber-50/80 text-amber-700 border-amber-200',
    };
  }

  return {
    label: `Prazo: ${formatDateBr(dateString)} (${diffDays} dias)`,
    isOverdue: false,
    isDueToday: false,
    daysRemaining: diffDays,
    badgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
  };
}
