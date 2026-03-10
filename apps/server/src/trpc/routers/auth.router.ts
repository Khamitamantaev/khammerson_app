import { TrpcService } from '../trpc.service';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class AuthRouter {
  public router: ReturnType<TrpcService['router']>;

  constructor(private readonly trpc: TrpcService) {
    this.router = this.trpc.router({
      login: this.trpc.publicProcedure
        .input(
          z.object({
            email: z.email(),
            password: z.string().min(6),
          }),
        )
        .mutation(({ input }) => {
          return {
            token: 'jwt_token_here',
            user: { id: '1', email: input.email },
          };
        }),

      register: this.trpc.publicProcedure
        .input(
          z.object({
            email: z.email(),
            password: z.string().min(6),
            name: z.string().optional(),
          }),
        )
        .mutation(({ input }) => {
          return {
            token: 'jwt_token_here',
            user: { id: '2', email: input.email, name: input.name },
          };
        }),

      me: this.trpc.protectedProcedure.query(({ ctx }) => {
        return ctx.user;
      }),
    });
  }
}
