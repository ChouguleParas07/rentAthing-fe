import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

import { useItems } from "@/hooks/items/useItems";
import { useCategories } from "@/hooks/categories/useCategories";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

const Products = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 12;
  const { data, isLoading } = useItems({ limit, skip: (page - 1) * limit, search: searchQuery, category_id: categoryId || undefined });
  const { data: categories } = useCategories();

  const handleSearch = () => {
    setSearchQuery(searchInput || undefined);
    setPage(1); // Reset page on new search
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
          </h1>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setPage(1);
              }}
              className="h-10 px-4 rounded-full border border-gray-200 bg-white text-gray-900 text-sm outline-none focus:border-green-600 w-full md:w-48"
            >
              <option value="">All Categories</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <div className="flex gap-2 p-1 bg-white rounded-full shadow-sm border border-gray-200 w-full md:w-96">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search products..."
                  className="w-full h-10 pl-9 pr-4 bg-transparent outline-none text-gray-900 text-sm placeholder-gray-500"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="rounded-full h-10 px-6 bg-green-600 hover:bg-green-700 text-white font-medium text-sm"
              >
                Search
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
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
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 bg-white">
                    <div className="aspect-square relative overflow-hidden bg-gray-100">
                      <img
                        src={item.images?.[0]?.url || `https://placehold.co/400x300/e2e8f0/1e293b?text=${encodeURIComponent(item.title)}`}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.src = `https://placehold.co/600x400/e2e8f0/1e293b?text=${encodeURIComponent(item.title)}`;
                        }}
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
              <div className="col-span-full text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-lg">No products found.</p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchInput("");
                      setSearchQuery(undefined);
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
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm font-medium text-gray-700">
              Page {page} of {Math.ceil(data.total / limit)}
            </span>
            <Button
              variant="outline"
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
