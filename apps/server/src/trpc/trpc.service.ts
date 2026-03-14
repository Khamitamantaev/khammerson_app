/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Inject } from '@nestjs/common';
import { initTRPC } from '@trpc/server';
import { Context, initializeServices } from './context/trpc.context';
import superjson from 'superjson';
import { JwtService } from '@nestjs/jwt';
import { Pool } from 'pg';

@Injectable()
export class TrpcService {
  public trpc = initTRPC.context<Context>().create({ transformer: superjson });
  public procedure = this.trpc.procedure;
  public router = this.trpc.router;
  public middleware = this.trpc.middleware;

  constructor(
    @Inject('DATABASE_POOL') private readonly pool: Pool,
    private readonly jwtService: JwtService,
  ) {
    initializeServices(this.pool, this.jwtService);
  }

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
