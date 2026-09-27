import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, ArrowRight, Package, Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Item } from "@/api/items.api";
import { Button } from "@/components/ui/Button";

interface ItemCardProps {
  item: Item;
  isOwnerView?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, isOwnerView = false }) => {
  return (
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
          {/* Category Pill */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm bg-white/90 text-gray-800 backdrop-blur-sm">
            {item.category?.name || "Category"}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-extrabold text-lg text-[#1A2530] line-clamp-1 mb-1">{item.title}</h3>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">{item.description}</p>

          <div className="flex items-center justify-between mt-auto mb-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-green-50 text-green-700">
              <Package className="w-3.5 h-3.5" />
              Available
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
                <span className="text-[10px] font-semibold uppercase tracking-wider">{item.location_text || "Pune"}</span>
              </div>
              <div className="font-extrabold text-[#00A843] text-lg leading-none">
                ₹{item.daily_price}<span className="text-sm font-semibold text-gray-600">/day</span>
              </div>
            </div>
            {isOwnerView ? (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="p-2 h-auto rounded-xl" onClick={(e) => { e.preventDefault(); /* edit item */ }}>
                  <Edit className="w-4 h-4 text-blue-600" />
                </Button>
                <Button size="sm" variant="outline" className="p-2 h-auto rounded-xl border-red-200 hover:bg-red-50" onClick={(e) => { e.preventDefault(); /* delete item */ }}>
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-[#00A843] rounded-full text-[11px] font-bold group-hover:bg-[#00A843] group-hover:text-white transition-colors">
                View Details <ArrowRight className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
