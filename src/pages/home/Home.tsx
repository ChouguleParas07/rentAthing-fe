import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search, Users, Leaf, MapPin, Star,
  Wrench, Laptop, Tent, Sofa, Trophy,
  Camera, PartyPopper, LayoutGrid, ArrowRight, Heart
} from "lucide-react";

import { useItems } from "@/hooks/items/useItems";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const categories = [
  { name: "Tools", icon: Wrench, color: "bg-green-50 text-green-600" },
  { name: "Electronics", icon: Laptop, color: "bg-blue-50 text-blue-600" },
  { name: "Outdoor", icon: Tent, color: "bg-orange-50 text-orange-600" },
  { name: "Home & Living", icon: Sofa, color: "bg-purple-50 text-purple-600" },
  { name: "Sports", icon: Trophy, color: "bg-rose-50 text-rose-600" },
  { name: "Cameras", icon: Camera, color: "bg-amber-50 text-amber-600" },
  { name: "Party & Events", icon: PartyPopper, color: "bg-pink-50 text-pink-600" },
  { name: "More", icon: LayoutGrid, color: "bg-gray-50 text-gray-600" },
];

const stats = [
  { icon: Users, value: "1K+", label: "Happy Users" },
  { icon: Leaf, value: "500+", label: "Items Listed" },
  { icon: MapPin, value: "50+", label: "Local Areas" },
  { icon: Star, value: "4.8", label: "Average Rating" },
];

const Home = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const { data, isLoading } = useItems({ limit: 12, search: searchQuery });

  const handleSearch = () => {
    setSearchQuery(searchInputRef.current?.value || undefined);
  };

  return (
    <div className="min-h-screen" style={{ backgroundImage: "url('/assets/back.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
      {/* Hero Section */}
      <section className="relative px-4 pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Soft Background Blob */}
        <div
          className="absolute top-0 right-0 -mr-40 -mt-40 w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(220, 252, 231, 0.6) 0%, rgba(220, 252, 231, 0) 70%)' }}
        />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100/60 text-green-700 text-sm font-semibold mb-6"
              >
                <Leaf className="w-4 h-4" />
                Sustainable Sharing Economy
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#1A2530] leading-[1.1]"
              >
                Rent <span className="text-[#00A843]">anything</span>,<br />
                anytime.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed"
              >
                Stashly connects you with locals to rent out everyday items.
                Save money, reduce waste, and earn by sharing what you own.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 flex p-1.5 bg-white rounded-full shadow-lg border border-gray-100 max-w-xl"
              >
                <div className="relative flex-1 flex items-center">
                  <Search className="absolute left-5 text-gray-400 w-5 h-5" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    defaultValue={searchQuery}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="What do you need?"
                    className="w-full h-full pl-12 pr-4 bg-transparent outline-none text-gray-900 placeholder-gray-400 font-medium"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="rounded-full h-12 px-8 bg-[#00A843] hover:bg-[#009038] text-white font-bold text-base shadow-sm"
                >
                  Search
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-12 flex flex-wrap gap-8 items-center"
              >
                {stats.map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-[#00A843]">
                      <stat.icon className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <div className="font-extrabold text-[#1A2530] text-lg leading-tight">{stat.value}</div>
                      <div className="text-gray-500 text-xs font-medium">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Content - Collage */}
            <div className="relative hidden lg:block h-[600px] w-full">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Decorative strokes */}
                <svg className="absolute w-full h-full text-[#7ECB5B] pointer-events-none" viewBox="0 0 500 500" fill="none">
                  {/* Sunburst top right */}
                  <path d="M420 120 Q 430 140 450 145" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                  <path d="M435 110 Q 445 125 460 125" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                  {/* Swoosh middle left */}
                  <path d="M280 180 Q 290 190 280 200" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                  <path d="M270 195 Q 285 195 285 205" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                  {/* Arrow bottom right */}
                  <path d="M420 370 Q 400 380 430 400" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="transparent" />
                  <path d="M430 400 L 415 395 M 430 400 L 425 385" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>

                {/* Drill Image (Top Right) */}
                <motion.div
                  initial={{ opacity: 0, rotate: -10, x: 50, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 6, x: 60, y: -120, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="absolute z-10"
                >
                  <div className="absolute -left-32 top-10 flex flex-col items-end">
                    <span className="font-writing text-gray-800 text-sm rotate-[-10deg] max-w-[120px] text-center">Get the right tools for the job</span>
                    <svg className="w-8 h-8 text-gray-800 -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </div>
                  <div className="p-3 bg-white rounded-2xl shadow-xl w-48 h-48">
                    <img src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80" alt="Drill" className="w-full h-full object-cover rounded-xl" />
                  </div>
                </motion.div>

                {/* Camera Image (Bottom Left) */}
                <motion.div
                  initial={{ opacity: 0, rotate: 10, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: -4, x: -50, y: 80, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="absolute z-30"
                >
                  <div className="absolute -bottom-16 left-4 flex flex-col items-center">
                    <svg className="w-8 h-8 text-gray-800 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    <span className="font-writing text-gray-800 text-sm rotate-2 bg-white px-3 py-1 rounded-full shadow-sm whitespace-nowrap">Capture new experiences</span>
                  </div>
                  <div className="p-3 bg-white rounded-3xl shadow-2xl w-64 h-56">
                    <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80" alt="Camera" className="w-full h-full object-cover rounded-2xl" />
                  </div>
                </motion.div>

                {/* Tent Image (Middle Right) */}
                <motion.div
                  initial={{ opacity: 0, rotate: -5, x: 100, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 12, x: 140, y: 20, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute z-20"
                >
                  <div className="absolute -bottom-12 right-0 flex flex-col items-center">
                    <span className="font-writing text-gray-800 text-sm rotate-[-5deg] bg-white px-3 py-1 rounded-full shadow-sm whitespace-nowrap">Gear up for adventure</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-2xl shadow-lg w-40 h-40">
                    <img src="https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&w=400&q=80" alt="Tent" className="w-full h-full object-cover rounded-xl" />
                  </div>
                </motion.div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 px-4 container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#1A2530]">Browse by Category</h2>
          <Button variant="ghost" className="text-[#00A843] hover:text-[#009038] hover:bg-green-50">
            View all <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <div key={category.name} className="flex flex-col items-center gap-3 cursor-pointer group">
              <div className={`w-full aspect-[4/3] rounded-2xl flex items-center justify-center ${category.color} transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-md`}>
                <category.icon className="w-7 h-7" />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 text-center">{category.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Items Grid */}
      <section className="py-12 px-4 container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-[#1A2530]">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Latest Additions"}
            </h2>
            {!searchQuery && (
              <p className="text-gray-500 mt-2 font-medium">Check out the newest items available for rent from your local community.</p>
            )}
          </div>
          <Button variant="ghost" className="text-[#00A843] hover:text-[#009038] hover:bg-green-50 self-start md:self-auto rounded-full px-6 bg-green-50/50 font-bold">
            View all <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-96 rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.items?.length ? data.items.map((item, idx) => {
              const categoryMatch = categories.find(c => c.name.toLowerCase() === item.category?.name?.toLowerCase()) || categories[7];
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
                  transition={{ delay: idx * 0.05 }}
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
              <div className="col-span-full text-center py-20 text-gray-500 bg-white rounded-3xl border border-gray-100 border-dashed">
                No items available at the moment.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;