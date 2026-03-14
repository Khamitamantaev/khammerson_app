import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../trpc/client";

export function useAuth() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // Мутации
  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  // Запрос текущего пользователя (автоматически с cookies)
  const { data: userData, refetch: refetchUser } = trpc.auth.me.useQuery(
    undefined,
    {
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 минут
    },
  );

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError("");

      const result = await loginMutation.mutateAsync({ email, password });

      // 👇 Обновляем данные пользователя после логина
      await refetchUser();
      queryClient.invalidateQueries();

      return result;
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    userName: string,
  ) => {
    try {
      setIsLoading(true);
      setError("");

      const result = await registerMutation.mutateAsync({
        email,
        password,
        userName,
      });

      // 👇 Обновляем данные пользователя после регистрации
      await refetchUser();
      queryClient.invalidateQueries();

      return result;
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      // 👇 Очищаем кэш после выхода
      queryClient.clear();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // 👇 Токен больше не нужен - он в cookies
  const isAuthenticated = !!userData?.user;

  return {
    login,
    register,
    logout,
    isAuthenticated,
    user: userData?.user,
    error,
    isLoading:
      isLoading || loginMutation.isPending || registerMutation.isPending,
  };
}
