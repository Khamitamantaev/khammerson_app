import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from '../trpc.service';
import { TRPCError } from '@trpc/server';
import { CanvasService } from '../../canvas/canvas.service';

// Схемы валидации
const createCanvasSchema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  projectId: z.string().optional(), // Если канвас создается внутри проекта
});

const updateCanvasSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
});

@Injectable()
export class CanvasRouter {
  constructor(
    private readonly trpcService: TrpcService,
    private readonly canvasService: CanvasService,
  ) {}

  get router() {
    return this.trpcService.router({
      // Получить все канвасы пользователя
      getUserCanvases: this.trpcService.protectedProcedure.query(
        async ({ ctx }) => {
          try {
            return await this.canvasService.getUserCanvases(ctx.user.id);
          } catch (error) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: (error as Error).message,
            });
          }
        },
      ),

      // Получить канвасы проекта
      getProjectCanvases: this.trpcService.protectedProcedure
        .input(z.object({ projectId: z.string() }))
        .query(async ({ input, ctx }) => {
          try {
            return await this.canvasService.getProjectCanvases(
              input.projectId,
              ctx.user.id,
            );
          } catch (error) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: (error as Error).message,
            });
          }
        }),

      // Получить канвас по ID со всеми нодами и эджами
      getOne: this.trpcService.protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
          try {
            return await this.canvasService.getCanvas(input.id, ctx.user.id);
          } catch (error) {
            if ((error as Error).message === 'Canvas not found') {
              throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Канвас не найден',
              });
            }
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: (error as Error).message,
            });
          }
        }),

      // Создать новый канвас
      create: this.trpcService.protectedProcedure
        .input(createCanvasSchema)
        .mutation(async ({ input, ctx }) => {
          try {
            return await this.canvasService.createCanvas({
              title: input.title,
              description: input.description,
              projectId: input.projectId,
              ownerId: ctx.user.id,
            });
          } catch (error) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: (error as Error).message,
            });
          }
        }),

      // Обновить канвас
      update: this.trpcService.protectedProcedure
        .input(updateCanvasSchema)
        .mutation(async ({ input, ctx }) => {
          try {
            return await this.canvasService.updateCanvas(
              input.id,
              ctx.user.id,
              {
                title: input.title,
                description: input.description,
              },
            );
          } catch (error) {
            if ((error as Error).message === 'Canvas not found') {
              throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Канвас не найден',
              });
            }
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: (error as Error).message,
            });
          }
        }),

      // Удалить канвас
      delete: this.trpcService.protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
          try {
            return await this.canvasService.deleteCanvas(input.id, ctx.user.id);
          } catch (error) {
            if ((error as Error).message === 'Canvas not found') {
              throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Канвас не найден',
              });
            }
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: (error as Error).message,
            });
          }
        }),
    });
  }
}
