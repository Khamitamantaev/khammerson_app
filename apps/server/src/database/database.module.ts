// src/shared/database/database.module.ts
import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: 'DATABASE_POOL', // используем строковый токен
      useFactory: (databaseService: DatabaseService) => {
        return databaseService.getPool();
      },
      inject: [DatabaseService],
    },
  ],
  exports: [DatabaseService, 'DATABASE_POOL'], // экспортируем строковый токен
})
export class DatabaseModule {}
