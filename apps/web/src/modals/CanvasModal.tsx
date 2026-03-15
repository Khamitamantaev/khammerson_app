import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@web/lib/utils";

interface CanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string }) => void;
  initialData?: {
    title: string;
    description: string;
  };
  title: string;
  submitText: string;
}

export const CanvasModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
  submitText,
}: CanvasModalProps) => {
  // Используем локальное состояние вместо стора
  const [localTitle, setLocalTitle] = useState("");
  const [localDescription, setLocalDescription] = useState("");

  // Синхронизируем локальное состояние с initialData при открытии
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setLocalTitle(initialData.title);
        setLocalDescription(initialData.description);
      } else {
        setLocalTitle("");
        setLocalDescription("");
      }
    }
  }, [isOpen, initialData]); // Убираем зависимости от localTitle/localDescription

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localTitle.trim()) return;
    onSubmit({
      title: localTitle.trim(),
      description: localDescription.trim(),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden"
          >
            <form onSubmit={handleSubmit}>
              <div className="absolute inset-0 bg-linear-to-b from-cyan-500/10 via-transparent to-blue-500/10 pointer-events-none" />

              <div className="relative px-6 py-5 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  <span className="bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-blue-400">
                    {title}
                  </span>
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-300 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Название канваса
                  </label>
                  <input
                    type="text"
                    value={localTitle}
                    onChange={(e) => setLocalTitle(e.target.value)}
                    placeholder="Введите название канваса"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Описание
                  </label>
                  <textarea
                    value={localDescription}
                    onChange={(e) => setLocalDescription(e.target.value)}
                    placeholder="Описание канваса (необязательно)"
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>

              <div className="relative px-6 py-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={!localTitle.trim()}
                  className={cn(
                    "px-6 py-2 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 text-white font-medium transition-all",
                    "hover:from-cyan-600 hover:to-blue-700",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                  )}
                >
                  {submitText}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
