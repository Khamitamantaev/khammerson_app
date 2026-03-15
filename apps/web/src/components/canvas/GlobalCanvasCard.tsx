import { Globe } from "lucide-react";
import { cn } from "@web/lib/utils";

interface GlobalCanvasCardProps {
  isSelected: boolean;
  onSelect: () => void;
}

export const GlobalCanvasCard = ({
  isSelected,
  onSelect,
}: GlobalCanvasCardProps) => {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
        "hover:bg-slate-800/50",
        isSelected &&
          "bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30",
      )}
    >
      <div
        className={cn(
          "p-2 rounded-lg transition-all",
          isSelected
            ? "bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/20"
            : "bg-slate-800 text-slate-400",
        )}
      >
        <Globe className="h-4 w-4" />
      </div>
      <div className="flex-1 text-left">
        <div
          className={cn(
            "font-medium text-sm transition-colors",
            isSelected ? "text-purple-400" : "text-slate-300",
          )}
        >
          Глобальная библиотека
        </div>
        <div className="text-xs text-slate-500 mt-0.5">
          Публичные ноды и шаблоны
        </div>
      </div>
    </button>
  );
};
