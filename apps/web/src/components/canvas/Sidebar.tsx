import { motion } from "framer-motion";
import { Button } from "@web/components/ui/button";
import { Plus } from "lucide-react";
import { useCanvasStore } from "@web/store/FlowStore";
import { CanvasList } from "./CanvasList";
import { CanvasModal } from "@web/modals/CanvasModal";
import { useEffect } from "react";
import { useCanvasManagement } from "@web/hooks/useCanvasManagment";

export const Sidebar = () => {
  // Убрали projectId из пропсов
  const { isSidebarOpen, actions } = useCanvasStore();
  const {
    handleSubmit,
    loadCanvases,
    isCreateModalOpen,
    canvasTitle,
    canvasDescription,
    editingCanvasId,
  } = useCanvasManagement();

  useEffect(() => {
    loadCanvases();
  }, [loadCanvases]);

  return (
    <>
      <motion.div
        initial={{ width: isSidebarOpen ? 320 : 0 }}
        animate={{ width: isSidebarOpen ? 320 : 0 }}
        className="h-full bg-slate-900/80 border-r border-slate-800 overflow-hidden flex flex-col"
      >
        <CanvasList /> {/* Убрали projectId */}
        <div className="p-4 border-t border-slate-800">
          <Button
            variant="outline"
            className="w-full border-slate-700 text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400"
            onClick={() => {
              actions.setCanvasTitle("");
              actions.setCanvasDescription("");
              actions.setEditingCanvasId(null);
              actions.setCreateModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Создать канвас
          </Button>
        </div>
      </motion.div>

      <CanvasModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          actions.setCreateModalOpen(false);
          actions.setEditingCanvasId(null);
          actions.setCanvasTitle("");
          actions.setCanvasDescription("");
        }}
        onSubmit={handleSubmit}
        initialData={
          editingCanvasId
            ? {
                title: canvasTitle,
                description: canvasDescription,
              }
            : undefined
        }
        title={editingCanvasId ? "Редактирование канваса" : "Создание канваса"}
        submitText={editingCanvasId ? "Сохранить" : "Создать"}
      />
    </>
  );
};
