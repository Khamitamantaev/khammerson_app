import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { cn } from "@web/lib/utils";

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectTitle?: string;
  isLoading?: boolean;
}

export const DeleteProjectModal = ({
  isOpen,
  onClose,
  onConfirm,
  projectTitle = "проект",
  isLoading = false,
}: DeleteProjectModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Затемнение фона */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Модальное окно */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden"
          >
            {/* Красная градиентная обводка для опасного действия */}
            <div className="absolute inset-0 bg-gradient-to-b from-rose-500/10 via-transparent to-orange-500/10 pointer-events-none" />

            {/* Заголовок с иконкой предупреждения */}
            <div className="relative px-6 py-5 border-b border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-rose-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-orange-400">
                    Удалить проект
                  </span>
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Это действие нельзя отменить
                </p>
              </div>
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Контент */}
            <div className="relative p-6">
              <p className="text-slate-300">
                Вы уверены, что хотите удалить проект{" "}
                <span className="font-semibold text-white">
                  "{projectTitle}"
                </span>
                ?
              </p>
              <p className="text-sm text-slate-400 mt-3">
                Все канвасы, ноды и связи внутри этого проекта будут
                безвозвратно удалены. Это действие нельзя будет отменить.
              </p>
            </div>

            {/* Кнопки действий */}
            <div className="relative px-6 py-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-slate-400 hover:text-slate-300 transition-colors disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={cn(
                  "px-6 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-orange-500 text-white font-medium transition-all",
                  "hover:from-rose-600 hover:to-orange-600",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  isLoading && "animate-pulse",
                )}
              >
                {isLoading ? "Удаление..." : "Удалить"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
