export type GoalStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  deadline: string; // Formato YYYY-MM-DD
  status: GoalStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type GoalFormData = Omit<StudyGoal, 'id' | 'createdAt' | 'updatedAt'>;

export interface GoalStats {
  total: number;
  naoIniciados: number;
  emAndamento: number;
  concluidos: number;
  progressoPorcentagem: number;
}
