import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { PublicRoutes } from "./PublicRoutes";
import { ROUTES } from "./routes";

// Lazy-loaded pages for code-splitting
const Home = lazy(() => import("../pages/home/Home"));
const Products = lazy(() => import("../pages/items/Products"));
const ItemDetails = lazy(() => import("../pages/items/ItemDetails"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const VerifyEmail = lazy(() => import("../pages/auth/VerifyEmail"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Profile = lazy(() => import("../pages/profile/Profile"));
const EditProfile = lazy(() => import("../pages/profile/EditProfile")); // Trigger TS update
const ChatPage = lazy(() => import("../pages/chat/ChatPage").then(m => ({ default: m.ChatPage })));
const PublicProfile = lazy(() => import("../pages/profile/PublicProfile").then(m => ({ default: m.PublicProfile })));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const NotFound = lazy(() => import("../components/common/NotFound"));
const StaticPage = lazy(() => import("../pages/StaticPage"));

const LazyFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LazyFallback />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.PRODUCTS} element={<Products />} />
            <Route path="/items/:id" element={<ItemDetails />} />
            <Route path={ROUTES.USER_PROFILE} element={<PublicProfile />} />
            <Route path="/profile/:id" element={<PublicProfile />} />

            {/* Static pages from Footer */}
            <Route path="/how-it-works" element={<StaticPage />} />
            <Route path="/faq" element={<StaticPage />} />
            <Route path="/contact" element={<StaticPage />} />
            <Route path="/trust" element={<StaticPage />} />
            <Route path="/terms" element={<StaticPage />} />
            <Route path="/privacy" element={<StaticPage />} />
          </Route>

          <Route element={<PublicRoutes />}>
            <Route element={<AuthLayout />}>
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.REGISTER} element={<Register />} />
              <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />
              <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
              <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoutes />}>
            <Route element={<DashboardLayout />}>
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.PROFILE} element={<Profile />} />
              <Route path={ROUTES.EDIT_PROFILE} element={<EditProfile />} />
              <Route path={ROUTES.MESSAGES} element={<ChatPage />} />
              <Route path={ROUTES.ADMIN} element={<AdminDashboard />} />
            </Route>
          </Route>

          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
