/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { INestApplication, Injectable, Logger } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import { TrpcService } from './trpc.service';
import { UsersRouter } from './routers/user.router';
import { AuthRouter } from './routers/auth.router';
import { createContext } from './context/trpc.context';
import { expressHandler } from 'trpc-playground/handlers/express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TrpcRouter {
  private readonly logger = new Logger(TrpcRouter.name);

  constructor(
    private readonly trpcService: TrpcService,
    private readonly usersRouter: UsersRouter,
    private readonly authRouter: AuthRouter,
    private readonly configService: ConfigService,
  ) {}

  get appRouter() {
    return this.trpcService.router({
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

    const enablePlayground = this.configService.get('trpc.playground');
    if (enablePlayground) {
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
      this.logger.log('tRPC Playground enabled at /trpc-playground');
    }
  }
}

export type AppRouter = TrpcRouter['appRouter'];
