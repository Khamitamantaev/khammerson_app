import { motion } from "framer-motion";
import { Plus, Grid, Layout, Layers, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export const WorkspacePage = () => {
  const [activeView, setActiveView] = useState<"grid" | "list">("grid");

  // Заглушки для демонстрации
  const projects = [
    { id: 1, name: "Проект 1", updated: "2 дня назад", nodes: 12 },
    { id: 2, name: "Проект 2", updated: "5 дней назад", nodes: 8 },
    { id: 3, name: "Проект 3", updated: "1 неделя назад", nodes: 24 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                Рабочее пространство
              </span>
            </h1>
            <p className="text-slate-400">Управляйте своими проектами</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Переключение вида */}
            <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveView("grid")}
                className={`p-2 rounded-md transition-colors ${
                  activeView === "grid"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActiveView("list")}
                className={`p-2 rounded-md transition-colors ${
                  activeView === "list"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                <Layers className="h-4 w-4" />
              </button>
            </div>

            {/* Кнопка создания */}
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg shadow-cyan-500/20">
              <Plus className="h-4 w-4" />
              Новый проект
            </button>

            {/* Настройки */}
            <button className="p-2 bg-slate-800/50 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-300 hover:border-cyan-500/30 transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Основной контент */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Навигация по вкладкам */}
          <div className="flex items-center gap-4 mb-6 border-b border-slate-800">
            <button className="px-4 py-2 text-cyan-400 border-b-2 border-cyan-400 font-medium">
              Мои проекты
            </button>
            <button className="px-4 py-2 text-slate-400 hover:text-slate-300 transition-colors">
              Недавние
            </button>
            <button className="px-4 py-2 text-slate-400 hover:text-slate-300 transition-colors">
              Шаблоны
            </button>
          </div>

          {/* Сетка проектов */}
          <div
            className={
              activeView === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={
                  activeView === "grid"
                    ? "bg-slate-800/50 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-all group"
                    : "bg-slate-800/50 rounded-lg border border-slate-800 hover:border-cyan-500/30 transition-all p-4"
                }
              >
                {activeView === "grid" ? (
                  // Карточка для grid вида
                  <Link to={`/workspace/${project.id}`} className="block p-6">
                    <div className="h-32 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-lg mb-4 flex items-center justify-center">
                      <Layout className="h-8 w-8 text-cyan-400/50" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-cyan-400 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-slate-400 mb-2">
                      Обновлен: {project.updated}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{project.nodes} нод</span>
                    </div>
                  </Link>
                ) : (
                  // Строка для list вида
                  <Link
                    to={`/workspace/${project.id}`}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-lg flex items-center justify-center">
                        <Layout className="h-4 w-4 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold group-hover:text-cyan-400 transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {project.nodes} нод • Обновлен: {project.updated}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-cyan-400 transition-colors">
                      <Settings className="h-4 w-4" />
                    </button>
                  </Link>
                )}
              </motion.div>
            ))}

            {/* Карточка создания нового проекта */}
            {activeView === "grid" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: projects.length * 0.1 }}
                className="bg-slate-800/30 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500/30 transition-all group cursor-pointer"
              >
                <div className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                    <Plus className="h-6 w-6 text-cyan-400" />
                  </div>
                  <p className="text-slate-400 text-center">
                    Создать новый проект
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Секция для будущего React Flow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-8 bg-slate-800/30 rounded-xl border border-slate-800 text-center"
        >
          <p className="text-slate-400">
            Здесь будет интерактивный редактор с React Flow
          </p>
          <p className="text-sm text-slate-500 mt-2">(В разработке)</p>
        </motion.div>
      </div>
    </div>
  );
};
