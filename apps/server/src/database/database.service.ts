// src/database/database.service.ts
import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      host: this.configService.get('db.host'),
      port: this.configService.get('db.port'),
      database: this.configService.get('db.name'),
      user: this.configService.get('db.user'),
      password: this.configService.get('db.password'),
      max: this.configService.get('db.pool.max'),
      idleTimeoutMillis: this.configService.get('db.pool.idleTimeout'),
      connectionTimeoutMillis: this.configService.get(
        'db.pool.connectionTimeout',
      ),
    });

    this.pool.on('error', (err) => {
      this.logger.error(`Database pool error: ${err.message}`);
    });
  }

  async query(text: string, params?: any[]) {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      this.logger.debug(`Query executed in ${duration}ms: ${text}`);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Query failed: ${error.message}`);
      } else {
        this.logger.error(`Query failed with unknown error: ${String(error)}`);
      }
      throw error;
    }
  }

  async getClient() {
    const client = await this.pool.connect();
    return client;
  }

  getPool(): Pool {
    return this.pool;
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
