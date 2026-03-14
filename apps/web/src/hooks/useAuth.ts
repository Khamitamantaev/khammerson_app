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

  // Запрос текущего пользователя - без рефетча
  const {
    data: userData,
    refetch: refetchUser,
    isLoading: isUserLoading,
  } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: false, // 👈 пока отключим авто-запрос
  });

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError("");
      const result = await loginMutation.mutateAsync({ email, password });
      console.log("2. Логин успешен:", result);
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

      // 👇 Убрали await refetchUser()
      queryClient.invalidateQueries();
      navigate("/workspace");

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

  const isAuthenticated = !!userData?.user;

  return {
    login,
    register,
    logout,
    isAuthenticated,
    user: userData?.user,
    error,
    isLoading:
      isLoading ||
      loginMutation.isPending ||
      registerMutation.isPending ||
      isUserLoading,
  };
}
