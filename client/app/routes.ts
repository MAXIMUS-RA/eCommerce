import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/Layout.tsx", [
    index("routes/About.tsx"),
    route("/products", "routes/Products.tsx"),
    route("/products/:productId", "routes/Products.$productId.tsx"),
    route("/login", "routes/Login.tsx"),
    route("/register", "routes/Register.tsx"),
    route("/cart", "routes/Cart.tsx"),
    route("/profile", "routes/Profile.tsx"),
    route("/payment/success", "routes/PaymentSuccess.tsx"),

  ]),
  route("admin", "./routes/Admin/AdminLayout.tsx", [
    route("dashboard", "routes/Admin/Dashboard.tsx"),
    route("products","routes/Admin/AdminProducts.tsx"),
    route("products/:productId","routes/admin/AdminProducts.$productId.tsx"),
    route("categories","routes/Admin/AddCategories.tsx"),
    route("orders","routes/Admin/OrdersAdmin.tsx"),
    route("products/store","routes/admin/AddProducts.tsx"),
  ]),
] satisfies RouteConfig;
