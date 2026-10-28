import React, { useEffect, useMemo, useState } from 'react';
import { Check, CheckCircle2, Heart, Plus, Sparkles } from 'lucide-react';
import { ConfirmDialog } from './components/ConfirmDialog';
import { GoalFormModal } from './components/GoalFormModal';
import { GoalList } from './components/GoalList';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { storageService } from './services/storageService';
import { GoalFormData, GoalStats, GoalStatus, StudyGoal } from './types/goal';

export default function App() {
  // Estado principal dos objetivos
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Estados de controle de modais
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<StudyGoal | null>(null);

  // Mensagem de feedback (toast temporário)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Carrega os dados do localStorage na montagem
  useEffect(() => {
    const loadedGoals = storageService.getGoals();
    setGoals(loadedGoals);
    setIsLoaded(true);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3500);
  };

  // Cálculo de estatísticas e quantidades
  const stats: GoalStats = useMemo(() => {
    const total = goals.length;
    const naoIniciados = goals.filter((g) => g.status === 'nao_iniciado').length;
    const emAndamento = goals.filter((g) => g.status === 'em_andamento').length;
    const concluidos = goals.filter((g) => g.status === 'concluido').length;
    const progressoPorcentagem = total > 0 ? Math.round((concluidos / total) * 100) : 0;

    return {
      total,
      naoIniciados,
      emAndamento,
      concluidos,
      progressoPorcentagem,
    };
  }, [goals]);

  // Abertura do formulário para criação
  const handleOpenCreate = () => {
    setEditingGoal(null);
    setIsFormOpen(true);
  };

  // Abertura do formulário para edição
  const handleOpenEdit = (goal: StudyGoal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  // Salvar objetivo (novo ou editado)
  const handleSaveGoal = (formData: GoalFormData, id?: string) => {
    if (id) {
      // Atualização
      const updated = storageService.updateGoal(id, formData);
      if (updated) {
        setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
        showToast('Objetivo atualizado com sucesso!');
      }
    } else {
      // Novo cadastro
      const created = storageService.createGoal(formData);
      setGoals((prev) => [created, ...prev]);
      showToast('Novo objetivo adicionado à sua lista!');
    }
    setIsFormOpen(false);
    setEditingGoal(null);
  };

  // Alteração rápida de status pelo card
  const handleQuickStatusChange = (id: string, newStatus: GoalStatus) => {
    const updated = storageService.updateStatus(id, newStatus);
    if (updated) {
      setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
      if (newStatus === 'concluido') {
        showToast('🎉 Parabéns por concluir mais esta etapa!');
      }
    }
  };

  // Solicitar exclusão (abre confirmação)
  const handleRequestDelete = (goal: StudyGoal) => {
    setDeletingGoal(goal);
  };

  // Confirmar exclusão
  const handleConfirmDelete = () => {
    if (!deletingGoal) return;
    const success = storageService.deleteGoal(deletingGoal.id);
    if (success) {
      setGoals((prev) => prev.filter((g) => g.id !== deletingGoal.id));
      showToast('Objetivo excluído com sucesso.');
    }
    setDeletingGoal(null);
  };

  // Cancelar exclusão
  const handleCancelDelete = () => {
    setDeletingGoal(null);
  };

  // Restaurar dados de exemplo se o usuário desejar
  const handleRestoreExamples = () => {
    localStorage.removeItem('studyflow_goals_v1');
    const freshData = storageService.getGoals();
    setGoals(freshData);
    showToast('Exemplos de estudo carregados com sucesso!');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-stone-600">Preparando seus estudos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Toast Notificação de Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-medium border border-stone-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <Header onOpenCreateModal={handleOpenCreate} />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Banner de Boas-Vindas para Estudantes Iniciantes */}
        <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white mb-2 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Guia para quem está começando
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Construa o hábito de aprender, um passo por vez
            </h2>
            <p className="text-xs sm:text-sm text-emerald-50 mt-1 max-w-2xl leading-relaxed">
              Defina pequenos tópicos, acompanhe o que já começou e celebre as conclusões.
              Seus objetivos ficam salvos automaticamente no seu navegador.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="self-start md:self-center shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-semibold text-sm hover:bg-emerald-50 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Adicionar Objetivo</span>
          </button>
        </div>

        {/* Resumo de Estatísticas e Quantidade de Objetivos */}
        <StatsOverview stats={stats} />

        {/* Lista de Objetivos com Filtros e Ações */}
        <GoalList
          goals={goals}
          onEdit={handleOpenEdit}
          onRequestDelete={handleRequestDelete}
          onQuickStatusChange={handleQuickStatusChange}
          onOpenCreateModal={handleOpenCreate}
          onRestoreExamples={handleRestoreExamples}
        />

      </main>

      {/* Rodapé Acolhedor */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p className="flex items-center gap-1.5">
            <strong>StudyFlow</strong> — Feito para apoiar estudantes em início de jornada.
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleRestoreExamples}
              className="text-stone-500 hover:text-emerald-700 underline underline-offset-4 cursor-pointer"
            >
              Restaurar exemplos
            </button>
            <span className="text-stone-300">•</span>
            <span>Dados salvos localmente</span>
          </div>
        </div>
      </footer>

      {/* Modal de Formulário (Criação ou Edição) */}
      <GoalFormModal
        isOpen={isFormOpen}
        initialGoal={editingGoal}
        onSave={handleSaveGoal}
        onClose={() => {
          setIsFormOpen(false);
          setEditingGoal(null);
        }}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDialog
        isOpen={Boolean(deletingGoal)}
        goal={deletingGoal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

    </div>
  );
}
