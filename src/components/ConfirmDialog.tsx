import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { StudyGoal } from '../types/goal';

interface ConfirmDialogProps {
  isOpen: boolean;
  goal: StudyGoal | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  goal,
  onConfirm,
  onCancel,
}) => {
  // Fechar com a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !goal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop com desfoque */}
      <div
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Janela de Confirmação */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 z-10 animate-in fade-in zoom-in-95 duration-150"
      >
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h3 id="dialog-title" className="text-lg font-bold text-stone-900">
              Confirmar exclusão
            </h3>
            <p className="text-sm text-stone-600 mt-1 leading-relaxed">
              Você tem certeza de que deseja excluir este objetivo de estudo?
            </p>

            {/* Destaque do item a ser excluído */}
            <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200/80">
              <p className="text-sm font-semibold text-stone-800 line-clamp-2">
                "{goal.title}"
              </p>
              {goal.deadline && (
                <span className="text-xs text-stone-500 mt-1 block">
                  Prazo: {goal.deadline}
                </span>
              )}
            </div>

            <p className="text-xs text-stone-500 mt-2">
              Esta ação removerá o objetivo do seu armazenamento local.
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white text-sm font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Sim, excluir objetivo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
