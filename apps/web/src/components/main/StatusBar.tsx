import { useCurrentNodes, useCurrentEdges } from "@web/store/FlowStore";
import { useCurrentCanvas } from "@web/store/FlowStore";

export const StatusBar = () => {
  const nodes = useCurrentNodes();
  const edges = useCurrentEdges();
  const activeCanvas = useCurrentCanvas();

  return (
    <div className="bg-slate-900/80 border-t border-slate-800 p-3 text-sm text-slate-400 flex items-center justify-between">
      <div className="flex items-center gap-5">
        <span>
          Узлов: <span className="font-medium text-white">{nodes.length}</span>
        </span>
        <span>
          Связей: <span className="font-medium text-white">{edges.length}</span>
        </span>
        <span>
          Канвас:{" "}
          <span className="text-green-400 font-medium">
            {activeCanvas?.title || "Не выбран"}
          </span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500">v1.0.0</span>
      </div>
    </div>
  );
};
