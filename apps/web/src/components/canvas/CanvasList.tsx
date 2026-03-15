import {
  Folder,
  Plus,
  ChevronLeft,
  ChevronRight,
  Globe,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCanvasStore } from "@web/store/FlowStore";
import { cn } from "@web/lib/utils";
import { CanvasCard } from "./CanvasCard";

// Временные заглушки
const MOCK_CANVASES = [
  {
    id: "1",
    title: "Маркетплейс API",
    description: "Основной бэкенд",
    nodes: 24,
    updated: "2 дня назад",
  },
  {
    id: "2",
    title: "Блог на Next.js",
    description: "Фронтенд",
    nodes: 18,
    updated: "5 дней назад",
  },
  {
    id: "3",
    title: "Telegram бот",
    description: "Микросервис",
    nodes: 32,
    updated: "1 неделя назад",
  },
  {
    id: "4",
    title: "Админ панель",
    description: "Dashboard",
    nodes: 45,
    updated: "3 дня назад",
  },
];

interface CanvasListProps {
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const GLOBAL_CANVAS_ID = "global-library";

export const CanvasList = ({ isCollapsed, onCollapse }: CanvasListProps) => {
  const { currentCanvasId, actions } = useCanvasStore();

  const handleCanvasSelect = (canvasId: string) => {
    actions.setCurrentCanvasId(canvasId);
    actions.setSelectedNode(null);
    actions.resetExpandedNodes();
  };

  const handleToggle = () => {
    onCollapse(!isCollapsed);
  };

  const handleCreateCanvas = () => {
    const newCanvas = {
      id: `canvas-${Date.now()}`,
      title: "Новый канвас",
      description: "",
      nodes: [],
      edges: [],
    };
    actions.addCanvas(newCanvas);
    actions.setCurrentCanvasId(newCanvas.id);
  };

  return (
    <div className="relative h-full">
      {/* Кнопка сворачивания/разворачивания */}
      <motion.button
        onClick={handleToggle}
        initial={false}
        animate={{
          left: isCollapsed ? "76px" : "316px",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="absolute top-20 z-50 w-7 h-7 flex items-center justify-center bg-slate-800/80 border border-slate-700 rounded-lg text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 hover:bg-slate-700/80 shadow-lg backdrop-blur-sm transition-colors"
        style={{ transform: "translateX(-50%)" }}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </motion.button>

      {/* Сама панель */}
      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? 80 : 290 }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="h-full relative"
      >
        {/* Градиентная обводка */}
        <div className="absolute inset-0 rounded-r-2xl bg-gradient-to-b from-cyan-500/10 via-transparent to-blue-600/10 pointer-events-none" />

        {/* Основной фон панели */}
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl border-r border-slate-800/70 shadow-2xl" />

        {/* Внутренний контент */}
        <div className="relative h-full overflow-hidden">
          <AnimatePresence mode="wait">
            {isCollapsed ? (
              /* Свернутый вид - только иконки */
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="h-full flex flex-col items-center py-6"
              >
                {/* Декоративный элемент сверху */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.05 }}
                  className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 flex items-center justify-center mb-6"
                >
                  <Sparkles className="h-4 w-4 text-cyan-400/70" />
                </motion.div>

                {/* Глобальная библиотека */}
                <button
                  onClick={() => handleCanvasSelect(GLOBAL_CANVAS_ID)}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all mb-4 relative group",
                    currentCanvasId === GLOBAL_CANVAS_ID
                      ? "text-cyan-400"
                      : "text-slate-500 hover:text-cyan-400",
                  )}
                  title="Глобальная библиотека"
                >
                  <div
                    className={cn(
                      "absolute inset-0 rounded-xl transition-all",
                      currentCanvasId === GLOBAL_CANVAS_ID
                        ? "bg-cyan-500/10 border border-cyan-500/30"
                        : "group-hover:bg-cyan-500/5",
                    )}
                  />
                  <Globe className="h-4 w-4 relative z-10" />
                </button>

                {/* Разделитель */}
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent my-4" />

                {/* Список канвасов */}
                <div className="space-y-3">
                  {MOCK_CANVASES.map((canvas, index) => (
                    <motion.div
                      key={canvas.id}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <button
                        onClick={() => handleCanvasSelect(canvas.id)}
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all relative group",
                          currentCanvasId === canvas.id
                            ? "text-cyan-400"
                            : "text-slate-500 hover:text-cyan-400",
                        )}
                        title={canvas.title}
                      >
                        <div
                          className={cn(
                            "absolute inset-0 rounded-xl transition-all",
                            currentCanvasId === canvas.id
                              ? "bg-cyan-500/10 border border-cyan-500/30"
                              : "group-hover:bg-cyan-500/5",
                          )}
                        />
                        <Folder className="h-4 w-4 relative z-10" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Кнопка создания внизу */}
                <motion.button
                  onClick={handleCreateCanvas}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-cyan-400 transition-all relative group mt-auto"
                  title="Создать канвас"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 rounded-xl group-hover:bg-cyan-500/5 transition-all" />
                  <Plus className="h-4 w-4 relative z-10" />
                </motion.button>
              </motion.div>
            ) : (
              /* Развернутый вид */
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="h-full flex flex-col"
              >
                {/* Шапка */}
                <div className="relative p-4 border-b border-slate-800/50">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-600/5" />
                  <div className="relative flex items-center justify-between">
                    <motion.h2
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="text-sm font-medium text-slate-400 flex items-center gap-2"
                    >
                      <Folder className="h-4 w-4 text-cyan-400" />
                      Канвасы
                    </motion.h2>
                    <motion.button
                      onClick={handleCreateCanvas}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all"
                      title="Создать канвас"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Список канвасов */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                  {/* Глобальная библиотека */}
                  <CanvasCard
                    canvas={{
                      id: GLOBAL_CANVAS_ID,
                      title: "Глобальная библиотека",
                      description: "Публичные канвасы",
                      nodes: 128,
                      updated: "Обновляется",
                    }}
                    isSelected={currentCanvasId === GLOBAL_CANVAS_ID}
                    onSelect={() => handleCanvasSelect(GLOBAL_CANVAS_ID)}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />

                  {/* Разделитель */}
                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-800/50" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-2 text-[10px] text-slate-600 bg-slate-900/60">
                        Мои канвасы
                      </span>
                    </div>
                  </div>

                  {/* Пользовательские канвасы */}
                  <AnimatePresence>
                    {MOCK_CANVASES.map((canvas, index) => (
                      <motion.div
                        key={canvas.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ delay: index * 0.02 }}
                      >
                        <CanvasCard
                          canvas={canvas}
                          isSelected={currentCanvasId === canvas.id}
                          onSelect={() => handleCanvasSelect(canvas.id)}
                          onEdit={() => console.log("Edit", canvas.id)}
                          onDelete={() => console.log("Delete", canvas.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Статистика */}
                <div className="relative p-4 border-t border-slate-800/50">
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent" />
                  <div className="relative text-xs text-slate-600 space-y-1">
                    <motion.div
                      className="flex justify-between"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.05 }}
                    >
                      <span>Всего канвасов</span>
                      <span className="text-slate-400">
                        {MOCK_CANVASES.length}
                      </span>
                    </motion.div>
                    <motion.div
                      className="flex justify-between"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.08 }}
                    >
                      <span>Всего нод</span>
                      <span className="text-slate-400">
                        {MOCK_CANVASES.reduce((acc, c) => acc + c.nodes, 0)}
                      </span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
