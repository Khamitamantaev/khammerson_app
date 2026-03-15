import { Injectable, NotFoundException } from '@nestjs/common';
import { CanvasRepository } from './repositories/canvas.repository';
import { NodeRepository } from './repositories/node.repository';
import { EdgeRepository } from './repositories/edge.repository';
import { TransformService } from './services/transform.service';

@Injectable()
export class CanvasService {
  constructor(
    private readonly canvasRepository: CanvasRepository,
    private readonly nodeRepository: NodeRepository,
    private readonly edgeRepository: EdgeRepository,
    private readonly transformService: TransformService,
  ) {}

  async getUserCanvases(userId: string) {
    const canvases = await this.canvasRepository.findUserCanvases(userId);

    const results = await Promise.all(
      canvases.map(async (canvas) => {
        const [nodes, edges] = await Promise.all([
          this.nodeRepository.findCanvasNodes(canvas.id),
          this.edgeRepository.findCanvasEdges(canvas.id),
        ]);

        return this.transformService.transformUserCanvasForFrontend(
          canvas,
          nodes,
          edges,
        );
      }),
    );

    return results;
  }

  async getProjectCanvases(projectId: string, userId: string) {
    const canvases = await this.canvasRepository.findProjectCanvases(
      projectId,
      userId,
    );

    const results = await Promise.all(
      canvases.map(async (canvas) => {
        const [nodes, edges] = await Promise.all([
          this.nodeRepository.findCanvasNodes(canvas.id),
          this.edgeRepository.findCanvasEdges(canvas.id),
        ]);

        return this.transformService.transformUserCanvasForFrontend(
          canvas,
          nodes,
          edges,
        );
      }),
    );

    return results;
  }

  async getCanvas(id: string, userId: string) {
    const canvas = await this.canvasRepository.findById(id, userId);
    if (!canvas) {
      throw new NotFoundException('Canvas not found');
    }

    const [nodes, edges] = await Promise.all([
      this.nodeRepository.findCanvasNodes(id),
      this.edgeRepository.findCanvasEdges(id),
    ]);

    return this.transformService.transformCanvasForFrontend(
      canvas,
      nodes,
      edges,
    );
  }

  async createCanvas(data: {
    title: string;
    description?: string;
    projectId: string;
    ownerId: string;
  }) {
    const canvas = await this.canvasRepository.create(data);
    return canvas;
  }

  async updateCanvas(
    id: string,
    userId: string,
    data: { title?: string; description?: string; projectId?: string },
  ) {
    const canvas = await this.canvasRepository.update(id, userId, data);
    if (!canvas) {
      throw new NotFoundException('Canvas not found');
    }
    return canvas;
  }

  async deleteCanvas(id: string, userId: string) {
    const deleted = await this.canvasRepository.delete(id, userId);
    if (!deleted) {
      throw new NotFoundException('Canvas not found');
    }
    return { success: deleted };
  }
}
