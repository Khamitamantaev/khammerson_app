import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../trpc/client";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Мутации
  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  // Запрос текущего пользователя - включается только при наличии токена
  const {
    data: userData,
    refetch: refetchUser,
    isLoading: isUserLoading,
    error: userError,
    isFetching,
  } = trpc.auth.me.useQuery(undefined, {
    retry: (failureCount, error) => {
      // Не делаем retry при 401 (нет авторизации)
      if (error.data?.code === "UNAUTHORIZED") return false;
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError("");

      const result = await loginMutation.mutateAsync({ email, password });

      // 👇 ЯВНО получаем данные пользователя
      await refetchUser();
      queryClient.invalidateQueries();
      navigate("/workspace");

      return result;
    } catch (err: any) {
      console.error("Ошибка логина:", err);
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

      // 👇 Добавляем refetch после регистрации
      await refetchUser();
      queryClient.invalidateQueries();
      navigate("/welcome");

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
      queryClient.clear();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Проверяем авторизацию
  const isAuthenticated = !!userData?.user;
  const isUnauthorized = userError?.data?.code === "UNAUTHORIZED";

  // Статус загрузки
  const isLoadingUser = isUserLoading || isFetching;

  return {
    login,
    register,
    logout,
    isAuthenticated,
    isUnauthorized,
    user: userData?.user,
    error,
    isLoading:
      isLoading ||
      loginMutation.isPending ||
      registerMutation.isPending ||
      isLoadingUser,
  };
}
