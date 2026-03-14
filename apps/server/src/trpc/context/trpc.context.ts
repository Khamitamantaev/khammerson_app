import { JwtService } from '@nestjs/jwt';
import { Pool } from 'pg';
import { Request, Response } from 'express';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Context {
  req: Request;
  res: Response;
  user: User | null;
  pool: Pool;
}

interface CreateContextOptions {
  req: Request;
  res: Response;
  jwtService: JwtService;
  pool: Pool;
}

export const createContext = ({
  req,
  res,
  jwtService,
  pool,
}: CreateContextOptions): Context => {
  let user = null;

  // 1. Проверяем Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwtService.verify<{ sub: string; email: string }>(token);
      user = { id: decoded.sub, email: decoded.email };
    } catch (error) {
      console.warn('Invalid token:', (error as Error).message);
    }
  }

  // 2. Если нет токена в header, проверяем cookies
  if (!user && req.cookies?.access_token) {
    try {
      const decoded = jwtService.verify<{ sub: string; email: string }>(
        req.cookies.access_token,
      );
      user = { id: decoded.sub, email: decoded.email };
    } catch (error) {
      console.warn('Invalid cookie token:', (error as Error).message);
    }
  }

  return {
    req,
    res,
    user,
    pool,
  };
};
