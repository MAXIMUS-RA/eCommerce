import React, { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from "react-router";
import axios from "axios";

import type { Route } from "./+types/root";
import "./app.css";
import Header from "./components/Header";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const API_URL = "http://localhost:8000";

axios.defaults.withCredentials = true;

interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthOutletContext {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  authError: string | null;
  handleLogin: (credentials: {
    email: string;
    password: string;
  }) => Promise<void>;
  handleRegister: (userData: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function RootApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  const updateAuthState = useCallback(
    (newIsAuthenticated: boolean, newUserData: User | null) => {
      setIsAuthenticated(newIsAuthenticated);
      setUser(newUserData);
      if (newIsAuthenticated && newUserData) {
        localStorage.setItem("user", JSON.stringify(newUserData));
      } else {
        localStorage.removeItem("user");
      }
    },
    []
  );

  const fetchCurrentUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<{ user: User }>(`${API_URL}/auth/status`);
      if (response.data && response.data.user) {
        updateAuthState(true, response.data.user);
      } else {
        updateAuthState(false, null);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        updateAuthState(false, null);
      } else {
        console.error("Помилка отримання поточного користувача:", err);
        updateAuthState(false, null);
      }
    } finally {
      setLoading(false);
    }
  }, [updateAuthState]);

  useEffect(() => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      try {
        const storedUser = JSON.parse(storedUserString) as User;
        setUser(storedUser);
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const handleLogin = async (credentials: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await axios.post<{ user: User }>(
        `${API_URL}/auth/login`,
        credentials
      );
      if (response.data && response.data.user) {
        updateAuthState(true, response.data.user);
        navigate("/");
      } else {
        await fetchCurrentUser();
        if (isAuthenticated) {
          navigate("/");
        } else {
          setAuthError("Не вдалося отримати дані користувача після входу.");
        }
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Помилка входу.";
      setAuthError(message);
      updateAuthState(false, null);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await axios.post<{ user: User; message?: string }>(
        `${API_URL}/auth/register`,
        userData
      );
      if (response.data && response.data.user) {
        updateAuthState(true, response.data.user);
        navigate("/");
      } else {
        await fetchCurrentUser();
        if (isAuthenticated) {
          navigate("/");
        } else {
          console.log(
            response.data.message || "Реєстрація успішна, будь ласка, увійдіть."
          );
          navigate("/login");
        }
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Помилка реєстрації.";
      setAuthError(message);
      updateAuthState(false, null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (err) {
      console.error("Помилка виходу:", err);
    } finally {
      updateAuthState(false, null);
      navigate("/login");
      setLoading(false);
    }
  }, [updateAuthState, navigate]);

  const outletContextValue: AuthOutletContext = {
    isAuthenticated,
    user,
    loading,
    authError,
    handleLogin,
    handleRegister,
  };

  if (loading && !user && !isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        Завантаження...
      </div>
    );
  }

  return (
    <Provider store={store}>
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />
      <div className="container mx-auto py-4">
        <Outlet context={outletContextValue} />
      </div>
    </Provider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  console.error(error);
  const routeError = isRouteErrorResponse(error)
    ? error
    : { status: 500, statusText: "Internal Server Error", data: error };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>
          {routeError.status}: {routeError.statusText}
        </title>
      </head>
      <body>
        <div className="p-4 text-center">
          <h1 className="text-2xl font-bold">
            {routeError.status}: {routeError.statusText}
          </h1>
          {routeError.data?.message && <p>{routeError.data.message}</p>}
        </div>
        <Scripts />
      </body>
    </html>
  );
}
