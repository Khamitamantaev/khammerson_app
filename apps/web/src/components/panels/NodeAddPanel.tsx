import {
  Folder,
  File,
  Package,
  GitBranch,
  Star,
  Archive,
  ChevronUp,
  ChevronDown,
  GripVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCanvasStore } from "@web/store/FlowStore";
import { cn } from "@web/lib/utils";
import { useState, useRef, useEffect } from "react";

const NODE_TYPES = [
  {
    id: "folder",
    label: "Папка",
    icon: Folder,
    color: "from-amber-500/20 to-amber-600/20",
    borderColor: "border-amber-500/30",
    iconColor: "text-amber-400",
    data: { label: "Новая папка", nodeType: "folder" },
  },
  {
    id: "file",
    label: "Файл",
    icon: File,
    color: "from-blue-500/20 to-blue-600/20",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-400",
    data: {
      label: "Новый файл",
      nodeType: "file",
      content: "// Содержимое файла",
    },
  },
  {
    id: "package",
    label: "Пакет",
    icon: Package,
    color: "from-purple-500/20 to-purple-600/20",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-400",
    data: { label: "Новый пакет", nodeType: "package" },
  },
  {
    id: "branch",
    label: "Ветка",
    icon: GitBranch,
    color: "from-green-500/20 to-green-600/20",
    borderColor: "border-green-500/30",
    iconColor: "text-green-400",
    data: { label: "Новая ветка", nodeType: "branch" },
  },
  {
    id: "starred",
    label: "Избранное",
    icon: Star,
    color: "from-yellow-500/20 to-yellow-600/20",
    borderColor: "border-yellow-500/30",
    iconColor: "text-yellow-400",
    data: { label: "Избранное", nodeType: "starred" },
  },
  {
    id: "archived",
    label: "Архив",
    icon: Archive,
    color: "from-gray-500/20 to-gray-600/20",
    borderColor: "border-gray-500/30",
    iconColor: "text-gray-400",
    data: { label: "Архив", nodeType: "archived" },
  },
];

interface NodeAddPanelProps {
  isCanvasListCollapsed?: boolean;
}

export const NodeAddPanel = ({
  isCanvasListCollapsed = false,
}: NodeAddPanelProps) => {
  // Все хуки вызываем в начале, ДО любых условий
  const { currentCanvasId } = useCanvasStore();
  const [isOpen, setIsOpen] = useState(true);
  const [position, setPosition] = useState({ x: 330, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  const [prevCollapsed, setPrevCollapsed] = useState(isCanvasListCollapsed);
  useEffect(() => {
    if (prevCollapsed !== isCanvasListCollapsed) {
      // Панель развернулась (была свернута, стала развернутой)
      if (!isCanvasListCollapsed && prevCollapsed) {
        // Если текущая позиция меньше минимальной для развернутой панели (330px)
        if (position.x < 330) {
          setPosition((prev) => ({
            ...prev,
            x: 340, // Сдвигаем вправо, за пределы развернутой панели
          }));
        }
      }
      setPrevCollapsed(isCanvasListCollapsed);
    }
  }, [isCanvasListCollapsed, prevCollapsed, position.x]);

  // useEffect для перетаскивания
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      // Динамическая минимальная ширина в зависимости от состояния панели проектов
      const minX = isCanvasListCollapsed ? 100 : 330; // 100px если свернута, 330px если развернута
      const maxX = window.innerWidth - 200; // Правая граница
      const minY = 100; // Под навбаром
      const maxY = window.innerHeight - 300; // Нижняя граница

      // Ограничиваем координаты
      const newX = Math.min(Math.max(minX, e.clientX - dragOffset.x), maxX);
      const newY = Math.min(Math.max(minY, e.clientY - dragOffset.y), maxY);

      setPosition({
        x: newX,
        y: newY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, isCanvasListCollapsed]);

  // ТЕПЕРЬ можно проверять условие (после всех хуков)
  if (!currentCanvasId) return null;

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
    data: any,
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("application/json", JSON.stringify(data));
    event.dataTransfer.effectAllowed = "move";
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".drag-handle")) {
      setIsDragging(true);
      const rect = panelRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  };

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        cursor: isDragging ? "grabbing" : "default",
        zIndex: 100,
      }}
      className="bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 shadow-2xl overflow-hidden w-48"
    >
      {/* Заголовок с возможностью перетаскивания */}
      <div
        className="drag-handle flex items-center justify-between px-3 py-2 border-b border-slate-800 cursor-grab active:cursor-grabbing hover:bg-slate-800/50 transition-colors"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="h-3.5 w-3.5 text-slate-500" />
          <h3 className="text-xs font-medium text-slate-400">Элементы</h3>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="text-slate-400 hover:text-cyan-400"
        >
          {isOpen ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Сетка элементов с анимацией */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-2 grid grid-cols-3 gap-1.5">
              {NODE_TYPES.map((node) => {
                const Icon = node.icon;
                return (
                  <div
                    key={node.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, node.id, node.data)}
                    className={cn(
                      "relative flex flex-col items-center justify-center gap-1 p-1.5 rounded-lg border cursor-grab",
                      `bg-gradient-to-br ${node.color}`,
                      node.borderColor,
                      "hover:shadow-lg hover:shadow-cyan-500/10 transition-all group",
                    )}
                  >
                    <Icon className={cn("h-4 w-4", node.iconColor)} />
                    <span
                      className={cn("text-[7px] font-medium", node.iconColor)}
                    >
                      {node.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
