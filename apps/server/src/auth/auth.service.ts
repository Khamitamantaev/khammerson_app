/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { JwtPayload } from './interfaces/jwt-payload.interface';

export interface User {
  id: string;
  email: string;
  userName: string;
  password: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject('DATABASE_POOL') private readonly pool: Pool,
    private readonly jwtService: JwtService,
  ) {}

  private async findUserByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query(
      'SELECT * FROM "users" WHERE email = $1',
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
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.findUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Неверные данные');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.userName || user.name,
      },
    };
  }

  async register(email: string, password: string, userName: string) {
    // Проверяем существующего пользователя
    const existingUser = await this.findUserByEmail(email);

    if (existingUser) {
      throw new UnauthorizedException(
        'Пользователь с таким email уже существует',
      );
    }

    // ✅ Добавил проверку на пустые значения
    if (!email || !password || !userName) {
      throw new UnauthorizedException('Все поля обязательны');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await this.pool.query(
      `INSERT INTO "users" (email, password, user_name) 
       VALUES ($1, $2, $3) 
       RETURNING id, email, user_name, created_at, updated_at`,
      [email, hashedPassword, userName],
    );

    const user = result.rows[0];

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        userName: user.user_name,
      },
    };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async findUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    const result = await this.pool.query(
      'SELECT id, email, user_name, name, created_at, updated_at FROM "users" WHERE id = $1',
      [userId],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      userName: row.user_name,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
