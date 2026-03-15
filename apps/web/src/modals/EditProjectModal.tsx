import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@web/lib/utils";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  onUpdate: (data: { name: string; description: string }) => void;
}

export const EditProjectModal = ({
  isOpen,
  onClose,
  project,
  onUpdate,
}: EditProjectModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (project) {
      setName(project.title || "");
      setDescription(project.description || "");
    }
  }, [project]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onUpdate({ name: name.trim(), description: description.trim() });
  };

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
            className="relative w-full max-w-lg bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden"
          >
            {/* Градиентная обводка */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-rose-500/10 pointer-events-none" />

            {/* Заголовок */}
            <div className="relative px-6 py-5 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-rose-400">
                  Редактировать проект
                </span>
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Форма */}
            <div className="relative p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Название проекта
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Введите название проекта"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Описание
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Введите описание проекта (необязательно)"
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="relative px-6 py-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-slate-300 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSubmit}
                disabled={!name.trim()}
                className={cn(
                  "px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-rose-500 text-white font-medium transition-all",
                  "hover:from-indigo-600 hover:to-rose-600",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                )}
              >
                Сохранить
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
