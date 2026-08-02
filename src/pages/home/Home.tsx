import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

import { useItems } from "@/hooks/items/useItems";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

const Home = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const { data, isLoading } = useItems({ limit: 12, search: searchQuery });

  const handleSearch = () => {
    setSearchQuery(searchInput || undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-amber-400/10 backdrop-blur-3xl" />
        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900"
          >
            Rent <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-lime-500">anything</span>, anytime.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Stashly connects you with locals to rent out everyday items. Save money, reduce waste, and earn by sharing what you own.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 max-w-2xl mx-auto flex gap-2 p-2 bg-white rounded-full shadow-lg border border-gray-100"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="What do you need?"
                className="w-full h-12 pl-12 pr-4 bg-transparent outline-none text-gray-900 placeholder-gray-500"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="rounded-full h-12 px-8 bg-green-600 hover:bg-green-700 text-white font-medium text-lg"
            >
              Search
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Items Grid */}
      <section className="py-20 px-4 container mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">
          {searchQuery ? `Search Results for "${searchQuery}"` : "Latest Additions"}
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-80 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.items?.length ? data.items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <Link to={`/items/${item.id}`} className="block group">
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 bg-white/70">
                    <div className="aspect-square relative overflow-hidden bg-gray-100">
                      <img
                        src={item.images?.url ? `https://placehold.co/600x400/e2e8f0/1e293b?text=${encodeURIComponent(item.title)}` : `https://placehold.co/600x400/e2e8f0/1e293b?text=${encodeURIComponent(item.title)}`}
                        alt={item.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-green-700 shadow-sm">
                        ${item.daily_price}/day
                      </div>
                    </div>
                    <CardHeader className="p-5 pb-0">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{item.title}</h3>
                    </CardHeader>
                    <CardContent className="p-5 pt-2">
                      <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-20 text-gray-500">
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