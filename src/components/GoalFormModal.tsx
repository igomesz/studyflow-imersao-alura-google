import React, { useEffect, useState } from 'react';
import { Calendar, HelpCircle, Lightbulb, Save, X } from 'lucide-react';
import { GoalFormData, GoalStatus, StudyGoal } from '../types/goal';

interface GoalFormModalProps {
  isOpen: boolean;
  initialGoal: StudyGoal | null;
  onSave: (data: GoalFormData, id?: string) => void;
  onClose: () => void;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  initialGoal,
  onSave,
  onClose,
}) => {
  const isEditing = Boolean(initialGoal);

  // Estados locais do formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<GoalStatus>('nao_iniciado');

  // Estados de validação
  const [errors, setErrors] = useState<{ title?: string; deadline?: string }>({});

  // Sincroniza dados ao abrir ou trocar de objetivo
  useEffect(() => {
    if (initialGoal) {
      setTitle(initialGoal.title);
      setDescription(initialGoal.description || '');
      setDeadline(initialGoal.deadline || '');
      setStatus(initialGoal.status || 'nao_iniciado');
    } else {
      // Valor padrão para novos objetivos: data daqui a 7 dias
      const defaultDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      setTitle('');
      setDescription('');
      setDeadline(defaultDate);
      setStatus('nao_iniciado');
    }
    setErrors({});
  }, [initialGoal, isOpen]);

  // Tecla ESC para fechar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { title?: string; deadline?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Por favor, informe o título do seu objetivo de estudo.';
    }

    if (!deadline) {
      newErrors.deadline = 'Por favor, selecione uma data limite.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(
      {
        title: title.trim(),
        description: description.trim(),
        deadline,
        status,
      },
      initialGoal ? initialGoal.id : undefined
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Conteúdo do Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 z-10 my-8 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-stone-900 font-sans">
              {isEditing ? 'Editar Objetivo de Estudo' : 'Novo Objetivo de Estudo'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              {isEditing
                ? 'Atualize os detalhes do seu plano de estudo'
                : 'Defina uma meta clara para orientar seu aprendizado'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Campo: Título */}
          <div>
            <label htmlFor="goal-title" className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              Título do Objetivo <span className="text-rose-500">*</span>
            </label>
            <input
              id="goal-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="Ex: Praticar laços de repetição em JavaScript"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 placeholder:text-stone-400 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.title
                  ? 'border-rose-400 focus:ring-rose-400/30'
                  : 'border-stone-300 focus:border-emerald-600 focus:ring-emerald-500/20'
              }`}
              autoFocus
            />
            {errors.title ? (
              <p className="text-xs text-rose-600 mt-1">{errors.title}</p>
            ) : (
              <p className="text-[11px] text-stone-500 mt-1">
                Dica: Seja específico e direto sobre o que quer aprender.
              </p>
            )}
          </div>

          {/* Campo: Descrição */}
          <div>
            <label htmlFor="goal-description" className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              Descrição / Anotações <span className="text-stone-400 font-normal lowercase">(opcional)</span>
            </label>
            <textarea
              id="goal-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Fazer 5 exercícios da lista, ler o capítulo 2 do livro e anotar dúvidas para o fórum."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder:text-stone-400 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-y"
            />
          </div>

          {/* Grid com Prazo e Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Campo: Prazo */}
            <div>
              <label htmlFor="goal-deadline" className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                Prazo Estimado <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="goal-deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => {
                    setDeadline(e.target.value);
                    if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: undefined }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.deadline
                      ? 'border-rose-400 focus:ring-rose-400/30'
                      : 'border-stone-300 focus:border-emerald-600 focus:ring-emerald-500/20'
                  }`}
                />
              </div>
              {errors.deadline && (
                <p className="text-xs text-rose-600 mt-1">{errors.deadline}</p>
              )}
            </div>

            {/* Campo: Status */}
            <div>
              <label htmlFor="goal-status" className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                Status Atual
              </label>
              <select
                id="goal-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as GoalStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
              >
                <option value="nao_iniciado">⏳ Não iniciado</option>
                <option value="em_andamento">⚡ Em andamento</option>
                <option value="concluido">✅ Concluído</option>
              </select>
            </div>

          </div>

          {/* Dica Pedagógica Acolhedora */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/60 text-xs text-amber-900">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Conselho de estudo:</strong> É melhor estudar 25 minutos com regularidade do que acumular horas de cansaço. Defina prazos realistas e celebre cada marco!
            </p>
          </div>

          {/* Botões do Rodapé */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Salvar Alterações' : 'Cadastrar Objetivo'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
