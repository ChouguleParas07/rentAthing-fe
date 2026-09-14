import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar as CalendarIcon, MapPin, Star, User } from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useQuery } from "@tanstack/react-query";
import { bookingsApi } from "@/api/bookings.api";
import ReviewList from "@/components/reviews/ReviewList";

import { useItem } from "@/hooks/items/useItem";
import { useCreateBooking } from "@/hooks/bookings/useBookings";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";

const ItemDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: item, isLoading } = useItem(id!);
  const { mutate: createBooking, isPending } = useCreateBooking();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: bookingsData } = useQuery({
    queryKey: ["bookings", "item", id],
    queryFn: () => bookingsApi.list({ item_id: id }),
    enabled: !!id,
  });

  const getTileClassName = ({ date, view }: any) => {
    if (view === 'month') {
      const isBooked = bookingsData?.items.some((b) => {
        if (b.status === "CANCELLED" || b.status === "REJECTED") return false;
        const start = new Date(b.start_date);
        const end = new Date(b.end_date);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        const current = new Date(date);
        current.setHours(0, 0, 0, 0);
        return current >= start && current <= end;
      });
      return isBooked ? 'bg-red-100 text-red-500 font-bold rounded-lg' : null;
    }
    return null;
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const handleBooking = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    createBooking(
      {
        item_id: item!.id,
        start_date: startDate,
        end_date: endDate,
      },
      {
        onSuccess: () => {
          toast.success("Booking request sent successfully!");
          setIsBookingModalOpen(false);
          navigate(ROUTES.DASHBOARD);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.detail || "Failed to create booking");
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse bg-gray-200 h-96 w-full max-w-4xl rounded-3xl" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Item not found</h2>
          <Link to="/" className="text-green-600 hover:underline mt-4 inline-block">Return to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-green-900/5 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

            {/* Image Section */}
            <div className="relative bg-gray-100 aspect-square md:aspect-auto">
              <img
                src={item.images?.[0]?.url || `https://placehold.co/600x400/e2e8f0/1e293b?text=${encodeURIComponent(item.title)}`}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/600x400/e2e8f0/1e293b?text=${encodeURIComponent(item.title)}`;
                }}
              />


            </div>

            {/* Details Section */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col">

              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{item.title}</h1>

              <div className="flex items-center gap-4 text-gray-500 text-sm mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {item.location_text || "Location not specified"}</div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  {item.rating_count > 0 ? `${item.avg_rating.toFixed(1)} (${item.rating_count} reviews)` : "No reviews"}
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-8 flex-1">
                {item.description}
              </p>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 font-medium">Daily Rate</span>
                  <span className="text-3xl font-bold text-gray-900">${item.daily_price}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Security Deposit</span>
                  <span className="text-gray-700 font-medium">${item.security_deposit}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Owned by</p>
                  <p className="text-gray-900 font-semibold">User {item.owner_id.substring(0, 8)}</p>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full text-lg h-14 bg-green-600 hover:bg-green-700 rounded-xl shadow-lg shadow-green-600/20"
                onClick={() => setIsBookingModalOpen(true)}
              >
                <CalendarIcon className="w-5 h-5 mr-2" />
                Request to Book
              </Button>
            </div>
          </div>

          {/* Map and Calendar Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-gray-100">
            <div className="p-8 md:p-12 lg:p-16 border-b md:border-b-0 md:border-r border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Location</h3>
              <div className="h-64 w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                <MapContainer center={[item.location_lat || 40.7128, item.location_lng || -74.0060]} zoom={13} style={{ height: "100%", width: "100%" }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[item.location_lat || 40.7128, item.location_lng || -74.0060]} />
                </MapContainer>
              </div>
            </div>
            <div className="p-8 md:p-12 lg:p-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Availability</h3>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex justify-center">
                <Calendar
                  tileClassName={getTileClassName}
                  className="border-0 font-sans w-full max-w-sm"
                  minDate={item.available_from ? new Date(item.available_from) : new Date()}
                  maxDate={item.available_until ? new Date(item.available_until) : undefined}
                />
              </div>
            </div>
          </div>
          s
          {/* Reviews Section */}
          <div className="p-8 md:p-12 lg:p-16 border-t border-gray-100 bg-gray-50/50">
            <ReviewList targetId={item.id} />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title="Request to Book"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Select dates to book <span className="font-semibold text-gray-900">{item.title}</span>.</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600"
              />
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Daily Rate x {calculateDays()} days</span>
              <span className="font-medium text-gray-900">${(item.daily_price * calculateDays()).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Deposit</span>
              <span className="font-medium text-gray-900">${item.security_deposit}</span>
            </div>
            <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-green-200">
              <span className="text-gray-900">Total</span>
              <span className="text-green-700">${(item.daily_price * calculateDays() + Number(item.security_deposit)).toFixed(2)}</span>
            </div>
          </div>
          <Button
            className="w-full h-12 bg-green-600 hover:bg-green-700 mt-2 text-white"
            onClick={handleBooking}
            isLoading={isPending}
          >
            Confirm Booking Request
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ItemDetails;
