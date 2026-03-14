// src/trpc/context/trpc.context.ts
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
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
  pool: Pool; // если нужен доступ к БД в контексте
}

// Сервисы для контекста
let jwtServiceInstance: JwtService;
let poolInstance: Pool;

export const initializeServices = (pool?: Pool, jwtService?: JwtService) => {
  if (pool) {
    poolInstance = pool;
  }

  if (jwtService) {
    jwtServiceInstance = jwtService;
  }

  return { poolInstance, jwtServiceInstance };
};

export const createContext = ({
  req,
  res,
}: CreateExpressContextOptions): Context => {
  const { jwtServiceInstance, poolInstance } = initializeServices();

  let user = null;

  // Проверяем Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwtServiceInstance.verify<{ sub: string; email: string }>(
        token,
      );

      user = {
        id: decoded.sub,
        email: decoded.email,
      };
    } catch (error) {
      console.warn('Invalid token:', (error as Error).message);
    }
  }

  // Можно также проверять cookies
  // const token = req.cookies?.access_token;
  // if (token) { ... }

  return {
    req,
    res,
    user,
    pool: poolInstance,
  };
};
