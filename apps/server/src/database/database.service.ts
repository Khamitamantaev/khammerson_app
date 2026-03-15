/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/database/database.service.ts
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolConfig } from 'pg';
import { ConfigurationType } from '../config/configuration';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;

  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService<ConfigurationType>,
  ) {
    this.initializePool(); // ✅ Пул создается в конструкторе
  }

  private initializePool() {
    // Получаем конфигурацию БД через configService
    const host = this.configService.get('db.host', { infer: true });
    const port = this.configService.get('db.port', { infer: true });
    const database = this.configService.get('db.name', { infer: true });
    const user = this.configService.get('db.user', { infer: true });
    const password = this.configService.get('db.password', { infer: true });
    const poolMax = this.configService.get('db.pool.max', { infer: true });
    const poolIdleTimeout = this.configService.get('db.pool.idleTimeout', {
      infer: true,
    });
    const poolConnectionTimeout = this.configService.get(
      'db.pool.connectionTimeout',
      { infer: true },
    );
    const isProd = this.configService.get('env.isProd', { infer: true });

    if (!password) {
      this.logger.error(
        'Database password is not set in environment variables',
      );
      throw new Error('Database password is not configured');
    }

    const poolConfig: PoolConfig = {
      host: host ?? 'localhost',
      port: port ?? 5432,
      database: database ?? 'khammerson',
      user: user ?? 'postgres',
      password,
      max: poolMax ?? 20,
      idleTimeoutMillis: poolIdleTimeout ?? 30000,
      connectionTimeoutMillis: poolConnectionTimeout ?? 2000,
    };

    this.logger.debug(
      `[${isProd ? 'PROD' : 'DEV'}] Initializing database pool: ${poolConfig.host}:${poolConfig.port}/${poolConfig.database} as ${poolConfig.user}`,
    );

    this.pool = new Pool(poolConfig);

    this.pool.on('error', (err) => {
      this.logger.error(
        `Unexpected database pool error: ${err.message}`,
        err.stack,
      );
    });
  }

  async onModuleInit() {
    try {
      const client = await this.pool.connect(); // ✅ pool уже существует
      const result = await client.query('SELECT NOW() as now');
      client.release();
      this.logger.log(
        `✅ Database connected successfully. Server time: ${result.rows[0].now}`,
      );
    } catch (error) {
      this.logger.error(
        '❌ Database connection failed during initialization',
        error,
      );
      // В продакшене можно выбрасывать ошибку, чтобы контейнер перезапустился
      if (this.configService.get('env.isProd', { infer: true })) {
        throw error;
      }
    }
  }

  async onModuleDestroy() {
    await this.pool?.end();
    this.logger.log('🔌 Database pool closed');
  }

  getPool(): Pool {
    if (!this.pool) {
      this.logger.error('getPool() called before pool initialization');
      throw new Error('Database pool not initialized');
    }
    return this.pool;
  }

  async query(text: string, params?: any[]) {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      this.logger.debug(`Query executed ins ${duration}ms: ${text}`);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Query failed: ${error.message}`);
      } else {
        this.logger.error(`Query failed withw unknown error: ${String(error)}`);
      }
      throw error;
    }
  }

  async getClient() {
    const client = await this.pool.connect();
    return client;
  }
}
