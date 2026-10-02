import { useState } from "react";

import { Calendar, Clock, CheckCircle2, XCircle, Plus, ChevronDown, Package, MessageCircle } from "lucide-react";
import { useProfile } from "@/hooks/auth/useProfile";
import { useBookings } from "@/hooks/bookings/useBookings";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { BookingCard } from "@/components/booking/BookingCard";
import { CreateItemModal } from "@/components/items/CreateItemModal";
import { useItems } from "@/hooks/items/useItems";
import { ItemCard } from "@/components/items/ItemCard";
import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/api/chat.api";

const Dashboard = () => {
  const { data: user, isLoading: isUserLoading } = useProfile();
  const [activeTab, setActiveTab] = useState<"bookings" | "items" | "messages">("bookings");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const [isCreateItemModalOpen, setIsCreateItemModalOpen] = useState(false);

  const { data: renterBookings, isLoading: isRenterBookingsLoading } = useBookings(
    user ? { renter_id: user.id } : undefined
  );

  const { data: ownerBookings } = useBookings(
    user ? { owner_id: user.id } : undefined
  );

  const { data: userItems, isLoading: isUserItemsLoading } = useItems(
    user ? { owner_id: user.id, limit: 100 } : undefined
  );

  const { data: messagesResponse } = useQuery({
    queryKey: ["messages", "all"],
    queryFn: () => chatApi.getConversations({ limit: 100 }),
    enabled: !!user,
  });

  const messages = messagesResponse?.items || messagesResponse?.messages || [];
  const conversationsCount = new Set(messages.map((m: any) => m.sender_id === user?.id ? m.receiver_id : m.sender_id)).size;

  if (isUserLoading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  if (!user) return <div className="p-8 text-center text-gray-500">Please sign in.</div>;

  const allBookings = [...(renterBookings?.items || []), ...(ownerBookings?.items || [])];

  // Dedup and sort logic for demo purposes
  const uniqueBookings = Array.from(new Map(allBookings.map(item => [item.id, item])).values())
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const ongoingCount = uniqueBookings.filter(b => ["REQUESTED", "PENDING", "APPROVED", "ACTIVE"].includes(b.status)).length;
  const completedCount = uniqueBookings.filter(b => b.status === "COMPLETED").length;
  const cancelledCount = uniqueBookings.filter(b => b.status === "CANCELLED" || b.status === "REJECTED").length;

  const filteredBookings = uniqueBookings.filter(b => {
    if (filter === "ongoing") return ["REQUESTED", "PENDING", "APPROVED", "ACTIVE"].includes(b.status);
    if (filter === "completed") return b.status === "COMPLETED";
    if (filter === "cancelled") return ["CANCELLED", "REJECTED"].includes(b.status);
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAF9] px-6 py-10 md:px-12 pb-20 overflow-x-hidden relative z-0">

      {/* High-Fidelity Background Texture & Organic Shapes (Full Page) */}
      <div className="absolute inset-0 overflow-hidden -z-20 pointer-events-none">
        {/* SVG Noise Texture - Covers everything */}
        <div
          className="absolute inset-0 opacity-[0.35] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
        {/* Soft Organic Gradients - Positioned at top */}
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[800px] bg-gradient-to-br from-green-200/40 to-transparent rounded-[100%] blur-3xl transform -rotate-12" />
        <div className="absolute top-[-5%] right-[-5%] w-[60%] h-[700px] bg-gradient-to-bl from-emerald-200/50 via-lime-100/20 to-transparent rounded-[100%] blur-3xl" />
        <div className="absolute top-[10%] left-[30%] w-[40%] h-[600px] bg-lime-200/20 rounded-full blur-3xl mix-blend-multiply" />
      </div>


      <div className="max-w-7xl mx-auto">

        {/* Top Hero Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12 relative">
          <div className="z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A2530] tracking-tight">
              Welcome back, <span className="text-[#00A843]">{user.full_name || user.email}</span>
            </h1>
            <p className="text-gray-500 mt-2 text-lg">Manage your rentals, listings, and messages here.</p>

            <div className="flex flex-wrap gap-3 mt-8">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`flex items-center px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm ${activeTab === "bookings" ? "bg-[#00A843] text-white shadow-md" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"}`}
              >
                <Calendar className="w-4 h-4 mr-2" /> My Bookings
              </button>
              <button
                onClick={() => setActiveTab("items")}
                className={`flex items-center px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm ${activeTab === "items" ? "bg-[#00A843] text-white shadow-md" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"}`}
              >
                <Package className="w-4 h-4 mr-2" /> My Listings
              </button>
              <button
                onClick={() => navigate(ROUTES.MESSAGES)}
                className={`flex items-center px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm bg-white text-gray-700 border border-gray-200 hover:bg-gray-50`}
              >
                <MessageCircle className="w-4 h-4 mr-2" /> Messages
                {conversationsCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-[10px]">{conversationsCount}</span>
                )}
              </button>
            </div>
          </div>

          <div className="hidden lg:flex items-center right-0 top-0 absolute">
            <div className="text-right mr-6 -mt-10 font-bold text-gray-600 italic rotate-[-6deg] leading-tight text-xl tracking-wide opacity-80" style={{ fontFamily: 'Kalam, cursive' }}>
              Rent<br />Use<br />Return<br />Repeat
              <svg className="absolute -bottom-8 -left-4 w-12 h-12 text-gray-600 rotate-[20deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400" alt="Box illustration placeholder" className="w-72 h-48 object-cover rounded-3xl shadow-xl rotate-3 mask-image-blob opacity-90 mix-blend-multiply" style={{ clipPath: 'polygon(0 10%, 100% 0, 90% 100%, 10% 90%)' }} />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 mb-12">
          {/* Stats Pills - Takes 8 cols */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-emerald-50 rounded-[2rem] p-5 flex flex-col justify-center items-center gap-2 border border-emerald-100/50 shadow-sm transition-transform hover:scale-105">
              <div className="flex items-center gap-3 w-full justify-center">
                <div className="p-2.5 bg-white rounded-2xl shadow-sm text-emerald-600 border border-emerald-50">
                  <Calendar className="w-6 h-6" />
                </div>
                <p className="text-3xl font-black text-gray-900">{uniqueBookings.length}</p>
              </div>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Total Bookings</p>
            </div>

            <div className="bg-blue-50 rounded-[2rem] p-5 flex flex-col justify-center items-center gap-2 border border-blue-100/50 shadow-sm transition-transform hover:scale-105">
              <div className="flex items-center gap-3 w-full justify-center">
                <div className="p-2.5 bg-white rounded-2xl shadow-sm text-blue-600 border border-blue-50">
                  <Clock className="w-6 h-6" />
                </div>
                <p className="text-3xl font-black text-gray-900">{ongoingCount}</p>
              </div>
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Ongoing Rentals</p>
            </div>

            <div className="bg-amber-50 rounded-[2rem] p-5 flex flex-col justify-center items-center gap-2 border border-amber-100/50 shadow-sm transition-transform hover:scale-105">
              <div className="flex items-center gap-3 w-full justify-center">
                <div className="p-2.5 bg-white rounded-2xl shadow-sm text-amber-600 border border-amber-50">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-3xl font-black text-gray-900">{completedCount}</p>
              </div>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Completed</p>
            </div>

            <div className="bg-rose-50 rounded-[2rem] p-5 flex flex-col justify-center items-center gap-2 border border-rose-100/50 shadow-sm transition-transform hover:scale-105">
              <div className="flex items-center gap-3 w-full justify-center">
                <div className="p-2.5 bg-white rounded-2xl shadow-sm text-rose-600 border border-rose-50">
                  <XCircle className="w-6 h-6" />
                </div>
                <p className="text-3xl font-black text-gray-900">{cancelledCount}</p>
              </div>
              <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Cancelled</p>
            </div>
          </div>

          {/* Call to Action Card - Takes 4 cols */}
          <div className="lg:col-span-4 bg-gradient-to-br from-green-100 to-emerald-50 rounded-[2rem] p-6 shadow-sm border border-emerald-100 flex items-center relative overflow-hidden">
            <div className="z-10 w-2/3">
              <h3 className="text-lg font-extrabold text-[#1A2530] leading-tight">Turn your unused items into income</h3>
              <p className="text-xs text-gray-600 mt-1 mb-4">List your items and start earning today!</p>
              <button onClick={() => setIsCreateItemModalOpen(true)} className="bg-[#00A843] hover:bg-[#009038] text-white text-xs font-bold px-4 py-2 rounded-full shadow-md transition-colors flex items-center">
                Create a Listing <Plus className="w-3 h-3 ml-1" />
              </button>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 opacity-80 mix-blend-multiply">
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&auto=format&fit=crop&q=60" alt="Box" className="w-full h-full object-cover rounded-full" />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 min-h-[500px]">
          {activeTab === "bookings" && (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#1A2530]">My Bookings</h2>
                  <p className="text-gray-500 text-sm">Track and manage all your rental activities</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setFilter("all")} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${filter === 'all' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>All ({uniqueBookings.length})</button>
                  <button onClick={() => setFilter("ongoing")} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${filter === 'ongoing' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Ongoing ({ongoingCount})</button>
                  <button onClick={() => setFilter("completed")} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${filter === 'completed' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Completed ({completedCount})</button>
                  <button onClick={() => setFilter("cancelled")} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${filter === 'cancelled' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Cancelled ({cancelledCount})</button>
                </div>

                <button className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M6 12h12m-9 6h6" /></svg>
                  Latest First <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {isRenterBookingsLoading ? (
                  <div className="text-center py-10">Loading bookings...</div>
                ) : filteredBookings.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">No bookings found.</div>
                ) : (
                  filteredBookings.map(booking => (
                    <BookingCard key={booking.id} booking={booking} isOwner={booking.owner_id === user.id} />
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === "items" && (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#1A2530]">My Listings</h2>
                  <p className="text-gray-500 text-sm">Manage the items you are currently renting out</p>
                </div>
                <button
                  onClick={() => setIsCreateItemModalOpen(true)}
                  className="bg-[#00A843] hover:bg-[#009038] text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-md transition-colors flex items-center"
                >
                  Create a Listing <Plus className="w-4 h-4 ml-1.5" />
                </button>
              </div>

              {isUserItemsLoading ? (
                <div className="text-center py-10">Loading items...</div>
              ) : !userItems?.items || userItems.items.length === 0 ? (
                <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="font-semibold text-gray-600">No items listed yet.</p>
                  <p className="text-sm">Turn your unused stuff into extra income!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {userItems.items.map(item => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <CreateItemModal isOpen={isCreateItemModalOpen} onClose={() => setIsCreateItemModalOpen(false)} />
    </div >
  );
};

export default Dashboard;
