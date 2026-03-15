import { motion, AnimatePresence } from "framer-motion";
import { X, Folder, File, Package, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@web/lib/utils";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (project: {
    name: string;
    description: string;
    template?: string;
  }) => void;
}

const TEMPLATES = [
  {
    id: "blank",
    name: "Пустой проект",
    icon: File,
    description: "Начните с чистого листа",
  },
  {
    id: "api",
    name: "API сервис",
    icon: Package,
    description: "Готовая структура для API",
  },
  {
    id: "frontend",
    name: "Фронтенд",
    icon: Folder,
    description: "React + TypeScript",
  },
  {
    id: "fullstack",
    name: "Fullstack",
    icon: Sparkles,
    description: "Полный стек приложения",
  },
];

export const CreateProjectModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateProjectModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("blank");
  const [step, setStep] = useState(1);

  const handleSubmit = () => {
    if (!name.trim()) return;

    onCreate({
      name: name.trim(),
      description: description.trim(),
      template: selectedTemplate,
    });

    // Сброс формы
    setName("");
    setDescription("");
    setSelectedTemplate("blank");
    setStep(1);
    onClose();
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setSelectedTemplate("blank");
    setStep(1);
    onClose();
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
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Модальное окно */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden"
          >
            {/* Градиентная обводка */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-rose-500/10 pointer-events-none" />

            {/* Заголовок */}
            <div className="relative px-6 py-5 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-rose-400">
                  Создать новый проект
                </span>
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Индикатор шагов */}
            <div className="relative px-6 pt-4">
              <div className="flex items-center justify-between max-w-xs mx-auto">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                        step >= i
                          ? "bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-lg shadow-indigo-500/20"
                          : "bg-slate-800 text-slate-400",
                      )}
                    >
                      {i}
                    </div>
                    {i === 1 && (
                      <div
                        className={cn(
                          "w-16 h-0.5 mx-2 transition-all",
                          step > 1
                            ? "bg-gradient-to-r from-indigo-500 to-rose-500"
                            : "bg-slate-800",
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Контент */}
            <div className="relative p-6">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        Название проекта
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Например: Мой крутой проект"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        Описание (необязательно)
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Краткое описание проекта..."
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all resize-none"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <label className="block text-sm font-medium text-slate-400 mb-3">
                      Выберите шаблон
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {TEMPLATES.map((template) => {
                        const Icon = template.icon;
                        const isSelected = selectedTemplate === template.id;
                        return (
                          <button
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className={cn(
                              "p-4 rounded-xl border transition-all text-left group",
                              isSelected
                                ? "bg-gradient-to-br from-indigo-500/10 to-rose-500/10 border-indigo-500/30"
                                : "bg-slate-800/30 border-slate-700 hover:border-slate-600",
                            )}
                          >
                            <div
                              className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-all",
                                isSelected
                                  ? "bg-gradient-to-br from-indigo-500 to-rose-500 text-white"
                                  : "bg-slate-700 text-slate-400 group-hover:text-indigo-400",
                              )}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <h3
                              className={cn(
                                "font-medium mb-1 transition-colors",
                                isSelected ? "text-white" : "text-slate-300",
                              )}
                            >
                              {template.name}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {template.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Кнопки действий */}
            <div className="relative px-6 py-4 border-t border-slate-800 flex justify-between">
              {step === 1 ? (
                <>
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    disabled={!name.trim()}
                    className={cn(
                      "px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-rose-500 text-white font-medium transition-all",
                      "hover:from-indigo-600 hover:to-rose-600",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                    )}
                  >
                    Продолжить
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    Назад
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-rose-500 text-white font-medium transition-all hover:from-indigo-600 hover:to-rose-600"
                  >
                    Создать проект
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
