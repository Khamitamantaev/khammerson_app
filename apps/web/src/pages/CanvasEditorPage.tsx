import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useCanvasStore,
  useCurrentCanvas,
  useCurrentEdges,
  useCurrentNodes,
} from "@web/store/FlowStore";
import { NodeAddPanel } from "@web/components/panels/NodeAddPanel";
import { nodeTypes } from "@web/components/node/nodeTypes";
import { trpc } from "@web/trpc/client";
import { Toolbar } from "@web/components/main/Toolbar";
import { Sidebar } from "@web/components/canvas/Sidebar";
import { StatusBar } from "@web/components/main/StatusBar";
import { PropertiesPanel } from "@web/components/main/PropertiesPanel";

export const CanvasEditorPage = () => {
  const { projectId } = useParams();
  const nodes = useCurrentNodes();
  const edges = useCurrentEdges();
  const { actions, currentCanvasId } = useCanvasStore();
  // Загружаем канвасы проекта
  const { data: canvases = [] } = trpc.canvas.getProjectCanvases.useQuery(
    { projectId: projectId! },
    { enabled: !!projectId },
  );

  // Сохраняем канвасы и projectId в стор
  useEffect(() => {
    if (projectId) {
      actions.setCurrentProjectId(projectId);
    }
  }, [projectId, actions]);

  useEffect(() => {
    if (canvases.length > 0) {
      actions.setCanvases(canvases);
    }
  }, [canvases, actions]);

  const onConnect = useCallback(
    (params: any) => {
      if (!currentCanvasId || currentCanvasId === "global-library") return;
      const newEdge = { ...params, id: `e${params.source}-${params.target}` };
      actions.updateCurrentCanvasEdges((edges) => [...edges, newEdge]);
    },
    [actions, currentCanvasId],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!currentCanvasId || currentCanvasId === "global-library") return;

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `node-${Date.now()}`,
        type: type,
        data: {
          label: `Новая ${type}`,
          nodeType: type,
          content: type === "file" ? "// Содержимое файла" : null,
        },
        position,
      };

      actions.updateCurrentCanvasNodes((nodes) => [...nodes, newNode]);
    },
    [actions, currentCanvasId],
  );

  const onNodesChange = useCallback(
    (changes: any) => {
      if (!currentCanvasId || currentCanvasId === "global-library") return;
      actions.onNodesChange(changes);
    },
    [actions, currentCanvasId],
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      if (!currentCanvasId || currentCanvasId === "global-library") return;
      actions.onEdgesChange(changes);
    },
    [actions, currentCanvasId],
  );

  // Проверяем, выбран ли глобальный канвас
  const isGlobalCanvas = currentCanvasId === "global-library";

  return (
    <div className="flex h-screen pt-22 bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
      {/* Левая панель со списком канвасов */}
      <Sidebar />

      {/* Основная область */}
      <div className="flex-1 flex flex-col min-w-0">
        <Toolbar />

        {!currentCanvasId ? (
          // Если канвас не выбран - показываем заглушку
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <p className="text-lg mb-2">Выберите канвас из списка слева</p>
              <p className="text-sm">или создайте новый</p>
            </div>
          </div>
        ) : isGlobalCanvas ? (
          // Глобальная библиотека (пока заглушка)
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <p className="text-lg mb-2">Глобальная библиотека</p>
              <p className="text-sm">(в разработке)</p>
            </div>
          </div>
        ) : (
          // Редактор ReactFlow
          <div className="flex-1 relative min-w-0">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              minZoom={0.2}
              maxZoom={2}
              className="bg-slate-950/50"
            >
              <Background
                color="#64748b"
                gap={40}
                className="opacity-10"
                variant={BackgroundVariant.Dots}
              />
              <Controls
                position="top-right"
                className="top-4 right-4 bg-slate-900 border border-slate-800 [&_button]:bg-slate-800 [&_button]:border-slate-700 [&_button]:text-slate-400 [&_button:hover]:bg-cyan-500/20 [&_button:hover]:text-cyan-400"
              />
              <NodeAddPanel isCanvasListCollapsed={false} />
            </ReactFlow>
          </div>
        )}

        <StatusBar />
      </div>

      {/* Панель свойств (только для обычного режима) */}
      {currentCanvasId && !isGlobalCanvas && <PropertiesPanel />}
    </div>
  );
};
