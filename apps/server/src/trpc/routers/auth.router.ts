import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from '../trpc.service';
import { TRPCError } from '@trpc/server';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class AuthRouter {
  constructor(
    private readonly trpcService: TrpcService,
    private readonly authService: AuthService,
  ) {}

  get router() {
    return this.trpcService.router({
      login: this.trpcService.publicProcedure
        .input(
          z.object({
            email: z.email(),
            password: z.string().min(6),
          }),
        )
        .mutation(async ({ input, ctx }) => {
          //  добавил ctx
          try {
            return await this.authService.login(
              input.email,
              input.password,
              ctx.res,
            );
          } catch (error) {
            throw new TRPCError({
              code: 'UNAUTHORIZED',
              message: (error as Error).message,
            });
          }
        }),

      register: this.trpcService.publicProcedure
        .input(
          z.object({
            email: z.email(),
            userName: z.string().min(2),
            password: z.string().min(6),
          }),
        )
        .mutation(async ({ input, ctx }) => {
          try {
            return await this.authService.register(
              input.email,
              input.password,
              input.userName,
              ctx.res,
            );
          } catch (error) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: (error as Error).message,
            });
          }
        }),

      me: this.trpcService.protectedProcedure.query(({ ctx }) => {
        return {
          user: ctx.user,
        };
      }),

      logout: this.trpcService.protectedProcedure.mutation(({ ctx }) => {
        return this.authService.logout(ctx.res);
      }),
    });
  }
}
