import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/products", "routes/products.tsx"), // Виправлено на "products"
] satisfies RouteConfig;
