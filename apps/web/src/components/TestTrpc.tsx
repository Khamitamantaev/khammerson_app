import { useState } from "react";
import { trpc } from "../trpc/client";

export const TestPage = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();
  const createUserMutation = trpc.users.create.useMutation();
  // 1. Тест получения всех пользователей
  const testGetUsers = async () => {
    setLoading(true);
    try {
      const users = trpc.users.getMany.useQuery();
      setResult({ type: "GET_USERS", data: users });
    } catch (error) {
      setResult({ type: "ERROR", error: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  // 2. Тест получения одного пользователя
  const testGetUser = async (id: string) => {
    setLoading(true);
    try {
      const user = trpc.users.getOne.useQuery({ id });
      setResult({ type: "GET_USER", data: user });
    } catch (error) {
      setResult({ type: "ERROR", error: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  // 3. Тест создания пользователя
  const testCreateUser = async () => {
    setLoading(true);
    try {
      const newUser = await createUserMutation.mutateAsync({
        email: `test${Date.now()}@test.com`,
        userName: `user${Date.now()}`,
        password: "123456",
      });
      setResult({ type: "CREATE_USER", data: newUser });
    } catch (error) {
      setResult({ type: "ERROR", error: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  // 4. Тест авторизации
  const testLogin = async () => {
    setLoading(true);
    try {
      const loginResult = await loginMutation.mutateAsync({
        email: "test@test.com",
        password: "123456",
      });
      localStorage.setItem("token", loginResult.access_token);
      setResult({ type: "LOGIN", data: loginResult });
    } catch (error) {
      setResult({ type: "ERROR", error: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  // 5. Тест проверки текущего пользователя (нужен токен)
  const testMe = async () => {
    setLoading(true);
    try {
      const user = trpc.auth.me.useQuery();
      setResult({ type: "ME", data: user });
    } catch (error) {
      setResult({ type: "ERROR", error: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🧪 Тестирование tRPC</h1>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={testGetUsers} disabled={loading}>
          📋 Все пользователи
        </button>
        <button onClick={() => testGetUser("1")} disabled={loading}>
          🔍 Пользователь с id=1
        </button>
        <button onClick={testCreateUser} disabled={loading}>
          ➕ Создать тестового пользователя
        </button>
        <button onClick={testLogin} disabled={loading}>
          🔑 Тест логина
        </button>
        <button onClick={testMe} disabled={loading}>
          👤 Текущий пользователь
        </button>
      </div>

      {loading && <div>⏳ Загрузка...</div>}

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#f5f5f5",
            borderRadius: "5px",
          }}
        >
          <h3>Результат: {result.type}</h3>
          <pre style={{ background: "#fff", padding: "10px" }}>
            {JSON.stringify(result.data || result.error, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
