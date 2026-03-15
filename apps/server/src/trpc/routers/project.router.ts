import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from '../trpc.service';
import { TRPCError } from '@trpc/server';
import { ProjectService } from '../../project/project.service';

@Injectable()
export class ProjectRouter {
  constructor(
    private readonly trpcService: TrpcService,
    private readonly projectService: ProjectService,
  ) {}

  get router() {
    return this.trpcService.router({
      // Получить все проекты пользователя
      getUserProjects: this.trpcService.protectedProcedure.query(
        async ({ ctx }) => {
          try {
            return await this.projectService.getUserProjects(ctx.user.id);
          } catch (error) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: (error as Error).message,
            });
          }
        },
      ),

      // Получить публичные проекты (глобальная библиотека)
      getPublicProjects: this.trpcService.publicProcedure
        .input(
          z
            .object({
              tags: z.array(z.string()).optional(),
              search: z.string().optional(),
              sortBy: z.enum(['stars', 'downloads', 'newest']).optional(),
            })
            .optional(),
        )
        .query(async ({ input }) => {
          try {
            return await this.projectService.getPublicProjects(input);
          } catch (error) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: (error as Error).message,
            });
          }
        }),

      // Получить проект по ID (для авторизованных)
      getOne: this.trpcService.protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
          try {
            return await this.projectService.getProject(input.id, ctx.user.id);
          } catch (error) {
            if ((error as Error).message === 'Project not found') {
              throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Проект не найден',
              });
            }
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: (error as Error).message,
            });
          }
        }),

      // Публичный просмотр проекта (без авторизации)
      getPublicOne: this.trpcService.publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
          try {
            return await this.projectService.getProject(input.id);
          } catch (error) {
            if ((error as Error).message === 'Project not found') {
              throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Проект не найден',
              });
            }
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: (error as Error).message,
            });
          }
        }),

      // Создать новый проект
      create: this.trpcService.protectedProcedure
        .input(
          z.object({
            title: z.string().min(1, 'Название обязательно'),
            description: z.string().optional(),
            isPublic: z.boolean().default(false),
            tags: z.array(z.string()).default([]),
          }),
        )
        .mutation(async ({ input, ctx }) => {
          try {
            return await this.projectService.createProject({
              title: input.title,
              description: input.description,
              isPublic: input.isPublic,
              tags: input.tags,
              ownerId: ctx.user.id,
            });
          } catch (error) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: (error as Error).message,
            });
          }
        }),

      // Обновить проект
      update: this.trpcService.protectedProcedure
        .input(
          z.object({
            id: z.string(),
            title: z.string().min(1).optional(),
            description: z.string().optional(),
            isPublic: z.boolean().optional(),
            tags: z.array(z.string()).optional(),
          }),
        )
        .mutation(async ({ input, ctx }) => {
          try {
            const { id, ...data } = input;
            return await this.projectService.updateProject(
              id,
              ctx.user.id,
              data,
            );
          } catch (error) {
            if (
              (error as Error).message ===
              'Project not found or you do not have permission'
            ) {
              throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Проект не найден или у вас нет прав',
              });
            }
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: (error as Error).message,
            });
          }
        }),

      // Удалить проект
      delete: this.trpcService.protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
          try {
            return await this.projectService.deleteProject(
              input.id,
              ctx.user.id,
            );
          } catch (error) {
            if (
              (error as Error).message ===
              'Project not found or you do not have permission'
            ) {
              throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Проект не найден или у вас нет прав',
              });
            }
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: (error as Error).message,
            });
          }
        }),

      // Поставить/убрать звезду
      toggleStar: this.trpcService.protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
          try {
            return await this.projectService.toggleStar(input.id, ctx.user.id);
          } catch (error) {
            if (
              (error as Error).message === 'You cannot star your own project'
            ) {
              throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'Нельзя ставить звезду своему проекту',
              });
            }
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: (error as Error).message,
            });
          }
        }),

      // Получить проект со всеми канвасами
      getWithCanvases: this.trpcService.protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
          try {
            return await this.projectService.getProjectWithCanvases(
              input.id,
              ctx.user.id,
            );
          } catch (error) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: (error as Error).message,
            });
          }
        }),

      // Скачать проект
      download: this.trpcService.protectedProcedure
        .input(
          z.object({
            id: z.string(),
            canvasId: z.string().optional(),
          }),
        )
        .mutation(async ({ input, ctx }) => {
          try {
            return await this.projectService.downloadProject(
              input.id,
              ctx.user.id,
              input.canvasId,
            );
          } catch (error) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: (error as Error).message,
            });
          }
        }),
    });
  }
}
