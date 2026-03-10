import { Module } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { TrpcRouter } from './trpc.router';
import { UsersRouter } from './routers/user.router';
import { AuthRouter } from './routers/auth.router';
import { UserService } from '../user/user.service';

@Module({
  providers: [TrpcService, TrpcRouter, UsersRouter, AuthRouter, UserService],
})
export class TrpcModule {}
