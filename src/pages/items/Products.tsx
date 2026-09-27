import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search, MapPin, Calendar, ArrowUpDown, LayoutGrid, List, Filter,
  Wrench, Laptop, Tent, Sofa, Trophy, Car,
  Camera, PartyPopper, MoreHorizontal, ArrowRight, Star, Heart
} from "lucide-react";

import { useItems } from "@/hooks/items/useItems";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const UI_CATEGORIES = [
  { id: "all", name: "All", icon: LayoutGrid, color: "bg-[#00A843] text-white" },
  { id: "electronics", name: "Electronics", icon: Laptop, color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
  { id: "cameras", name: "Cameras", icon: Camera, color: "bg-amber-50 text-amber-600 hover:bg-amber-100" },
  { id: "tools", name: "Tools", icon: Wrench, color: "bg-green-50 text-green-600 hover:bg-green-100" },
  { id: "outdoor", name: "Outdoor", icon: Tent, color: "bg-orange-50 text-orange-600 hover:bg-orange-100" },
  { id: "home", name: "Home & Living", icon: Sofa, color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
  { id: "sports", name: "Sports", icon: Trophy, color: "bg-rose-50 text-rose-600 hover:bg-rose-100" },
  { id: "vehicles", name: "Vehicles", icon: Car, color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100" },
  { id: "party", name: "Party & Events", icon: PartyPopper, color: "bg-pink-50 text-pink-600 hover:bg-pink-100" },
  { id: "others", name: "Others", icon: MoreHorizontal, color: "bg-gray-50 text-gray-600 hover:bg-gray-100" },
];

const Products = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 12;
  const { data, isLoading } = useItems({ limit, skip: (page - 1) * limit, search: searchQuery, category_id: categoryId === "all" ? undefined : categoryId });

  const handleSearch = () => {
    setSearchQuery(searchInputRef.current?.value || undefined);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] pb-20">

      {/* Header Section */}
      <div className="bg-[#F2FAF4] pt-12 pb-8 px-4 border-b border-green-100/50">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">

            {/* Title */}
            <div>
              <h1 className="text-4xl font-extrabold text-[#1A2530]">
                All <span className="text-[#00A843]">Products</span>
              </h1>
              <p className="text-gray-500 mt-2 font-medium">Discover and rent amazing items from people in your local community.</p>
            </div>

            {/* Search Bar & Hand-drawn text */}
            <div className="relative w-full lg:w-[500px]">
              <div className="absolute -top-12 -left-32 hidden xl:flex items-center gap-2 -rotate-6">
                <span className="font-writing text-2xl text-gray-700">Find what<br />you need</span>
                <svg width="60" height="40" viewBox="0 0 100 100" className="text-gray-600 mt-6 rotate-12">
                  <path d="M10,50 Q40,10 90,50" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M80,40 L90,50 L75,60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

              <div className="flex items-center p-1.5 bg-white rounded-full shadow-sm border border-gray-200">
                <Search className="text-gray-400 w-5 h-5 ml-4" />
                <input
                  ref={searchInputRef}
                  type="text"
                  defaultValue={searchQuery}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search products, e.g. camera, drone, tent..."
                  className="flex-1 h-11 px-3 bg-transparent outline-none text-gray-900 font-medium placeholder-gray-400"
                />
                <Button onClick={handleSearch} className="rounded-full px-8 h-11 bg-[#00A843] hover:bg-[#009038] text-white font-bold">
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Categories Pills */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 mt-8 no-scrollbar">
            {UI_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setCategoryId(cat.id); setPage(1); }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors shadow-sm ${isActive ? "bg-[#00A843] text-white" : "bg-white text-gray-600 border border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : cat.color.replace("bg-", "text-").split(" ")[0]}`} />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 mt-6">

        {/* Filters Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 shadow-sm whitespace-nowrap hover:bg-gray-50">
              <MapPin className="w-4 h-4 text-gray-400" /> Pune <ArrowUpDown className="w-3 h-3 ml-2 text-gray-400" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 shadow-sm whitespace-nowrap hover:bg-gray-50">
              <Calendar className="w-4 h-4 text-gray-400" /> Select dates <ArrowUpDown className="w-3 h-3 ml-2 text-gray-400" />
            </button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
              <ArrowUpDown className="w-4 h-4 text-gray-400" /> Sort by: Latest <ArrowUpDown className="w-3 h-3 ml-2 text-gray-400" />
            </button>
            <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-sm p-1">
              <button className="p-1.5 rounded-full bg-[#00A843] text-white"><LayoutGrid className="w-4 h-4" /></button>
              <button className="p-1.5 rounded-full text-gray-500 hover:text-gray-700"><List className="w-4 h-4" /></button>
            </div>
            <button className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
              <Filter className="w-4 h-4 text-gray-400" /> Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-96 rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.items?.length ? data.items.map((item, idx) => {
              // Map backend category string to our UI categories
              const catName = item.category?.name?.toLowerCase() || "";
              const categoryMatch = UI_CATEGORIES.find(c => catName.includes(c.id) || c.id === catName) || UI_CATEGORIES[9];
              const CategoryIcon = categoryMatch.icon;

              // Pseudo-random badge for aesthetic purposes based on index
              const badges = [
                { icon: "✨", text: "New", classes: "bg-emerald-100 text-emerald-700" },
                { icon: "🔥", text: "Popular", classes: "bg-orange-100 text-orange-700" },
                { icon: "👑", text: "Featured", classes: "bg-purple-100 text-purple-700" },
                { icon: "↗", text: "Trending", classes: "bg-green-100 text-green-700" }
              ];
              const badge = badges[idx % 4];

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx % 12) * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/items/${item.id}`} className="block group h-full">
                    <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 bg-white h-full flex flex-col rounded-3xl">
                      {/* Image Area */}
                      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                        <img
                          src={item.images?.[0]?.url || `https://placehold.co/400x300/e2e8f0/1e293b?text=${encodeURIComponent(item.title)}`}
                          alt={item.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/400x300/e2e8f0/1e293b?text=${encodeURIComponent(item.title)}`;
                          }}
                        />
                        {/* Top Left Badge */}
                        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 ${badge.classes}`}>
                          <span>{badge.icon}</span> {badge.text}
                        </div>
                        {/* Top Right Heart */}
                        <button
                          onClick={(e) => { e.preventDefault(); /* handle like */ }}
                          className="absolute top-3 right-3 p-1.5 bg-white text-gray-400 rounded-full shadow-sm hover:text-red-500 hover:bg-gray-50 transition-colors"
                        >
                          <Heart className="w-5 h-5" />
                        </button>
                        {/* Bottom Dots (Aesthetic) */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-100"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50"></div>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-extrabold text-lg text-[#1A2530] line-clamp-1 mb-1">{item.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">{item.description}</p>

                        <div className="flex items-center justify-between mt-auto mb-3">
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold ${categoryMatch.color}`}>
                            <CategoryIcon className="w-3.5 h-3.5" />
                            {categoryMatch.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-gray-700">
                              {Number(item.avg_rating || 4.5).toFixed(1)} <span className="text-gray-400 font-medium">({item.rating_count || 12})</span>
                            </span>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-100 w-full mb-3" />

                        {/* Footer Area */}
                        <div className="flex items-end justify-between">
                          <div>
                            <div className="flex items-center gap-1 text-gray-400 mb-1">
                              <MapPin className="w-3 h-3" />
                              <span className="text-[10px] font-semibold uppercase tracking-wider">Pune</span>
                            </div>
                            <div className="font-extrabold text-[#00A843] text-lg leading-none">
                              ₹{item.daily_price}<span className="text-sm font-semibold text-gray-600">/day</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-[#00A843] rounded-full text-[11px] font-bold group-hover:bg-[#00A843] group-hover:text-white transition-colors">
                            View Details <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            }) : (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 border-dashed">
                <p className="text-gray-500 text-lg font-medium">No products found.</p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    className="mt-4 rounded-full font-bold"
                    onClick={() => {
                      if (searchInputRef.current) searchInputRef.current.value = "";
                      setSearchQuery(undefined);
                      setPage(1);
                    }}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && data?.total && data.total > limit && (
          <div className="mt-12 flex justify-center items-center gap-4">
            <Button
              variant="outline"
              className="rounded-full font-bold"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm font-bold text-gray-700 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              Page {page} of {Math.ceil(data.total / limit)}
            </span>
            <Button
              variant="outline"
              className="rounded-full font-bold"
              disabled={page >= Math.ceil(data.total / limit)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
