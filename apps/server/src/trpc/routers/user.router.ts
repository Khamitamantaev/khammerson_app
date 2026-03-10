import { TrpcService } from '../trpc.service';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { z } from 'zod';

@Injectable()
export class UsersRouter {
  public router: ReturnType<TrpcService['router']>;

  constructor(
    private readonly trpc: TrpcService,
    private readonly userService: UserService,
  ) {
    this.router = this.trpc.router({
      getById: this.trpc.publicProcedure
        .input(z.string())
        .query(({ input }) => {
          // убрали async
          return { id: input, name: 'Test User', email: 'test@test.com' };
        }),

      getAll: this.trpc.publicProcedure.query(() => {
        return this.userService.getAll();
      }),
    });
  }
}
