import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/Layout.tsx", [
    index("routes/Home.tsx"),
    route("/products", "routes/Products.tsx"),
    route("/products/:productId", "routes/Products.$productId.tsx"),
    route("/login", "routes/Login.tsx"),
    route("/register", "routes/Register.tsx"),
    route("/cart", "routes/Cart.tsx"),
  ]),
  route("admin", "./routes/Admin/AdminLayout.tsx", [
    route("dashboard", "routes/Admin/Dashboard.tsx"),
    route("products","routes/Admin/AddProducts.tsx"),
    route("categories","routes/Admin/AddCategories.tsx"),
  ]),
] satisfies RouteConfig;
