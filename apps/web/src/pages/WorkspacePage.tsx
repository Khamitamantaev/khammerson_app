import { motion } from "framer-motion";
import {
  Plus,
  Grid,
  Layout,
  Layers,
  Settings,
  Folder,
  Star,
  Pencil,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { CreateProjectModal } from "@web/modals/CreateProjectModal";
import { trpc } from "@web/trpc/client";
import { EditProjectModal } from "@web/modals/EditProjectModal";
import { DeleteProjectModal } from "@web/modals/DeleteProjectModal";

export const WorkspacePage = () => {
  const [activeView, setActiveView] = useState<"grid" | "list">("grid");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState<any>(null);
  // Получаем реальные проекты с сервера
  const { data: projects = [], refetch } =
    trpc.project.getUserProjects.useQuery();

  // Мутации
  const createProject = trpc.project.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateModalOpen(false);
    },
  });

  const updateProject = trpc.project.update.useMutation({
    onSuccess: () => {
      refetch();
      setIsEditModalOpen(false);
      setEditingProject(null);
    },
  });

  const deleteProject = trpc.project.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleCreateProject = (newProject: {
    name: string;
    description: string;
    template?: string;
  }) => {
    createProject.mutate({
      title: newProject.name,
      description: newProject.description,
      isPublic: false,
      tags: newProject.template ? [newProject.template] : [],
    });
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  const handleUpdateProject = (data: { name: string; description: string }) => {
    if (!editingProject) return;

    updateProject.mutate({
      id: editingProject.id,
      title: data.name,
      description: data.description,
    });
  };

  // Новый обработчик для открытия модалки
  const handleDeleteClick = (project: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingProject(project);
    setIsDeleteModalOpen(true);
  };

  // Новый обработчик подтверждения удаления
  const handleConfirmDelete = () => {
    if (deletingProject) {
      deleteProject.mutate({ id: deletingProject.id });
      setIsDeleteModalOpen(false);
      setDeletingProject(null);
    }
  };

  // Статистика
  const totalProjects = projects.length;
  const totalCanvases = projects.reduce(
    (acc, p) => acc + (p._count?.canvases || 0),
    0,
  );
  const totalStars = projects.reduce((acc, p) => acc + (p.stars || 0), 0);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Заголовок с эффектом */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-300 via-white/90 to-rose-300">
              Рабочее пространство
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto md:mx-0">
            Ваши проекты в облаке — доступны в любой момент
          </p>
        </motion.div>

        {/* Панель действий */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          {/* Поиск и фильтры */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск проектов..."
                className="w-64 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
              <button
                onClick={() => setActiveView("grid")}
                className={`p-2 rounded-md transition-all ${
                  activeView === "grid"
                    ? "bg-indigo-500/20 text-indigo-400 shadow-lg shadow-indigo-500/10"
                    : "text-slate-400 hover:text-slate-300 hover:bg-white/5"
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActiveView("list")}
                className={`p-2 rounded-md transition-all ${
                  activeView === "list"
                    ? "bg-indigo-500/20 text-indigo-400 shadow-lg shadow-indigo-500/10"
                    : "text-slate-400 hover:text-slate-300 hover:bg-white/5"
                }`}
              >
                <Layers className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white rounded-lg transition-all shadow-lg shadow-indigo-500/25"
            >
              <Plus className="h-4 w-4" />
              Новый проект
            </button>

            <button className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-slate-300 hover:border-indigo-500/30 transition-all">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Навигация */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-1 mb-8 p-1 bg-white/5 rounded-lg w-fit"
        >
          <button className="px-4 py-2 text-sm rounded-md bg-indigo-500/20 text-indigo-400 font-medium">
            Все проекты
          </button>
          <button className="px-4 py-2 text-sm rounded-md text-slate-400 hover:text-slate-300 hover:bg-white/5 transition-colors">
            Избранное
          </button>
          <button className="px-4 py-2 text-sm rounded-md text-slate-400 hover:text-slate-300 hover:bg-white/5 transition-colors">
            Шаблоны
          </button>
          <button className="px-4 py-2 text-sm rounded-md text-slate-400 hover:text-slate-300 hover:bg-white/5 transition-colors">
            Архив
          </button>
        </motion.div>

        {/* Сетка проектов */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className={
              activeView === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                : "space-y-3"
            }
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {activeView === "grid" ? (
                  // Карточка в стиле стекла
                  <div className="group block relative">
                    <Link to={`/workspace/${project.id}`} className="block">
                      <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-rose-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                      <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-xl border border-white/10 p-5 hover:border-white/20 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-indigo-500/20 to-rose-500/20 flex items-center justify-center">
                            <Folder className="h-5 w-5 text-indigo-400" />
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleEditProject(project);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-indigo-400"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteClick(project, e)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-rose-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <h3 className="font-semibold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                          {project.title}
                        </h3>

                        <p className="text-xs text-slate-500 mb-4">
                          Обновлен{" "}
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </p>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">
                            {project._count?.canvases || 0} канвасов
                          </span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Star className="h-3 w-3" />
                            {project.stars || 0}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ) : (
                  // Строка для list вида
                  <div className="group relative">
                    <Link to={`/workspace/${project.id}`} className="block">
                      <div className="flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-sm rounded-lg border border-white/5 hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-indigo-500/20 to-rose-500/20 flex items-center justify-center">
                            <Layout className="h-4 w-4 text-indigo-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {project._count?.canvases || 0} канвасов •
                              Обновлен{" "}
                              {new Date(project.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-sm text-slate-400">
                            <Star className="h-3 w-3" />
                            {project.stars || 0}
                          </span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleEditProject(project);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(project, e)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Карточка создания */}
            {activeView === "grid" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: projects.length * 0.05 }}
              >
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="group w-full h-full min-h-45 bg-white/5 backdrop-blur-sm rounded-xl border-2 border-dashed border-white/10 hover:border-indigo-500/30 transition-all"
                >
                  <div className="h-full flex flex-col items-center justify-center p-6">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-3 group-hover:bg-indigo-500/20 transition-colors">
                      <Plus className="h-6 w-6 text-indigo-400" />
                    </div>
                    <p className="text-slate-400 text-sm">Создать проект</p>
                  </div>
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Статистика */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Всего проектов", value: totalProjects.toString() },
            { label: "Всего канвасов", value: totalCanvases.toString() },
            { label: "Звёзд получено", value: totalStars.toString() },
            { label: "Шаблонов", value: "0" },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
            >
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Модальные окна */}
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateProject}
        />

        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProject(null);
          }}
          project={editingProject}
          onUpdate={handleUpdateProject}
        />

        <DeleteProjectModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingProject(null);
          }}
          onConfirm={handleConfirmDelete}
          projectTitle={deletingProject?.title}
          isLoading={deleteProject.isPending}
        />
      </div>
    </div>
  );
};
