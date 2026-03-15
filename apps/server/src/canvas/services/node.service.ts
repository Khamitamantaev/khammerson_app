import { Injectable, NotFoundException } from '@nestjs/common';
import { NodeRepository } from '../repositories/node.repository';
import { CanvasRepository } from '../repositories/canvas.repository';

interface CreateNodeData {
  canvasId: string;
  type?: string;
  position: { x: number; y: number };
  parentId?: string | null;
  data: {
    code?: string;
    description?: string;
    label?: string;
    image?: string | null;
  };
}

interface UpdateNodeData {
  position?: { x?: number; y?: number };
  parentId?: string | null;
  children?: string[];
  type?: string;
  nodeType?: string;
  rating?: number;
  usageCount?: number;
  views?: number;
  isPublic?: boolean;
  tags?: string[];
  data?: {
    label?: string;
    description?: string;
    code?: string;
    image?: string | null;
    filePath?: string;
    customPage?: any;
  };
}

@Injectable()
export class NodeService {
  constructor(
    private readonly nodeRepository: NodeRepository,
    private readonly canvasRepository: CanvasRepository,
  ) {}

  async getCanvasNodes(canvasId: string, userId: string) {
    // Проверяем доступ к канвасу
    const canvas = await this.canvasRepository.findById(canvasId, userId);
    if (!canvas) {
      throw new NotFoundException('Canvas not found or access denied');
    }

    return this.nodeRepository.findCanvasNodes(canvasId);
  }

  async getNode(nodeId: string, userId?: string) {
    // Получаем ноду
    const node = await this.nodeRepository.findById(nodeId);
    if (!node) {
      throw new NotFoundException('Node not found');
    }

    // Если передан userId, проверяем доступ к канвасу
    if (userId) {
      const canvas = await this.canvasRepository.findById(
        node.canvasId,
        userId,
      );
      if (!canvas) {
        throw new NotFoundException('Access denied');
      }
    }

    return node;
  }

  async createNode(data: CreateNodeData, userId: string) {
    // Проверяем доступ к канвасу
    const canvas = await this.canvasRepository.findById(data.canvasId, userId);
    if (!canvas) {
      throw new NotFoundException('Canvas not found or access denied');
    }

    // Создаем ноду
    return this.nodeRepository.create({
      canvasId: data.canvasId,
      type: data.type || 'default',
      positionX: data.position.x,
      positionY: data.position.y,
      parentId: data.parentId,
      children: [],
      data: {
        code: data.data.code || '',
        label: data.data.label || 'Новая нода',
        description: data.data.description || '',
        image: data.data.image || null,
      },
    });
  }

  async updateNode(nodeId: string, data: UpdateNodeData, userId: string) {
    // Проверяем доступ
    await this.getNode(nodeId, userId);

    const updates: any = {};

    if (data.position) {
      updates.positionX = data.position.x;
      updates.positionY = data.position.y;
    }

    if (data.parentId !== undefined) {
      updates.parentId = data.parentId;
    }

    if (data.children !== undefined) {
      updates.children = data.children;
    }

    if (data.type !== undefined) {
      updates.type = data.type;
    }

    if (data.nodeType !== undefined) {
      updates.nodeType = data.nodeType;
    }

    if (data.rating !== undefined) {
      updates.rating = data.rating;
    }

    if (data.usageCount !== undefined) {
      updates.usageCount = data.usageCount;
    }

    if (data.views !== undefined) {
      updates.views = data.views;
    }

    if (data.isPublic !== undefined) {
      updates.isPublic = data.isPublic;
    }

    if (data.tags !== undefined) {
      updates.tags = data.tags;
    }

    if (data.data) {
      updates.data = data.data;
    }

    return this.nodeRepository.update(nodeId, updates);
  }

  async updateNodePosition(
    nodeId: string,
    position: { x: number; y: number },
    userId: string,
  ) {
    // Проверяем доступ
    await this.getNode(nodeId, userId);

    const updated = await this.nodeRepository.updatePosition(
      nodeId,
      position.x,
      position.y,
    );

    if (!updated) {
      throw new NotFoundException('Node not found');
    }

    return { success: true };
  }

  async deleteNode(nodeId: string, userId: string) {
    // Проверяем доступ
    await this.getNode(nodeId, userId);

    const deleted = await this.nodeRepository.delete(nodeId);

    if (!deleted) {
      throw new NotFoundException('Node not found');
    }

    return { success: true };
  }

  async deleteManyNodes(nodeIds: string[], userId: string) {
    // Проверяем доступ для всех нод
    for (const nodeId of nodeIds) {
      await this.getNode(nodeId, userId);
    }

    const count = await this.nodeRepository.deleteMany(nodeIds);

    return {
      deleted: count,
      message: `Удалено ${count} нод`,
    };
  }

  async countCanvasNodes(canvasId: string, userId: string) {
    // Проверяем доступ к канвасу
    const canvas = await this.canvasRepository.findById(canvasId, userId);
    if (!canvas) {
      throw new NotFoundException('Canvas not found or access denied');
    }

    const count = await this.nodeRepository.countCanvasNodes(canvasId);
    return { count };
  }

  async getNodeChildren(nodeId: string, userId: string) {
    // Получаем ноду с проверкой доступа
    const node = await this.getNode(nodeId, userId);

    if (!node.children || node.children.length === 0) {
      return [];
    }

    // Получаем все дочерние ноды
    return this.nodeRepository.findManyByIds(node.children);
  }
}
