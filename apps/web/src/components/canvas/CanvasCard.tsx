import { Folder, Pencil, Trash2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@web/lib/utils";

interface CanvasCardProps {
  canvas: {
    id: string;
    title: string;
    description?: string;
    nodes?: number;
    updated?: string;
  };
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const CanvasCard = ({
  canvas,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: CanvasCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="relative group"
    >
      {/* Основная кнопка выбора канваса */}
      <button
        onClick={onSelect}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
          "hover:bg-slate-800/50",
          isSelected &&
            "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30",
          "active:bg-slate-800/70 focus:outline-none active:outline-none ring-0 active:ring-0",
        )}
      >
        {/* Иконка с градиентом */}
        <div
          className={cn(
            "relative p-2 rounded-lg transition-all",
            isSelected
              ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
              : "bg-slate-800 text-slate-400 group-hover:text-cyan-400",
          )}
        >
          <Folder className="h-4 w-4" />
        </div>

        {/* Информация о канвасе */}
        <div className="flex-1 text-left">
          <div
            className={cn(
              "font-medium text-sm transition-colors",
              isSelected
                ? "text-cyan-400"
                : "text-slate-300 group-hover:text-white",
            )}
          >
            {canvas.title}
          </div>
          {canvas.updated && (
            <div className="text-xs text-slate-500 mt-0.5">
              {canvas.nodes} нод • {canvas.updated}
            </div>
          )}
        </div>

        {/* Индикатор выбора */}
        {isSelected && (
          <ChevronRight className="h-4 w-4 text-cyan-400 animate-pulse" />
        )}
      </button>

      {/* Кнопки действий - теперь отдельно, не внутри button */}
      <div
        className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200"
        onClick={(e) => e.stopPropagation()} // Останавливаем всплытие
      >
        <button
          onClick={onEdit}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-all border border-slate-700 hover:border-cyan-500/30 focus:outline-none active:outline-none ring-0 active:ring-0"
        >
          <Pencil className="h-3 w-3" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all border border-slate-700 hover:border-red-500/30 focus:outline-none active:outline-none ring-0 active:ring-0"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
};
