// src/modules/canvas/services/transform.service.ts
import { Injectable } from '@nestjs/common';

export interface Node {
  id: string;
  canvasId: string;
  positionX: number;
  positionY: number;
  type?: string | null;
  nodeType: string;
  rating: number;
  usageCount: number;
  views: number;
  isPublic: boolean;
  tags: string[];
  authorId?: string | null;
  originalGlobalNodeId?: string | null;
  parentId?: string | null;
  children: string[];
  data?: {
    id: string;
    label?: string | null;
    description?: string | null;
    code?: string | null;
    filePath?: string | null;
    image?: string | null;
    customPage?: any;
  } | null;
  author?: {
    id: string;
    userName: string;
    email: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Edge {
  id: string;
  sourceId: string;
  targetId: string;
  type?: string | null;
  canvasId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable()
export class TransformService {
  transformNodes(nodes: Node[]): any[] {
    return nodes.map((node) => ({
      id: node.id,
      position: { x: node.positionX, y: node.positionY },
      type: node.type || 'customType',
      data: {
        dataId: node.data?.id || '',
        id: node.data?.id || '',
        label: node.data?.label || '',
        description: node.data?.description || '',
        code: node.data?.code || '',
        node: { id: node.data?.id || node.id },
        customPage: node.data?.customPage || null,
        parentId: node.parentId || '',
        children: node.children || [],
        canvasId: node.canvasId,
        filePath: node.data?.filePath || '',
        image: node.data?.image || '',
        nodeType: node.nodeType || 'LOCAL',
        rating: node.rating || 0,
        usageCount: node.usageCount || 0,
        views: node.views || 0,
        isPublic: node.isPublic || false,
        tags: node.tags || [],
        authorId: node.authorId || null,
        author: node.author
          ? {
              id: node.author.id,
              userName: node.author.userName,
              email: node.author.email,
            }
          : undefined,
        originalGlobalNodeId: node.originalGlobalNodeId || null,
        createdAt: node.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: node.updatedAt?.toISOString() || new Date().toISOString(),
      },
    }));
  }

  transformEdges(edges: Edge[]): any[] {
    return edges.map((edge) => ({
      id: edge.id,
      source: edge.sourceId,
      target: edge.targetId,
      type: edge.type || 'custom-edge',
      canvasId: edge.canvasId,
    }));
  }

  // Для CanvasService.getCanvas
  transformCanvasForFrontend(canvas: any, nodes: Node[], edges: Edge[]) {
    return {
      id: canvas.id,
      title: canvas.title,
      description: canvas.description,
      projectId: canvas.projectId,
      ownerId: canvas.ownerId,
      nodes: this.transformNodes(nodes),
      edges: this.transformEdges(edges),
    };
  }

  // Для CanvasService.getUserCanvases
  transformUserCanvasForFrontend(canvas: any, nodes: Node[], edges: Edge[]) {
    return {
      id: canvas.id,
      title: canvas.title,
      description: canvas.description,
      projectId: canvas.projectId,
      ownerId: canvas.ownerId,
      createdAt: canvas.createdAt,
      updatedAt: canvas.updatedAt,
      nodes: this.transformNodes(nodes),
      edges: this.transformEdges(edges),
      _count: canvas._count || {
        nodes: nodes.length,
        edges: edges.length,
      },
    };
  }

  // ============ ЗАКОММЕНТИРОВАННЫЕ МЕТОДЫ (на будущее) ============

  /*
  // Обратное преобразование для сохранения
  transformNodeForDatabase(frontendNode: any): {
    node: Partial<Node>;
    nodeData: Partial<Node['data']>;
  } {
    return {
      node: {
        positionX: frontendNode.position?.x || 0,
        positionY: frontendNode.position?.y || 0,
        type: frontendNode.type,
        nodeType: frontendNode.data?.nodeType || 'LOCAL',
        rating: frontendNode.data?.rating || 0,
        usageCount: frontendNode.data?.usageCount || 0,
        views: frontendNode.data?.views || 0,
        isPublic: frontendNode.data?.isPublic || false,
        tags: frontendNode.data?.tags || [],
        authorId: frontendNode.data?.authorId || null,
        originalGlobalNodeId: frontendNode.data?.originalGlobalNodeId || null,
        parentId: frontendNode.data?.parentId || null,
        children: frontendNode.data?.children || [],
      },
      nodeData: {
        label: frontendNode.data?.label || '',
        description: frontendNode.data?.description || '',
        code: frontendNode.data?.code || '',
        filePath: frontendNode.data?.filePath || '',
        image: frontendNode.data?.image || '',
        customPage: frontendNode.data?.customPage || null,
      },
    };
  }

  transformEdgeForDatabase(frontendEdge: any): Partial<Edge> {
    return {
      sourceId: frontendEdge.source,
      targetId: frontendEdge.target,
      type: frontendEdge.type || 'custom-edge',
      canvasId: frontendEdge.canvasId,
    };
  }

  // Утилиты для работы с детьми/родителями
  extractParentChildRelations(nodes: any[]): Array<{
    parentId: string;
    childId: string;
  }> {
    const relations: Array<{ parentId: string; childId: string }> = [];

    nodes.forEach((node) => {
      if (node.data?.parentId) {
        relations.push({
          parentId: node.data.parentId,
          childId: node.id,
        });
      }

      if (node.data?.children && node.data.children.length > 0) {
        node.data.children.forEach((childId: string) => {
          relations.push({
            parentId: node.id,
            childId,
          });
        });
      }
    });

    return relations;
  }
  */
}
