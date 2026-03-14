import { Folder, Plus, ChevronLeft, ChevronRight, Globe } from "lucide-react";
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
    console.log("Toggle clicked", !isCollapsed);
    onCollapse(!isCollapsed);
  };

  const handleCreateCanvas = () => {
    const newCanvas = {
      id: `canvas-${Date.now()}`,
      title: "Новый проект",
      description: "",
      nodes: [],
      edges: [],
    };
    actions.addCanvas(newCanvas);
    actions.setCurrentCanvasId(newCanvas.id);
  };

  return (
    <div className="relative h-full">
      {/* Кнопка сворачивания/разворачивания - снаружи */}
      <button
        onClick={handleToggle}
        className={cn(
          "absolute top-20 z-50 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200",
          "bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700",
          "text-white shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40",
          "border border-white/10",
        )}
        style={{
          left: isCollapsed ? "76px" : "316px", // Немного правее края панели
          transform: "translateX(-50%)",
        }}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {/* Сама панель */}
      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? 80 : 320 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="h-full bg-slate-900/40 backdrop-blur-md border-r border-slate-800/70 shadow-xl overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isCollapsed ? (
            /* Свернутый вид - только иконки */
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center py-6"
            >
              {/* Глобальная библиотека (иконка) */}
              <button
                onClick={() => handleCanvasSelect(GLOBAL_CANVAS_ID)}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all mb-4",
                  currentCanvasId === GLOBAL_CANVAS_ID
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    : "text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50",
                )}
                title="Глобальная библиотека"
              >
                <Globe className="h-4 w-4" />
              </button>

              {/* Разделитель */}
              <div className="w-8 h-px bg-slate-800 my-4" />

              {/* Список проектов (только иконки) */}
              <div className="space-y-2">
                {MOCK_CANVASES.map((canvas) => (
                  <button
                    key={canvas.id}
                    onClick={() => handleCanvasSelect(canvas.id)}
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                      currentCanvasId === canvas.id
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                        : "text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50",
                    )}
                    title={canvas.title}
                  >
                    <Folder className="h-4 w-4" />
                  </button>
                ))}
              </div>

              {/* Кнопка создания (внизу) */}
              <button
                onClick={handleCreateCanvas}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 transition-all mt-auto"
                title="Создать проект"
              >
                <Plus className="h-4 w-4" />
              </button>
            </motion.div>
          ) : (
            /* Развернутый вид - полный */
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col"
            >
              {/* Заголовок */}
              <div className="p-4 border-b border-slate-800/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Folder className="h-4 w-4 text-cyan-400" />
                    Проекты
                  </h2>
                  <button
                    onClick={handleCreateCanvas}
                    className="p-1.5 hover:bg-cyan-500/10 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors"
                    title="Создать проект"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Список канвасов */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {/* Глобальная библиотека */}
                <CanvasCard
                  canvas={{
                    id: GLOBAL_CANVAS_ID,
                    title: "Глобальная библиотека",
                    description: "Публичные проекты",
                    nodes: 128,
                    updated: "Обновляется",
                  }}
                  isSelected={currentCanvasId === GLOBAL_CANVAS_ID}
                  onSelect={() => handleCanvasSelect(GLOBAL_CANVAS_ID)}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />

                {/* Разделитель */}
                <div className="border-t border-slate-800/50 my-3" />

                {/* Пользовательские канвасы */}
                <AnimatePresence>
                  {MOCK_CANVASES.map((canvas) => (
                    <CanvasCard
                      key={canvas.id}
                      canvas={canvas}
                      isSelected={currentCanvasId === canvas.id}
                      onSelect={() => handleCanvasSelect(canvas.id)}
                      onEdit={() => console.log("Edit", canvas.id)}
                      onDelete={() => console.log("Delete", canvas.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Статистика */}
              <div className="p-4 border-t border-slate-800/50">
                <div className="text-xs text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Всего проектов</span>
                    <span className="text-slate-300">
                      {MOCK_CANVASES.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Всего нод</span>
                    <span className="text-slate-300">
                      {MOCK_CANVASES.reduce((acc, c) => acc + c.nodes, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
