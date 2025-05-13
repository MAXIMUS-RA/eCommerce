import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/Home.tsx"), // Змінено з routes/home.tsx на routes/Home.tsx
  route("/products", "routes/products.tsx"),
  route("/products/:productId", "routes/Products.$productId.tsx"),
  route("/login", "routes/Login.tsx"),
  route("/register", "routes/Register.tsx"),
] satisfies RouteConfig;
