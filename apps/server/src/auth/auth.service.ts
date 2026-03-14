// auth.service.ts
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DATABASE_POOL') private readonly pool: Pool,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(email: string, password: string) {
    // Используем новый метод с паролем
    const user = await this.userService.findUserByEmailWithPassword(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user; // удаляем пароль из результата
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
    // Проверяем существующего пользователя (без пароля)
    const existingUser = await this.userService.findUserByEmail(email);

    if (existingUser) {
      throw new UnauthorizedException(
        'Пользователь с таким email уже существует',
      );
    }

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async findUserById(userId: string) {
    return this.userService.findUserById(userId); // используем UserService
  }
}
