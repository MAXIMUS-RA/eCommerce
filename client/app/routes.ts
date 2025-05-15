import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/Home.tsx"), 
  route("/products", "routes/Products.tsx"),
  route("/products/:productId", "routes/Products.$productId.tsx"),
  route("/login", "routes/Login.tsx"),
  route("/register", "routes/Register.tsx"),
  route("/cart", "routes/Cart.tsx"),
] satisfies RouteConfig;
