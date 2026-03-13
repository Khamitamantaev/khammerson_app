import { TRPCClientError } from '@trpc/client';
import type { AppRouter } from '../../../server/src/trpc/trpc.router';

// Утилита для проверки, является ли ошибка ошибкой tRPC
export function isTRPCClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}