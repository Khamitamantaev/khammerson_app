/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { INestApplication, Injectable, Logger } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import { TrpcService } from './trpc.service';
import { UsersRouter } from './routers/user.router';
import { AuthRouter } from './routers/auth.router';
import { createContext } from './context/trpc.context';
import { expressHandler } from 'trpc-playground/handlers/express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { ProjectRouter } from './routers/project.router';
import { CanvasRouter } from './routers/canvas.router';

@Injectable()
export class TrpcRouter {
  private readonly logger = new Logger(TrpcRouter.name);

  constructor(
    private readonly trpcService: TrpcService,
    private readonly usersRouter: UsersRouter,
    private readonly authRouter: AuthRouter,
    private readonly configService: ConfigService,
    private readonly projectRouter: ProjectRouter,
    private readonly canvasRouter: CanvasRouter,
  ) {}

  get appRouter() {
    return this.trpcService.router({
      users: this.usersRouter.router,
      auth: this.authRouter.router,
      project: this.projectRouter.router,
      canvas: this.canvasRouter.router,
    });
  }

  async applyMiddleware(app: INestApplication) {
    const jwtService = app.get(JwtService);
    const pool = app.get('DATABASE_POOL');

    app.use(
      '/trpc',
      trpcExpress.createExpressMiddleware({
        router: this.appRouter,
        createContext: ({ req, res }) =>
          createContext({
            req,
            res,
            jwtService,
            pool,
          }),
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
