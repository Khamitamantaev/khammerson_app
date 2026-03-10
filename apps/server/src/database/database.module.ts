// src/shared/database/database.module.ts
import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: Pool,
      useFactory: (databaseService: DatabaseService) => {
        return databaseService.getPool();
      },
      inject: [DatabaseService],
    },
  ],
  exports: [DatabaseService, Pool],
})
export class DatabaseModule {}
