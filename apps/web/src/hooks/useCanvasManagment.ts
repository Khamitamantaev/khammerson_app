// hooks/useCanvasManagement.ts
import { useCallback } from "react";
import { useCanvasStore } from "@web/store/FlowStore";
import { trpc } from "@web/trpc/client";
import { toast } from "sonner";

export const useCanvasManagement = () => {
  const {
    actions,
    canvasTitle,
    canvasDescription,
    editingCanvasId,
    isCreateModalOpen,
    currentProjectId,
  } = useCanvasStore();

  const utils = trpc.useUtils();

  const createCanvas = trpc.canvas.create.useMutation();
  const updateCanvas = trpc.canvas.update.useMutation();

  const handleSubmit = useCallback(
    (title: string, description: string) => {
      if (!title.trim()) {
        toast.warning("Введите название канваса");
        return;
      }

      // Проверяем projectId для создания
      if (!editingCanvasId && !currentProjectId) {
        toast.error("ID проекта не найден");
        return;
      }

      const mutation = editingCanvasId ? updateCanvas : createCanvas;

      const mutationData = editingCanvasId
        ? {
            id: editingCanvasId,
            title: title,
            description: description,
          }
        : {
            title: title,
            description: description,
            projectId: currentProjectId!,
          };

      mutation.mutate(mutationData as any, {
        onSuccess: (data) => {
          // Обновляем список канвасов
          utils.canvas.getProjectCanvases.invalidate({
            projectId: currentProjectId!,
          });

          if (!editingCanvasId) {
            // Создание нового канваса
            const newCanvas = {
              id: data.id,
              title: title,
              description: description,
              projectId: currentProjectId!,
              userId: data.ownerId,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              nodes: [],
              edges: [],
            };

            actions.addCanvas(newCanvas);
            actions.setCurrentCanvasId(data.id);
            toast.success("Канвас создан");
          } else {
            // Обновление существующего канваса
            actions.updateCanvas(editingCanvasId, {
              title: title,
              description: description,
            });
            toast.success("Канвас обновлён");
          }

          actions.setCreateModalOpen(false);
          actions.setEditingCanvasId(null);
          actions.setCanvasTitle("");
          actions.setCanvasDescription("");
        },
        onError: (error) => {
          console.error("Error saving canvas:", error);
          toast.error(
            `Ошибка при ${editingCanvasId ? "обновлении" : "создании"} канваса`,
          );
        },
      });
    },
    [
      editingCanvasId,
      currentProjectId,
      actions,
      createCanvas,
      updateCanvas,
      utils,
    ],
  );

  const loadCanvases = useCallback(async () => {
    if (!currentProjectId) return;

    try {
      const canvases = await utils.canvas.getProjectCanvases.fetch({
        projectId: currentProjectId,
      });

      if (canvases) {
        const transformedCanvases = canvases.map((canvas) => ({
          id: canvas.id,
          title: canvas.title,
          description: canvas.description || "",
          projectId: canvas.projectId,
          userId: canvas.ownerId,
          createdAt: canvas.createdAt,
          updatedAt: canvas.updatedAt,
          nodes: canvas.nodes || [],
          edges: canvas.edges || [],
        }));

        actions.setCanvases(transformedCanvases);
      }
    } catch (error) {
      console.error("Error loading canvases:", error);
      toast.error("Ошибка при загрузке канвасов");
    }
  }, [currentProjectId, utils, actions]);

  return {
    handleSubmit,
    loadCanvases,
    isCreateModalOpen,
    canvasTitle,
    canvasDescription,
    editingCanvasId,
  };
};
