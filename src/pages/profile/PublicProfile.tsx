import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { itemsApi } from "@/api/items.api";
import { reviewsApi } from "@/api/reviews.api";
import { Card, CardContent } from "@/components/ui/Card";
import { User, Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export const PublicProfile = () => {
  const { id } = useParams<{ id: string }>();

  const { data: userItems, isLoading: itemsLoading } = useQuery({
    queryKey: ["items", "user", id],
    queryFn: () => itemsApi.list({ owner_id: id, limit: 100 }),
    enabled: !!id,
  });

  const { data: userReviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", "user", id],
    queryFn: () => reviewsApi.listByUser(id!),
    enabled: !!id,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Profile Info Sidebar */}
        <div className="col-span-1">
          <Card className="bg-white border-0 shadow-sm sticky top-8">
            <CardContent className="p-8 text-center flex flex-col items-center">
              <div className="w-32 h-32 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mb-6">
                <User className="w-16 h-16" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">User {id?.substring(0, 8)}</h2>
              <div className="flex items-center gap-2 text-amber-500 mb-4">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-medium text-gray-900">
                  4.8
                </span>
                <span className="text-gray-500">({userReviews?.total || 0} reviews)</span>
              </div>
              <div className="w-full border-t border-gray-100 my-4 pt-4 text-left space-y-3">
                <p className="text-sm text-gray-600 flex justify-between">
                  <span>Listings</span>
                  <span className="font-medium text-gray-900">{userItems?.total || 0}</span>
                </p>
                <p className="text-sm text-gray-600 flex justify-between">
                  <span>Joined</span>
                  <span className="font-medium text-gray-900">2026</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Listings and Reviews */}
        <div className="col-span-1 md:col-span-2 space-y-8">

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Listings by User {id?.substring(0, 4)}</h3>
            {itemsLoading ? (
              <p className="text-gray-500">Loading items...</p>
            ) : userItems?.items?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {userItems.items.map((item) => (
                  <Link to={`/items/${item.id}`} key={item.id} className="block group">
                    <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-video relative overflow-hidden bg-gray-100">
                        <img
                          src={item.images?.[0]?.url || `https://placehold.co/400x300/e2e8f0/1e293b?text=${encodeURIComponent(item.title)}`}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h4>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-gray-500"><MapPin className="w-3 h-3 inline mr-1" />{item.location_text}</p>
                          <p className="font-bold text-green-700">${item.daily_price}/day</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No active listings.</p>
            )}
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Reviews</h3>
            {reviewsLoading ? (
              <p className="text-gray-500">Loading reviews...</p>
            ) : userReviews?.items?.length ? (
              <div className="space-y-6">
                {userReviews.items.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <div className="flex text-amber-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-200"}`} />
                      ))}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <p className="text-sm text-gray-400 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
