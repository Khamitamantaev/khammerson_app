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
  pool: Pool;
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

  // 👇 Проверяем что jwtServiceInstance существует
  if (jwtServiceInstance) {
    // 1. Проверяем Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwtServiceInstance.verify<{
          sub: string;
          email: string;
        }>(token);
        user = { id: decoded.sub, email: decoded.email };
      } catch (error) {
        console.warn('Invalid token:', (error as Error).message);
      }
    }

    // 2. Если нет токена в header, проверяем cookies
    if (!user && req.cookies?.access_token) {
      try {
        const decoded = jwtServiceInstance.verify<{
          sub: string;
          email: string;
        }>(req.cookies.access_token);
        user = { id: decoded.sub, email: decoded.email };
      } catch (error) {
        console.warn('Invalid cookie token:', (error as Error).message);
      }
    }
  } else {
    console.warn('JwtService not initialized in context');
  }

  return {
    req,
    res,
    user,
    pool: poolInstance,
  };
};
