/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Inject } from '@nestjs/common'; // 👈 добавляем Inject
import { z } from 'zod';
import { Pool } from 'pg';
import { TrpcService } from '../trpc.service';

export interface User {
  id: string;
  email: string;
  userName: string;
  password?: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UsersRouter {
  constructor(
    private readonly trpcService: TrpcService,
    @Inject('DATABASE_POOL') private readonly pool: Pool, // используем строковый токен
  ) {}

  private mapUserRow(row: any): Omit<User, 'password'> {
    return {
      id: row.id,
      email: row.email,
      userName: row.user_name,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Используем getter
  get router() {
    return this.trpcService.router({
      getMany: this.trpcService.publicProcedure.query(async () => {
        const result = await this.pool.query(`
          SELECT id, email, user_name, name, created_at, updated_at 
          FROM "users" 
          ORDER BY created_at DESC
        `);

        return result.rows.map((row) => this.mapUserRow(row));
      }),

      getOne: this.trpcService.publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
          const result = await this.pool.query(
            `
            SELECT id, email, user_name, name, created_at, updated_at 
            FROM "users" 
            WHERE id = $1
          `,
            [input.id],
          );

          if (result.rows.length === 0) {
            return null;
          }

          return this.mapUserRow(result.rows[0]);
        }),

      create: this.trpcService.publicProcedure
        .input(
          z.object({
            name: z.string().min(2),
            email: z.email(),
            userName: z.string().min(2),
            password: z.string().min(6),
          }),
        )
        .mutation(async ({ input }) => {
          // Проверяем существующего пользователя
          const existingUser = await this.pool.query(
            'SELECT id FROM "users" WHERE email = $1',
            [input.email],
          );

          if (existingUser.rows.length > 0) {
            throw new Error('User with this email already exists');
          }

          const result = await this.pool.query(
            `
            INSERT INTO "users" (name, email, user_name, password) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, name, email, user_name, created_at, updated_at
          `,
            [input.name, input.email, input.userName, input.password],
          );

          return this.mapUserRow(result.rows[0]);
        }),
    });
  }
}
