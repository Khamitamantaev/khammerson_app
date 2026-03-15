import { Injectable, NotFoundException } from '@nestjs/common';
import { EdgeRepository } from '../repositories/edge.repository';
import { CanvasRepository } from '../repositories/canvas.repository';
import { NodeRepository } from '../repositories/node.repository';

interface CreateEdgeData {
  source: string;
  target: string;
  type?: string;
  canvasId: string;
}

@Injectable()
export class EdgeService {
  constructor(
    private readonly edgeRepository: EdgeRepository,
    private readonly canvasRepository: CanvasRepository,
    private readonly nodeRepository: NodeRepository,
  ) {}

  async getCanvasEdges(canvasId: string, userId: string) {
    // Проверяем доступ к канвасу
    const canvas = await this.canvasRepository.findById(canvasId, userId);
    if (!canvas) {
      throw new NotFoundException('Canvas not found or access denied');
    }

    return this.edgeRepository.findCanvasEdgesWithNodes(canvasId);
  }

  async getEdge(id: string, userId: string) {
    // Получаем эдж с нодами
    const edge = await this.edgeRepository.findByIdWithNodes(id);
    if (!edge) {
      throw new NotFoundException('Edge not found');
    }

    // Проверяем доступ к канвасу
    const canvas = await this.canvasRepository.findById(edge.canvasId, userId);
    if (!canvas) {
      throw new NotFoundException('Access denied');
    }

    return edge;
  }

  async createEdge(data: CreateEdgeData, userId: string) {
    // Проверяем доступ к канвасу
    const canvas = await this.canvasRepository.findById(data.canvasId, userId);
    if (!canvas) {
      throw new NotFoundException('Canvas not found or access denied');
    }

    // Проверяем существование source и target нод
    const [sourceNode, targetNode] = await Promise.all([
      this.nodeRepository.findById(data.source),
      this.nodeRepository.findById(data.target),
    ]);

    if (!sourceNode || !targetNode) {
      throw new NotFoundException('Source or target node not found');
    }

    // Проверяем что ноды принадлежат этому канвасу
    if (
      sourceNode.canvasId !== data.canvasId ||
      targetNode.canvasId !== data.canvasId
    ) {
      throw new NotFoundException('Nodes do not belong to this canvas');
    }

    // Создаем эдж через транзакционный метод репозитория
    const edge = await this.edgeRepository.createEdgeAndUpdateNode({
      sourceId: data.source,
      targetId: data.target,
      type: data.type,
      canvasId: data.canvasId,
    });

    return edge;
  }

  async deleteEdge(edgeId: string, userId: string) {
    // Получаем эдж
    const edge = await this.edgeRepository.findById(edgeId);
    if (!edge) {
      return null;
    }

    // Проверяем доступ к канвасу
    const canvas = await this.canvasRepository.findById(edge.canvasId, userId);
    if (!canvas) {
      throw new NotFoundException('Access denied');
    }

    // Удаляем эдж через транзакционный метод репозитория
    const result = await this.edgeRepository.deleteEdgeAndUpdateNode(edgeId);

    if (result.deleted) {
      return {
        id: edgeId,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
        deleted: true,
      };
    }

    return null;
  }

  async updateEdgeType(edgeId: string, type: string, userId: string) {
    // Получаем эдж
    const edge = await this.edgeRepository.findById(edgeId);
    if (!edge) {
      throw new NotFoundException('Edge not found');
    }

    // Проверяем доступ к канвасу
    const canvas = await this.canvasRepository.findById(edge.canvasId, userId);
    if (!canvas) {
      throw new NotFoundException('Access denied');
    }

    // Обновляем тип
    const updatedEdge = await this.edgeRepository.update(edgeId, { type });
    if (!updatedEdge) {
      throw new NotFoundException('Edge not found after update');
    }

    return updatedEdge;
  }

  async deleteCanvasEdges(canvasId: string, userId: string) {
    // Проверяем доступ к канвасу
    const canvas = await this.canvasRepository.findById(canvasId, userId);
    if (!canvas) {
      throw new NotFoundException('Canvas not found or access denied');
    }

    // Удаляем все эджи канваса
    const count = await this.edgeRepository.deleteCanvasEdges(canvasId);

    return {
      deleted: count,
      message: `Удалено ${count} связей`,
    };
  }
}
