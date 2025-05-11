import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/products", "routes/products.tsx"), 
  route("/products/:productId", "routes/Products.$productId.tsx"), 
] satisfies RouteConfig;
