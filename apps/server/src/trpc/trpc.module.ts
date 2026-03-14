import { Module } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { TrpcRouter } from './trpc.router';
import { UsersRouter } from './routers/user.router';
import { AuthRouter } from './routers/auth.router';
import { UserService } from '../user/user.service';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [AuthModule, DatabaseModule],
  providers: [TrpcService, TrpcRouter, UsersRouter, AuthRouter, UserService],
})
export class TrpcModule {}
