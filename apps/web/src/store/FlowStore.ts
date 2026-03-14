import { create } from "zustand";
import {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import { useShallow } from 'zustand/react/shallow';

// Базовые типы
export interface NodeData {
  label?: string;
  parentId?: string | null; // опционально, если нужно хранить иерархию
  [key: string]: unknown;
}

export type CustomNode = Node<NodeData>;
export type CustomEdge = Edge;

export interface Canvas {
  id: string;
  title: string;
  description?: string;
  nodes: CustomNode[];
  edges: CustomEdge[];
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
}

interface CanvasState {
  // Данные
  canvases: Canvas[];
  currentCanvasId: string | null;
  selectedNode: CustomNode | null;
  expandedNodes: Set<string>; // для сворачивания/разворачивания узлов в дереве

  // UI состояние (опционально)
  isLoading: boolean;
  error: string | null;

  // Actions
  actions: {
    // Управление канвасами
    setCanvases: (canvases: Canvas[]) => void;
    addCanvas: (canvas: Canvas) => void;
    updateCanvas: (id: string, updates: Partial<Canvas>) => void;
    deleteCanvas: (id: string) => void;
    setCurrentCanvasId: (id: string | null) => void;

    // Управление узлами и связями текущего канваса
    updateCurrentCanvasNodes: (
      updater: (nodes: CustomNode[]) => CustomNode[],
    ) => void;
    updateCurrentCanvasEdges: (
      updater: (edges: CustomEdge[]) => CustomEdge[],
    ) => void;
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;

    // Выбор узла
    setSelectedNode: (node: CustomNode | null) => void;

    // Работа с expandedNodes (для дерева)
    expandNode: (nodeId: string) => void;
    collapseNode: (nodeId: string) => void;
    toggleNode: (nodeId: string) => void;
    resetExpandedNodes: () => void;

    // Вспомогательные методы (опционально)
    getNodeById: (id: string) => CustomNode | null;
    getChildNodes: (parentId: string) => CustomNode[]; // через edges

    // Сброс ошибок
    clearError: () => void;
  };
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  canvases: [],
  currentCanvasId: null,
  selectedNode: null,
  expandedNodes: new Set<string>(),
  isLoading: false,
  error: null,

  actions: {
    // Канвасы
    setCanvases: (canvases) => set({ canvases }),
    addCanvas: (canvas) =>
      set((state) => ({ canvases: [...state.canvases, canvas] })),
    updateCanvas: (id, updates) =>
      set((state) => ({
        canvases: state.canvases.map((c) =>
          c.id === id ? { ...c, ...updates } : c,
        ),
      })),
    deleteCanvas: (id) =>
      set((state) => ({
        canvases: state.canvases.filter((c) => c.id !== id),
        currentCanvasId:
          state.currentCanvasId === id ? null : state.currentCanvasId,
      })),
    setCurrentCanvasId: (id) =>
      set({
        currentCanvasId: id,
        selectedNode: null,
        expandedNodes: new Set<string>(),
      }),

    // Обновление узлов текущего канваса
    updateCurrentCanvasNodes: (updater) => {
      const { currentCanvasId } = get();
      if (!currentCanvasId) return;
      set((state) => ({
        canvases: state.canvases.map((c) =>
          c.id === currentCanvasId ? { ...c, nodes: updater(c.nodes) } : c,
        ),
      }));
    },
    updateCurrentCanvasEdges: (updater) => {
      const { currentCanvasId } = get();
      if (!currentCanvasId) return;
      set((state) => ({
        canvases: state.canvases.map((c) =>
          c.id === currentCanvasId ? { ...c, edges: updater(c.edges) } : c,
        ),
      }));
    },

    // React Flow изменения
    onNodesChange: (changes) => {
      const { currentCanvasId } = get();
      if (!currentCanvasId) return;
      set((state) => ({
        canvases: state.canvases.map((c) =>
          c.id === currentCanvasId
            ? {
                ...c,
                nodes: applyNodeChanges(changes, c.nodes) as CustomNode[],
              }
            : c,
        ),
      }));
    },
    onEdgesChange: (changes) => {
      const { currentCanvasId } = get();
      if (!currentCanvasId) return;
      set((state) => ({
        canvases: state.canvases.map((c) =>
          c.id === currentCanvasId
            ? {
                ...c,
                edges: applyEdgeChanges(changes, c.edges) as CustomEdge[],
              }
            : c,
        ),
      }));
    },

    // Выбор узла
    setSelectedNode: (node) => set({ selectedNode: node }),

    // Expanded nodes
    expandNode: (nodeId) =>
      set((state) => {
        const newSet = new Set(state.expandedNodes);
        newSet.add(nodeId);
        return { expandedNodes: newSet };
      }),
    collapseNode: (nodeId) =>
      set((state) => {
        const newSet = new Set(state.expandedNodes);
        newSet.delete(nodeId);
        return { expandedNodes: newSet };
      }),
    toggleNode: (nodeId) =>
      set((state) => {
        const newSet = new Set(state.expandedNodes);
        if (newSet.has(nodeId)) {
          newSet.delete(nodeId);
        } else {
          newSet.add(nodeId);
        }
        return { expandedNodes: newSet };
      }),
    resetExpandedNodes: () => set({ expandedNodes: new Set<string>() }),

    // Вспомогательные методы
    getNodeById: (id) => {
      const { currentCanvasId, canvases } = get();
      if (!currentCanvasId) return null;
      const canvas = canvases.find((c) => c.id === currentCanvasId);
      return canvas?.nodes.find((n) => n.id === id) ?? null;
    },
    getChildNodes: (parentId) => {
      const { currentCanvasId, canvases } = get();
      if (!currentCanvasId) return [];
      const canvas = canvases.find((c) => c.id === currentCanvasId);
      if (!canvas) return [];
      const childEdges = canvas.edges.filter((e) => e.source === parentId);
      const childIds = childEdges.map((e) => e.target);
      return canvas.nodes.filter((n) => childIds.includes(n.id));
    },

    clearError: () => set({ error: null }),
  },
}));

// Селекторы для удобства
export const useCurrentCanvas = () =>
  useCanvasStore((state) =>
    state.currentCanvasId
      ? state.canvases.find((c) => c.id === state.currentCanvasId)
      : null,
  );

export const useCurrentNodes = () => {
  return useCanvasStore(
    useShallow((state) => {
      if (!state.currentCanvasId) return [];
      const canvas = state.canvases.find((c) => c.id === state.currentCanvasId);
      return canvas?.nodes ?? [];
    }),
  );
};

export const useCurrentEdges = () => {
  return useCanvasStore(
    useShallow((state) => {
      if (!state.currentCanvasId) return [];
      const canvas = state.canvases.find((c) => c.id === state.currentCanvasId);
      return canvas?.edges ?? [];
    }),
  );
};

export const useNodeActions = () => useCanvasStore((state) => state.actions);
