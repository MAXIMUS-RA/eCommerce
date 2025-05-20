import React from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import { Provider} from "react-redux";
import { store } from "./redux/store";
import "./app.css";

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
  return (
    <>
      <Outlet />
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
