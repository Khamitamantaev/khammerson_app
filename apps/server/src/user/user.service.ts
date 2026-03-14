/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Inject } from '@nestjs/common'; // 👈 добавляем Inject
import { Pool } from 'pg';

export interface User {
  id: string;
  email: string;
  userName: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UserService {
  constructor(
    @Inject('DATABASE_POOL') private readonly pool: Pool, // 👈 используем строковый токен
  ) {}

  private mapUserRow(row: any): User {
    return {
      id: row.id,
      email: row.email,
      userName: row.user_name,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query(
      'SELECT id, email, user_name, name, created_at, updated_at FROM users WHERE email = $1',
      [email],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapUserRow(result.rows[0]);
  }

  async findUserById(id: string): Promise<User | null> {
    const result = await this.pool.query(
      'SELECT id, email, user_name, name, created_at, updated_at FROM users WHERE id = $1',
      [id],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapUserRow(result.rows[0]);
  }

  async getAllUsers(): Promise<User[]> {
    const result = await this.pool.query(
      'SELECT id, email, user_name, name, created_at, updated_at FROM users ORDER BY created_at DESC',
    );

    return result.rows.map((row) => this.mapUserRow(row));
  }
}
