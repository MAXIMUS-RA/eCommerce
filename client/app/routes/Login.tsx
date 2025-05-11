import { useState } from "react";
import type {FormEvent} from "react";
import { useNavigate } from "react-router"; // Змінено імпорт
import axios from "axios";
// import { useAuth } from "../contexts/AuthContext"; // Або ваш шлях

const API_URL = "http://localhost:8000";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  // const { login } = useAuth();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      // Оновлення стану через useAuth хук в Header.tsx відбудеться автоматично
      // завдяки useEffect, який перевіряє /auth/status
      navigate("/");
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.error || `Помилка входу: ${err.response.statusText}`
        );
      } else {
        setError(
          "Не вдалося підключитися до сервера або сталася інша помилка."
        );
      }
      console.error("Login error:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Вхід</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {/* ... решта форми ... */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Пароль
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Увійти
        </button>
      </form>
    </div>
  );
}
