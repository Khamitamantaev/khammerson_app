// src/modules/project/project.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ProjectRepository } from './repositories/project.repository';
import { EdgeRepository } from '../canvas/repositories/edge.repository';
import { NodeRepository } from '../canvas/repositories/node.repository';
import { CanvasRepository } from '../canvas/repositories/canvas.repository';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly canvasRepository: CanvasRepository,
    private readonly nodeRepository: NodeRepository,
    private readonly edgeRepository: EdgeRepository,
  ) {}

  async getUserProjects(userId: string) {
    const projects = await this.projectRepository.findUserProjects(userId);
    return projects;
  }

  async getPublicProjects(filters?: {
    tags?: string[];
    search?: string;
    sortBy?: 'stars' | 'downloads' | 'newest';
  }) {
    return this.projectRepository.findPublicProjects(filters);
  }

  async getProject(id: string, userId?: string) {
    const project = await this.projectRepository.findById(id, userId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Если проект не публичный и пользователь не владелец
    if (!project.isPublic && userId && project.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return project;
  }

  async createProject(data: {
    title: string;
    description?: string;
    ownerId: string;
    isPublic?: boolean;
    tags?: string[];
  }) {
    return this.projectRepository.create(data);
  }

  async updateProject(
    id: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      isPublic?: boolean;
      tags?: string[];
    },
  ) {
    const project = await this.projectRepository.update(id, userId, data);

    if (!project) {
      throw new NotFoundException(
        'Project not found or you do not have permission',
      );
    }

    return project;
  }

  async deleteProject(id: string, userId: string) {
    const deleted = await this.projectRepository.delete(id, userId);

    if (!deleted) {
      throw new NotFoundException(
        'Project not found or you do not have permission',
      );
    }

    return { success: true };
  }

  async toggleStar(projectId: string, userId: string) {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Нельзя ставить звезду своему проекту
    if (project.ownerId === userId) {
      throw new ForbiddenException('You cannot star your own project');
    }

    return this.projectRepository.toggleStar(projectId, userId);
  }

  async getProjectWithCanvases(projectId: string, userId: string) {
    const project = await this.getProject(projectId, userId);

    const canvases = await this.canvasRepository.findProjectCanvases(
      projectId,
      userId,
    );

    // Получаем данные для каждого канваса
    const canvasesWithData = await Promise.all(
      canvases.map(async (canvas) => {
        const [nodes, edges] = await Promise.all([
          this.nodeRepository.findCanvasNodes(canvas.id),
          this.edgeRepository.findCanvasEdges(canvas.id),
        ]);

        return {
          ...canvas,
          nodes,
          edges,
          _count: {
            nodes: nodes.length,
            edges: edges.length,
          },
        };
      }),
    );

    return {
      ...project,
      canvases: canvasesWithData,
      _count: {
        ...project._count,
        canvases: canvases.length,
      },
    };
  }

  async downloadProject(projectId: string, userId: string, canvasId?: string) {
    const project = await this.getProject(projectId);

    // Проверяем доступ (публичный или свой)
    if (!project.isPublic && project.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    // Увеличиваем счетчик скачиваний
    await this.projectRepository.incrementDownloads(
      projectId,
      userId,
      canvasId,
    );

    return {
      projectId: project.id,
      title: project.title,
      message: 'Download started',
    };
  }

  async forkProject(projectId: string, userId: string) {
    const project = await this.getProject(projectId);

    if (!project.isPublic) {
      throw new ForbiddenException('Cannot fork private project');
    }

    // Создаем новый проект на основе существующего
    const forkedProject = await this.projectRepository.create({
      title: `${project.title} (fork)`,
      description: project.description,
      ownerId: userId,
      isPublic: false,
      tags: project.tags,
    });

    // Копируем канвасы, ноды, эджи
    // TODO: добавить логику копирования

    return forkedProject;
  }
}
