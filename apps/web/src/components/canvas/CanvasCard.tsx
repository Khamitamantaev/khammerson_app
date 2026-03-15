import { Folder, Pencil, Trash2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@web/lib/utils";
import { trpc } from "@web/trpc/client";
import { useCanvasStore } from "@web/store/FlowStore";
import { useState } from "react";
import { DeleteCanvasModal } from "@web/modals/DeleteCanvasModal";
import { CanvasModal } from "@web/modals/CanvasModal";

interface CanvasCardProps {
  canvas: {
    id: string;
    title: string;
    description?: string | null;
    _count?: {
      nodes: number;
      edges: number;
    };
  };
  isSelected: boolean;
  onSelect: () => void;
}

export const CanvasCard = ({
  canvas,
  isSelected,
  onSelect,
}: CanvasCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { actions } = useCanvasStore();
  const utils = trpc.useUtils();

  // Мутации
  const updateCanvas = trpc.canvas.update.useMutation({
    onSuccess: (updatedCanvas) => {
      // Получаем текущий канвас из стора, чтобы сохранить nodes и edges
      const currentCanvas = useCanvasStore
        .getState()
        .canvases.find((c) => c.id === updatedCanvas.id);

      // Преобразуем данные с сервера в формат стора
      const canvasForStore = {
        id: updatedCanvas.id,
        title: updatedCanvas.title,
        description: updatedCanvas.description || undefined,
        projectId: updatedCanvas.projectId,
        userId: updatedCanvas.ownerId,
        createdAt: updatedCanvas.createdAt,
        updatedAt: updatedCanvas.updatedAt,
        nodes: currentCanvas?.nodes || [],
        edges: currentCanvas?.edges || [],
      };

      actions.updateCanvas(updatedCanvas.id, canvasForStore);
      setIsEditModalOpen(false);
      utils.canvas.getProjectCanvases.invalidate();
    },
  });

  const deleteCanvas = trpc.canvas.delete.useMutation({
    onSuccess: (_, variables) => {
      actions.deleteCanvas(variables.id);
      setIsDeleteModalOpen(false);
      utils.canvas.getProjectCanvases.invalidate();
    },
  });

  const handleEdit = (data: { title: string; description: string }) => {
    updateCanvas.mutate({
      id: canvas.id,
      title: data.title,
      description: data.description,
    });
  };

  const handleDelete = () => {
    deleteCanvas.mutate({ id: canvas.id });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        className="relative group"
      >
        <button
          onClick={onSelect}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left",
            "hover:bg-slate-800/50",
            isSelected &&
              "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30",
          )}
        >
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

          <div className="flex-1">
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
            {canvas._count && (
              <div className="text-xs text-slate-500 mt-0.5">
                {canvas._count.nodes} нод • {canvas._count.edges} связей
              </div>
            )}
          </div>

          {isSelected && (
            <ChevronRight className="h-4 w-4 text-cyan-400 animate-pulse" />
          )}
        </button>

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditModalOpen(true);
            }}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-all border border-slate-700 hover:border-cyan-500/30"
          >
            <Pencil className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteModalOpen(true);
            }}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all border border-slate-700 hover:border-red-500/30"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </motion.div>

      {/* Модальное окно редактирования */}
      <CanvasModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEdit}
        initialData={{
          title: canvas.title,
          description: canvas.description || "",
        }}
        title="Редактирование канваса"
        submitText="Сохранить"
      />

      {/* Модальное окно подтверждения удаления */}
      <DeleteCanvasModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Удаление канваса"
        message={`Вы уверены, что хотите удалить канвас "${canvas.title}"? Все ноды и связи будут безвозвратно удалены.`}
        isLoading={deleteCanvas.isPending}
      />
    </>
  );
};
