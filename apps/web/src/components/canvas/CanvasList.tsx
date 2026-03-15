import { Folder } from "lucide-react";
import { useCanvasStore } from "@web/store/FlowStore";
import { CanvasCard } from "./CanvasCard";
import { GlobalCanvasCard } from "./GlobalCanvasCard";

export const CanvasList = () => {
  const { currentCanvasId, canvases } = useCanvasStore();
  const GLOBAL_CANVAS_ID = "global-library";

  const handleCanvasSelect = (canvasId: string) => {
    const { actions } = useCanvasStore.getState();

    if (canvasId === GLOBAL_CANVAS_ID) {
      actions.setCurrentCanvasId(GLOBAL_CANVAS_ID);
      actions.setSelectedNode(null);
      actions.resetExpandedNodes();
    } else {
      actions.setCurrentCanvasId(canvasId);
      actions.setSelectedNode(null);
      actions.resetExpandedNodes();
    }
  };

  const isGlobalCanvasSelected = currentCanvasId === GLOBAL_CANVAS_ID;

  return (
    <div className="p-4 space-y-6 flex-1 overflow-y-auto">
      <h3 className="text-xl font-semibold text-slate-200 flex items-center gap-3">
        <Folder className="h-5 w-5 text-cyan-400" />
        Канвасы проекта
      </h3>

      <GlobalCanvasCard
        isSelected={isGlobalCanvasSelected}
        onSelect={() => handleCanvasSelect(GLOBAL_CANVAS_ID)}
      />

      <div className="space-y-2">
        {canvases?.map((canvas) => (
          <CanvasCard
            key={canvas.id}
            canvas={canvas}
            isSelected={currentCanvasId === canvas.id}
            onSelect={() => handleCanvasSelect(canvas.id)}
          />
        ))}
      </div>
    </div>
  );
};
