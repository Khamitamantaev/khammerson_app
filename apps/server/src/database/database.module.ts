// src/shared/database/database.module.ts
import { Module, Global, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from './database.service';
import * as fs from 'fs';
import * as path from 'path';

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: 'DATABASE_POOL',
      useFactory: (databaseService: DatabaseService) => {
        return databaseService.getPool();
      },
      inject: [DatabaseService],
    },
  ],
  exports: [DatabaseService, 'DATABASE_POOL'],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly databaseService: DatabaseService) {}

  async onModuleInit() {
    try {
      // Используем getPool() вместо прямого доступа к pool
      const pool = this.databaseService.getPool();

      // Проверяем, существует ли таблица projects
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'projects'
        );
      `);

      const hasProjectsTable = result.rows[0].exists;

      if (!hasProjectsTable) {
        console.log('🔄 База данных не инициализирована. Создаю таблицы...');

        const sqlPath = path.join(__dirname, 'init.sql');
        console.log('Looking for init.sql at:', sqlPath);

        if (!fs.existsSync(sqlPath)) {
          console.error('❌ Файл init.sql не найден по пути:', sqlPath);
          return;
        }

        if (!fs.existsSync(sqlPath)) {
          console.error('❌ Файл init.sql не найден по пути:', sqlPath);
          return;
        }

        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Разделяем SQL на отдельные запросы
        const queries = sql
          .split(';')
          .map((q) => q.trim())
          .filter((q) => q.length > 0);

        // Выполняем каждый запрос
        for (const query of queries) {
          try {
            await pool.query(query);
          } catch (err) {
            console.error('❌ Ошибка при выполнении запроса:', err);
            console.error('Запрос:', query.substring(0, 200) + '...');
          }
        }

        console.log('✅ База данных успешно инициализирована');
      } else {
        console.log('✅ База данных уже инициализирована');
      }
    } catch (error) {
      console.error('❌ Ошибка при инициализации базы данных:', error);
    }
  }
}
