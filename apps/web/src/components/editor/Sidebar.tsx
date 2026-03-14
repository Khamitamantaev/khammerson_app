import { motion } from "framer-motion";
import { Folder, File, Package, GitBranch, Star, Archive } from "lucide-react";

interface SidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export const Sidebar = ({ onDragStart }: SidebarProps) => {
  const sections = [
    {
      title: "Базовые",
      items: [
        { type: "folder", label: "Папка", icon: Folder },
        { type: "file", label: "Файл", icon: File },
      ],
    },
    {
      title: "Структура",
      items: [
        { type: "package", label: "Пакет", icon: Package },
        { type: "branch", label: "Ветка", icon: GitBranch },
      ],
    },
    {
      title: "Статусы",
      items: [
        { type: "starred", label: "Избранное", icon: Star },
        { type: "archived", label: "Архив", icon: Archive },
      ],
    },
  ];

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-56 bg-slate-900/30 backdrop-blur-sm border-r border-slate-800/50 p-3 flex flex-col gap-4"
    >
      {sections.map((section) => (
        <div key={section.title}>
          <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 px-2">
            {section.title}
          </h4>
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.type}
                  className="group flex items-center gap-2.5 px-2 py-1.5 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 cursor-grab transition-all duration-150"
                  draggable
                  onDragStart={(e) => onDragStart(e, item.type)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Разделитель */}
      <div className="border-t border-slate-800/50 my-2" />

      {/* Статистика проекта - пока заглушка, потом подключим реальные данные */}
      <div className="px-2">
        <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
          Статистика
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Ноды</span>
            <span className="text-slate-300">0</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Связи</span>
            <span className="text-slate-300">0</span>
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="px-2">
        <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
          Действия
        </h4>
        <div className="space-y-1">
          <button className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-md transition-all">
            <Folder className="h-3.5 w-3.5" />
            Экспортировать
          </button>
          <button className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-md transition-all">
            <Archive className="h-3.5 w-3.5" />
            Архивировать
          </button>
        </div>
      </div>
    </motion.aside>
  );
};