export const ROUTES = {
  HOME: "/",

  PRODUCTS: "/products",

  PRODUCT_DETAILS: "/products/:id",

  // Auth routes
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_EMAIL: "/verify-email",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Protected routes
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  MESSAGES: "/messages",
  USER_PROFILE: "/user/:id",
  ADMIN: "/admin",

  NOT_FOUND: "*",
};