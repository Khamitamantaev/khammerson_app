/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { initTRPC } from '@trpc/server';
import { Context } from './context/trpc.context';
import superjson from 'superjson';

@Injectable()
export class TrpcService {
  public trpc = initTRPC.context<Context>().create({ transformer: superjson });
  public procedure = this.trpc.procedure;
  public router = this.trpc.router;
  public middleware = this.trpc.middleware;

  public publicProcedure = this.procedure;

  public protectedProcedure = this.procedure.use(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new Error('Not authenticated');
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }) as typeof this.procedure;
}
