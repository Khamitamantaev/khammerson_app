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
}

export const createContext = ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Context => {
  // Здесь можно достать пользователя из сессии/JWT
  // Например:
  // const user = req.session?.user ?? null;

  return {
    req,
    res,
    user: null, // Замените на реальную логику аутентификации
  };
};
