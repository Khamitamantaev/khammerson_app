/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { INestApplication, Injectable, Logger } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import { TrpcService } from './trpc.service';
import { UsersRouter } from './routers/user.router';
import { AuthRouter } from './routers/auth.router';
import { createContext } from './context/trpc.context';
import { expressHandler } from 'trpc-playground/handlers/express';

@Injectable()
export class TrpcRouter {
  private readonly logger = new Logger(TrpcRouter.name);

  public appRouter: ReturnType<TrpcService['router']>;

  constructor(
    private readonly trpcService: TrpcService,
    private readonly usersRouter: UsersRouter,
    private readonly authRouter: AuthRouter,
  ) {
    this.appRouter = this.trpcService.router({
      users: this.usersRouter.router,
      auth: this.authRouter.router,
    });
  }

  async applyMiddleware(app: INestApplication) {
    app.use(
      '/trpc',
      trpcExpress.createExpressMiddleware({
        router: this.appRouter,
        createContext,
      }),
    );

    // Добавляем playground
    app.use(
      '/trpc-playground',
      await expressHandler({
        trpcApiEndpoint: '/trpc',
        playgroundEndpoint: '/trpc-playground',
        router: this.appRouter,
        request: {
          superjson: true,
        },
      }),
    );
  }
}

export type AppRouter = TrpcRouter['appRouter'];
