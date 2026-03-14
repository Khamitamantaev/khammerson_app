import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect, useCallback, useState } from "react";
import {
  useCanvasStore,
  useCurrentCanvas,
  useCurrentEdges,
  useCurrentNodes,
} from "@web/store/FlowStore";
import { CanvasList } from "@web/components/canvas/CanvasList";
import { NodeAddPanel } from "@web/components/panels/NodeAddPanel";

const createTestCanvas = () => ({
  id: `canvas-${Date.now()}`,
  title: "Тестовый проект",
  description: "Просто для проверки",
  nodes: [
    {
      id: "1",
      type: "default",
      data: { label: "Папка src" },
      position: { x: 250, y: 100 },
    },
    {
      id: "2",
      data: { label: "Файл index.ts" },
      position: { x: 100, y: 200 },
    },
    {
      id: "3",
      data: { label: "Файл App.tsx" },
      position: { x: 400, y: 200 },
    },
  ],
  edges: [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e1-3", source: "1", target: "3" },
  ],
});

export const CanvasEditorPage = () => {
  const nodes = useCurrentNodes();
  const edges = useCurrentEdges();
  const currentCanvas = useCurrentCanvas();
  const { actions, currentCanvasId } = useCanvasStore();
  const [isCanvasListCollapsed, setIsCanvasListCollapsed] = useState(false);

  useEffect(() => {
    if (!currentCanvasId) {
      const testCanvas = createTestCanvas();
      actions.addCanvas(testCanvas);
      actions.setCurrentCanvasId(testCanvas.id);
    }
  }, [currentCanvasId, actions]);

  const onConnect = useCallback(
    (params: any) => {
      const newEdge = { ...params, id: `e${params.source}-${params.target}` };
      actions.updateCurrentCanvasEdges((edges) => [...edges, newEdge]);
    },
    [actions],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      // Получаем координаты относительно канваса
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `node-${Date.now()}`,
        type: type === "folder" || type === "file" ? "default" : type,
        data: {
          label: `Новая ${type}`,
          nodeType: type,
          content: type === "file" ? "// Содержимое файла" : null,
        },
        position,
      };

      actions.updateCurrentCanvasNodes((nodes) => [...nodes, newNode]);
    },
    [actions],
  );

  return (
    <div className="h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Основной контейнер с flex на всю высоту */}
      <div className="flex h-full pt-22">
        {/* Левая панель со списком канвасов - фиксированная ширина */}
        <div className="w-72 flex-shrink-0 h-full">
          <CanvasList
            isCollapsed={isCanvasListCollapsed}
            onCollapse={setIsCanvasListCollapsed}
          />
        </div>

        {/* Правая часть с ReactFlow - занимает всё оставшееся место */}
        <div className="flex-1 h-full relative">
          <div className="absolute inset-0" style={{ top: "72px" }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={actions.onNodesChange}
              onEdgesChange={actions.onEdgesChange}
              onConnect={onConnect}
              onDragOver={onDragOver}
              onDrop={onDrop}
              fitView
              className="bg-slate-950/50 w-full h-full"
            >
              <Background
                color="#334155"
                gap={40}
                variant={BackgroundVariant.Dots}
                className="opacity-20"
              />
              <Controls
                position="top-right"
                className="top-4 right-4 bg-slate-900 border border-slate-800 [&_button]:bg-slate-800 [&_button]:border-slate-700 [&_button]:text-slate-400 [&_button:hover]:bg-cyan-500/20 [&_button:hover]:text-cyan-400"
              />
              <NodeAddPanel isCanvasListCollapsed={isCanvasListCollapsed} />
            </ReactFlow>
          </div>
        </div>
      </div>
    </div>
  );
};
