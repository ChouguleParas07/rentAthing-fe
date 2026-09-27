import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { itemsApi } from "@/api/items.api";
import { reviewsApi } from "@/api/reviews.api";
import { useUser } from "@/hooks/users/useUser";
import { useProfile } from "@/hooks/auth/useProfile";
import { Card, CardContent } from "@/components/ui/Card";
import { Star, MapPin, MessageCircle, ShieldCheck, CheckCircle2, Edit3 } from "lucide-react";

export const PublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: currentUser } = useProfile();
  const { data: userProfile } = useUser(id);

  const isSelf = currentUser?.id === id;

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

  const name = userProfile?.full_name || userProfile?.email || (id ? `User ${id.substring(0, 8)}` : "User Profile");
  const avatarLetter = (name[0] || "U").toUpperCase();
  const rating = userProfile?.avg_rating || 5.0;

  return (
    <div className="min-h-screen bg-[#F8FAF9] py-12 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Profile Info Sidebar */}
        <div className="col-span-1">
          <Card className="bg-white border-0 shadow-sm sticky top-8 rounded-3xl overflow-hidden">
            <CardContent className="p-8 text-center flex flex-col items-center">
              {/* WhatsApp / Premium Style Avatar Circle */}
              <div className="relative mb-4">
                <div className="w-28 h-28 bg-gradient-to-tr from-green-600 to-emerald-400 text-white rounded-full flex items-center justify-center font-bold text-4xl shadow-lg border-4 border-white overflow-hidden">
                  {userProfile?.avatar_url ? (
                    <img src={userProfile.avatar_url} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    avatarLetter
                  )}
                </div>
                {userProfile?.is_verified && (
                  <span className="absolute bottom-1 right-1 bg-white p-1 rounded-full text-green-600 shadow-md" title="Verified User">
                    <CheckCircle2 className="w-6 h-6 fill-green-600 text-white" />
                  </span>
                )}
              </div>

              <h2 className="text-3xl font-extrabold text-[#1A2530] mb-1">{name}</h2>
              {userProfile?.role && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#00A843]/10 text-[#00A843] mb-3">
                  {userProfile.role}
                </span>
              )}

              <div className="flex items-center gap-2 text-amber-500 mb-6">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
                <span className="text-gray-400 text-sm">({userReviews?.total || userProfile?.rating_count || 0} reviews)</span>
              </div>

              {isSelf ? (
                <Link
                  to="/profile"
                  className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-md mb-4"
                >
                  <Edit3 className="w-5 h-5" /> Edit Profile Settings
                </Link>
              ) : (
                <Link
                  to={`/messages?user_id=${id}`}
                  className="w-full py-3 bg-[#00A843] hover:bg-[#009038] text-white font-bold rounded-full flex items-center justify-center gap-2 transition-colors shadow-md shadow-[#00A843]/20 mb-4"
                >
                  <MessageCircle className="w-5 h-5" /> Chat with {name.split(" ")[0]}
                </Link>
              )}

              <div className="w-full border-t border-gray-100 pt-4 text-left space-y-3">
                {userProfile?.city && (
                  <p className="text-sm text-gray-600 flex justify-between">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" /> Location</span>
                    <span className="font-medium text-gray-900">{userProfile.city}</span>
                  </p>
                )}
                <p className="text-sm text-gray-600 flex justify-between">
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-gray-400" /> Trust Score</span>
                  <span className="font-bold text-[#00A843]">{userProfile?.trust_score ?? 100} / 100</span>
                </p>
                <p className="text-sm text-gray-600 flex justify-between">
                  <span>Active Listings</span>
                  <span className="font-medium text-gray-900">{userItems?.total || 0}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Listings and Reviews */}
        <div className="col-span-1 md:col-span-2 space-y-8">

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-extrabold text-[#1A2530] mb-6">Listings by {name.split(" ")[0]}</h3>
            {itemsLoading ? (
              <p className="text-gray-500">Loading items...</p>
            ) : userItems?.items?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {userItems.items.map((item) => (
                  <Link to={`/items/${item.id}`} key={item.id} className="block group">
                    <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                        <img
                          src={item.images?.[0]?.url || `https://placehold.co/400x300/e2e8f0/1e293b?text=${encodeURIComponent(item.title)}`}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-extrabold text-gray-900 line-clamp-1">{item.title}</h4>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-gray-500"><MapPin className="w-3 h-3 inline mr-1" />{item.location_text}</p>
                          <p className="font-extrabold text-[#00A843]">₹{item.daily_price}/day</p>
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
