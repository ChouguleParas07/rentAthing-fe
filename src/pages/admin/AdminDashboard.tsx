import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/api/users.api";
import { itemsApi } from "@/api/items.api";
import { bookingsApi } from "@/api/bookings.api";
import { Users, Package, CalendarRange, ShieldCheck } from "lucide-react";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"users" | "items" | "bookings">("users");

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => usersApi.list({ limit: 100 }),
    enabled: activeTab === "users",
  });

  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ["admin", "items"],
    queryFn: () => itemsApi.list({ limit: 100 }),
    enabled: activeTab === "items",
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: () => bookingsApi.list({ limit: 100 }),
    enabled: activeTab === "bookings",
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
          <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage users, listings, and platform bookings.</p>
          </div>
        </div>

        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "users" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <Users className="w-4 h-4 mr-2" /> Users
          </button>
          <button
            onClick={() => setActiveTab("items")}
            className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "items" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <Package className="w-4 h-4 mr-2" /> Listings
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "bookings" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <CalendarRange className="w-4 h-4 mr-2" /> Bookings
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

          {activeTab === "users" && (
            <div className="overflow-x-auto">
              {usersLoading ? (
                <div className="p-8 text-center text-gray-500">Loading users...</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                      <th className="p-4 font-medium">ID</th>
                      <th className="p-4 font-medium">Name</th>
                      <th className="p-4 font-medium">Email</th>
                      <th className="p-4 font-medium">Role</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users?.items.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50/50">
                        <td className="p-4 text-sm font-mono text-gray-500">{u.id.substring(0, 8)}</td>
                        <td className="p-4 text-sm font-medium text-gray-900">{u.full_name || 'N/A'}</td>
                        <td className="p-4 text-sm text-gray-600">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : u.role === 'OWNER' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {u.is_active ? 'Active' : 'Banned'}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "items" && (
            <div className="overflow-x-auto">
              {itemsLoading ? (
                <div className="p-8 text-center text-gray-500">Loading listings...</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                      <th className="p-4 font-medium">ID</th>
                      <th className="p-4 font-medium">Title</th>
                      <th className="p-4 font-medium">Price/Day</th>
                      <th className="p-4 font-medium">Location</th>
                      <th className="p-4 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items?.items.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50/50">
                        <td className="p-4 text-sm font-mono text-gray-500">{item.id.substring(0, 8)}</td>
                        <td className="p-4 text-sm font-medium text-gray-900">{item.title}</td>
                        <td className="p-4 text-sm font-bold text-green-700">${item.daily_price}</td>
                        <td className="p-4 text-sm text-gray-600">{item.location_text}</td>
                        <td className="p-4 text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="overflow-x-auto">
              {bookingsLoading ? (
                <div className="p-8 text-center text-gray-500">Loading bookings...</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                      <th className="p-4 font-medium">ID</th>
                      <th className="p-4 font-medium">Dates</th>
                      <th className="p-4 font-medium">Total</th>
                      <th className="p-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings?.items.map(b => (
                      <tr key={b.id} className="hover:bg-gray-50/50">
                        <td className="p-4 text-sm font-mono text-gray-500">{b.id.substring(0, 8)}</td>
                        <td className="p-4 text-sm text-gray-600">{b.start_date} to {b.end_date}</td>
                        <td className="p-4 text-sm font-bold text-gray-900">${b.total_price}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
