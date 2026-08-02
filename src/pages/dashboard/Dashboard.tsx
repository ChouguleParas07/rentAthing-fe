import { useState } from "react";
import { motion } from "framer-motion";
import { Package, CalendarRange, MessageCircle } from "lucide-react";

import { useProfile } from "@/hooks/auth/useProfile";
import { useBookings } from "@/hooks/bookings/useBookings";
import { useItems } from "@/hooks/items/useItems";

const Dashboard = () => {
  const { data: user, isLoading: isUserLoading } = useProfile();
  const [activeTab, setActiveTab] = useState<"bookings" | "items" | "messages">("bookings");

  const { data: bookings, isLoading: isBookingsLoading } = useBookings(
    user ? { renter_id: user.id } : undefined
  );

  const { data: items, isLoading: isItemsLoading } = useItems(
    user ? { owner_id: user.id } : undefined
  );

  if (isUserLoading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-gray-500">Please sign in.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.full_name || user.email}
          </h1>
          <p className="text-gray-500 mt-2">Manage your rentals, listings, and messages here.</p>
        </div>

        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "bookings" ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            <CalendarRange className="w-4 h-4 mr-2" /> My Bookings
          </button>
          <button
            onClick={() => setActiveTab("items")}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "items" ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            <Package className="w-4 h-4 mr-2" /> My Listings
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "messages" ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            <MessageCircle className="w-4 h-4 mr-2" /> Messages
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[400px]">
          {activeTab === "bookings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-xl font-bold text-gray-900 mb-6">My Bookings</h2>
              {isBookingsLoading ? (
                <p className="text-gray-500">Loading bookings...</p>
              ) : bookings?.items?.length ? (
                <div className="space-y-4">
                  {bookings.items.map((booking) => (
                    <div key={booking.id} className="p-4 rounded-xl border border-gray-200 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">Booking #{booking.id.substring(0, 8)}</p>
                        <p className="text-sm text-gray-500">{booking.start_date} to {booking.end_date}</p>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                        {booking.status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">You have no active bookings.</div>
              )}
            </motion.div>
          )}

          {activeTab === "items" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Listings</h2>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
                  Add New Item
                </button>
              </div>
              {isItemsLoading ? (
                <p className="text-gray-500">Loading listings...</p>
              ) : items?.items?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.items.map((item) => (
                    <div key={item.id} className="rounded-xl border border-gray-200 overflow-hidden">
                      <div className="aspect-video bg-gray-100 relative overflow-hidden">
                        <img
                          src={item.images?.url ? `https://placehold.co/600x400/e2e8f0/1e293b?text=${encodeURIComponent(item.title)}` : `https://placehold.co/600x400/e2e8f0/1e293b?text=${encodeURIComponent(item.title)}`}
                          className="absolute inset-0 w-full h-full object-cover"
                          alt={item.title}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">${item.daily_price}/day</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">You haven't listed any items yet.</div>
              )}
            </motion.div>
          )}

          {activeTab === "messages" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-500">
              Messages feature coming soon.
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
