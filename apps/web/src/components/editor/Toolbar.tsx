import { useCanvasStore, useCurrentCanvas } from "@web/store/FlowStore";
import { Save, Download, Plus } from "lucide-react";

export const Toolbar = () => {
  const currentCanvas = useCurrentCanvas();
  const { actions } = useCanvasStore();

  const handleSave = () => {
    if (!currentCanvas) return;
    // Пока просто сохраняем в localStorage
    localStorage.setItem(
      `canvas-${currentCanvas.id}`,
      JSON.stringify(currentCanvas),
    );
    console.log("Canvas saved:", currentCanvas);
  };

  const handleAddNode = () => {
    if (!currentCanvas) return;

    const newNode = {
      id: `node-${Date.now()}`,
      type: "default",
      data: { label: "Новая нода" },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };

    actions.updateCurrentCanvasNodes((nodes) => [...nodes, newNode]);
  };

  return (
    <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-2">
      <button
        onClick={handleAddNode}
        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors"
        title="Добавить ноду"
      >
        <Plus className="h-4 w-4" />
      </button>

      <button
        onClick={handleSave}
        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors"
        title="Сохранить"
      >
        <Save className="h-4 w-4" />
      </button>

      <button
        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors"
        title="Экспортировать"
      >
        <Download className="h-4 w-4" />
      </button>

      <div className="ml-auto text-sm text-slate-400">
        {currentCanvas?.title || "Без названия"}
      </div>
    </div>
  );
};
