import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Download,
  Plus,
  Folder,
  File,
  Package,
  GitBranch,
  Star,
  Archive,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import {
  useCanvasStore,
  useCurrentCanvas,
  useCurrentEdges,
  useCurrentNodes,
} from "@web/store/FlowStore";

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

// Компонент плавающей панели с элементами
const FloatingElementsPanel = ({
  onDragStart,
}: {
  onDragStart: (e: React.DragEvent, type: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const nodes = useCurrentNodes();
  const edges = useCurrentEdges();

  const elements = [
    { type: "folder", label: "Папка", icon: Folder },
    { type: "file", label: "Файл", icon: File },
    { type: "package", label: "Пакет", icon: Package },
    { type: "branch", label: "Ветка", icon: GitBranch },
    { type: "starred", label: "Избранное", icon: Star },
    { type: "archived", label: "Архив", icon: Archive },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      {/* Кнопка-триггер для сворачивания/разворачивания */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -top-10 right-0 p-2 bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors"
      >
        {isOpen ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden w-64"
          >
            {/* Заголовок */}
            <div className="px-4 py-3 border-b border-slate-800">
              <h3 className="text-sm font-medium text-slate-300">Элементы</h3>
            </div>

            {/* Сетка элементов */}
            <div className="p-4 grid grid-cols-3 gap-2">
              {elements.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.type}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-lg border border-transparent hover:border-cyan-500/30 hover:bg-cyan-500/10 cursor-grab active:cursor-grabbing transition-all group"
                    draggable
                    onDragStart={(e) => onDragStart(e, item.type)}
                  >
                    <Icon className="h-5 w-5 text-slate-400 group-hover:text-cyan-400" />
                    <span className="text-[10px] text-slate-500 group-hover:text-cyan-400">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Статистика проекта */}
            <div className="px-4 py-3 bg-slate-950/50 border-t border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Ноды</span>
                <span className="text-slate-300">{nodes.length}</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-slate-500">Связи</span>
                <span className="text-slate-300">{edges.length}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Компонент мини-панели действий
const MiniActionsPanel = ({
  onAddNode,
  onSave,
}: {
  onAddNode: () => void;
  onSave: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-6 left-6 z-50 flex gap-2"
    >
      <button
        onClick={onSave}
        className="p-3 bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-xl text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
        title="Сохранить"
      >
        <Save className="h-4 w-4" />
      </button>
      <button
        className="p-3 bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-xl text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
        title="Скачать"
      >
        <Download className="h-4 w-4" />
      </button>
      <button
        onClick={onAddNode}
        className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-600 hover:to-blue-700 transition-all"
        title="Добавить ноду"
      >
        <Plus className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

export const CanvasEditorPage = () => {
  const nodes = useCurrentNodes();
  const edges = useCurrentEdges();
  const currentCanvas = useCurrentCanvas();
  const { actions, currentCanvasId } = useCanvasStore();

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

  const handleAddNode = useCallback(() => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: "default",
      data: { label: "Новая нода", nodeType: "default" },
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
    };
    actions.updateCurrentCanvasNodes((nodes) => [...nodes, newNode]);
  }, [actions]);

  const handleSave = useCallback(() => {
    if (!currentCanvas) return;
    localStorage.setItem(
      `canvas-${currentCanvas.id}`,
      JSON.stringify(currentCanvas),
    );
    console.log("Canvas saved:", currentCanvas);
  }, [currentCanvas]);

  return (
    <div className="h-screen bg-gradient-to-b from-slate-950 to-slate-900 pt-16">
      {/* React Flow область */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full h-full bg-slate-950/50"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={actions.onNodesChange}
          onEdgesChange={actions.onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          fitView
          className="bg-slate-950/50"
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
        </ReactFlow>
      </motion.div>

      {/* Плавающие панели */}
      <FloatingElementsPanel
        onDragStart={(e, type) => {
          e.dataTransfer.setData("application/reactflow", type);
          e.dataTransfer.effectAllowed = "move";
        }}
      />
      <MiniActionsPanel onAddNode={handleAddNode} onSave={handleSave} />
    </div>
  );
};
