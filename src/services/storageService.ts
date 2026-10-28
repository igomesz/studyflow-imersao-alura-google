import { GoalFormData, GoalStatus, StudyGoal } from '../types/goal';

const STORAGE_KEY = 'studyflow_goals_v1';

// Dados de exemplo acolhedores para estudantes iniciantes na primeira visita
const INITIAL_GOALS: StudyGoal[] = [
  {
    id: 'seed-1',
    title: 'Fundamentos de Lógica e Algoritmos',
    description: 'Compreender variáveis, condicionais (if/else) e estruturas de repetição com exercícios práticos.',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'em_andamento',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seed-2',
    title: 'Praticar Vocabulário em Inglês Técnico',
    description: 'Anotar e revisar 15 novos termos técnicos de tecnologia em flashcards ou caderno.',
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'nao_iniciado',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seed-3',
    title: 'Organizar Espaço e Horários de Estudo',
    description: 'Definir uma rotina de 45 minutos diários sem celular e preparar caderno de anotações.',
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'concluido',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const storageService = {
  /**
   * Obtém todos os objetivos armazenados no localStorage.
   * Se for a primeira vez do usuário, carrega exemplos introdutórios.
   */
  getGoals(): StudyGoal[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Inicializa com dados amigáveis de exemplo
        this.saveGoals(INITIAL_GOALS);
        return INITIAL_GOALS;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista completa de objetivos no localStorage.
   */
  saveGoals(goals: StudyGoal[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Cria um novo objetivo e persiste no armazenamento.
   */
  createGoal(data: GoalFormData): StudyGoal {
    const goals = this.getGoals();
    const now = new Date().toISOString();
    const newGoal: StudyGoal = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `goal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      status: data.status,
      createdAt: now,
      updatedAt: now,
    };

    const updatedList = [newGoal, ...goals];
    this.saveGoals(updatedList);
    return newGoal;
  },

  /**
   * Atualiza um objetivo existente pelo ID.
   */
  updateGoal(id: string, updates: Partial<GoalFormData>): StudyGoal | null {
    const goals = this.getGoals();
    const index = goals.findIndex((g) => g.id === id);

    if (index === -1) return null;

    const current = goals[index];
    const updatedGoal: StudyGoal = {
      ...current,
      title: updates.title !== undefined ? updates.title.trim() : current.title,
      description: updates.description !== undefined ? updates.description.trim() : current.description,
      deadline: updates.deadline !== undefined ? updates.deadline : current.deadline,
      status: updates.status !== undefined ? updates.status : current.status,
      updatedAt: new Date().toISOString(),
    };

    goals[index] = updatedGoal;
    this.saveGoals(goals);
    return updatedGoal;
  },

  /**
   * Alterna rapidamente o status de um objetivo.
   */
  updateStatus(id: string, status: GoalStatus): StudyGoal | null {
    return this.updateGoal(id, { status });
  },

  /**
   * Remove um objetivo pelo ID.
   */
  deleteGoal(id: string): boolean {
    const goals = this.getGoals();
    const filtered = goals.filter((g) => g.id !== id);
    if (filtered.length !== goals.length) {
      this.saveGoals(filtered);
      return true;
    }
    return false;
  },

  /**
   * Remove todos os objetivos (útil para limpar dados).
   */
  clearAllGoals(): void {
    this.saveGoals([]);
  },
};
