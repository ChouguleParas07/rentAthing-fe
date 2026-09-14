import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  LogOut
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { logout } from "../../store/authSlice";
import { authApi } from "../../api/auth";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Messages", path: "/messages", icon: MessageSquare },
    { name: "Settings", path: "/profile", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error(e);
    }
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 tracking-tight">
          Stashly
        </h2>
      </div>

      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-300 font-bold">
          {user?.full_name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.full_name || "User"}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role?.toLowerCase() || "Renter"}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
            >
              <Icon size={18} className={isActive ? "text-green-600 dark:text-green-400" : ""} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;