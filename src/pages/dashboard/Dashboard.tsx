import { useState } from "react";
import { motion } from "framer-motion";
import { Package, CalendarRange, MessageCircle, Plus, Trash2, ExternalLink } from "lucide-react";
import { useProfile } from "@/hooks/auth/useProfile";
import { useBookings } from "@/hooks/bookings/useBookings";
import { useItems } from "@/hooks/items/useItems";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { BookingCard } from "@/components/booking/BookingCard";
import { CreateItemModal } from "@/components/items/CreateItemModal";
import { itemsApi } from "@/api/items.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const Dashboard = () => {
  const { data: user, isLoading: isUserLoading } = useProfile();
  const [activeTab, setActiveTab] = useState<"bookings" | "items" | "messages">("bookings");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isCreateItemModalOpen, setIsCreateItemModalOpen] = useState(false);
  const [itemsPage, setItemsPage] = useState(1);
  const itemsLimit = 9;

  const [bookingTab, setBookingTab] = useState<"renting" | "renting_out">("renting");

  const { data: renterBookings, isLoading: isRenterBookingsLoading } = useBookings(
    user && bookingTab === "renting" ? { renter_id: user.id } : undefined
  );

  const { data: ownerBookings, isLoading: isOwnerBookingsLoading } = useBookings(
    user && bookingTab === "renting_out" ? { owner_id: user.id } : undefined
  );

  const { data: items, isLoading: isItemsLoading } = useItems(
    user ? { owner_id: user.id, limit: itemsLimit, skip: (itemsPage - 1) * itemsLimit } : undefined
  );

  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => itemsApi.delete(id),
    onSuccess: () => {
      toast.success("Listing deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || "Failed to delete listing");
    },
  });

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
            onClick={() => navigate(ROUTES.MESSAGES)}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "messages" ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            <MessageCircle className="w-4 h-4 mr-2" /> Messages
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[400px]">
          {activeTab === "bookings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900">My Bookings</h2>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button onClick={() => setBookingTab("renting")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${bookingTab === "renting" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>
                    Renting
                  </button>
                  <button onClick={() => setBookingTab("renting_out")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${bookingTab === "renting_out" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>
                    Renting Out
                  </button>
                </div>
              </div>

              {bookingTab === "renting" ? (
                isRenterBookingsLoading ? (
                  <p className="text-gray-500 text-center py-12">Loading bookings...</p>
                ) : renterBookings?.items?.length ? (
                  <div className="space-y-4">
                    {renterBookings.items.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} isOwner={false} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">You have no active rentals.</div>
                )
              ) : (
                isOwnerBookingsLoading ? (
                  <p className="text-gray-500 text-center py-12">Loading bookings...</p>
                ) : ownerBookings?.items?.length ? (
                  <div className="space-y-4">
                    {ownerBookings.items.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} isOwner={true} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">No one has booked your items yet.</div>
                )
              )}
            </motion.div>
          )}

          {activeTab === "items" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Listings</h2>
                <button
                  onClick={() => setIsCreateItemModalOpen(true)}
                  className="bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 shadow-md shadow-green-600/20 flex items-center transition-all"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> List New Item
                </button>
              </div>
              {isItemsLoading ? (
                <p className="text-gray-500">Loading listings...</p>
              ) : items?.items?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.items.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-gray-200 overflow-hidden bg-white hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <div className="aspect-video bg-gray-100 relative overflow-hidden">
                          <img
                            src={item.images?.[0]?.url || `https://placehold.co/600x400/e2e8f0/1e293b?text=${encodeURIComponent(item.title)}`}
                            className="absolute inset-0 w-full h-full object-cover"
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              e.currentTarget.src = `https://placehold.co/600x400/e2e8f0/1e293b?text=${encodeURIComponent(item.title)}`;
                            }}
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 line-clamp-1 text-base">{item.title}</h3>
                          <div className="flex justify-between items-center mt-2">
                            <p className="font-semibold text-green-700 text-sm">${item.daily_price}/day</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${item.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                              {item.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0 border-t border-gray-100 flex justify-between items-center mt-2">
                        <button
                          onClick={() => navigate(`/items/${item.id}`)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1" /> View Listing
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this listing?")) {
                              deleteItemMutation.mutate(item.id);
                            }
                          }}
                          className="text-xs text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">You haven't listed any items yet.</div>
              )}

              {/* Items Pagination */}
              {!isItemsLoading && items?.total && items.total > itemsLimit && (
                <div className="mt-8 flex justify-center items-center gap-4">
                  <button
                    disabled={itemsPage === 1}
                    onClick={() => setItemsPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {itemsPage} of {Math.ceil(items.total / itemsLimit)}
                  </span>
                  <button
                    disabled={itemsPage >= Math.ceil(items.total / itemsLimit)}
                    onClick={() => setItemsPage((p) => p + 1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </motion.div>
          )}

        </div>
      </div>

      <CreateItemModal
        isOpen={isCreateItemModalOpen}
        onClose={() => setIsCreateItemModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
