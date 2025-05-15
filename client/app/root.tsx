import React, { useEffect } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./redux/store";
import type { RootState, AppDispatch } from "./redux/store";
import { fetchCurrentUser, selectAuth, logout } from "./redux/slices/authSlice";
import Header from "./components/Header";
import './app.css'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
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

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, loading } = useSelector(selectAuth);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Завантаження...
      </div>
    );
  }

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={() => dispatch(logout())}
      />
      <div className="container mx-auto py-4">
        <Outlet />
      </div>
    </>
  );
}

export default function RootApp() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export function ErrorBoundary({ error }: any) {
  console.error(error);
  const routeError = isRouteErrorResponse(error)
    ? error
    : { status: 500, statusText: "Internal Server Error", data: error };
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>{routeError.status}</title>
      </head>
      <body>
        <h1>
          {routeError.status}: {routeError.statusText}
        </h1>
        <p>{routeError.data?.message}</p>
        <Scripts />
      </body>
    </html>
  );
}
