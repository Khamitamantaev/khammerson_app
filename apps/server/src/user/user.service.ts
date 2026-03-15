// user.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

export interface User {
  id: string;
  email: string;
  userName: string;
  firstName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPassword extends User {
  password: string;
}

@Injectable()
export class UserService {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  private mapUserRow(row: any): User {
    return {
      id: row.id,
      email: row.email,
      userName: row.user_name,
      firstName: row.first_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query(
      'SELECT id, email, user_name, name, created_at, updated_at FROM "users" WHERE email = $1',
      [email],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapUserRow(result.rows[0]);
  }

  // ✅ Новый метод для авторизации (с паролем)
  async findUserByEmailWithPassword(
    email: string,
  ): Promise<UserWithPassword | null> {
    const result = await this.pool.query(
      'SELECT id, email, user_name, password, first_name, created_at, updated_at FROM "users" WHERE email = $1',
      [email],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      userName: row.user_name,
      password: row.password,
      firstName: row.first_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
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
