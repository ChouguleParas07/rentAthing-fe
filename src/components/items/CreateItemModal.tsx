import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { itemsApi, type CreateItemPayload } from "@/api/items.api";
import { categoriesApi } from "@/api/categories.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, X, MapPin, DollarSign, ShieldAlert, Tag } from "lucide-react";

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateItemModal: React.FC<CreateItemModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [dailyPrice, setDailyPrice] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [locationText, setLocationText] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableUntil, setAvailableUntil] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.list,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateItemPayload) => itemsApi.create(payload),
    onSuccess: () => {
      toast.success("Item listed successfully!");
      queryClient.invalidateQueries({ queryKey: ["items"] });
      resetForm();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || "Failed to list item");
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategoryId("");
    setDailyPrice("");
    setSecurityDeposit("");
    setLocationText("");
    setAvailableFrom("");
    setAvailableUntil("");
    setImageUrl(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await itemsApi.uploadImage(file);
      setImageUrl(res.url);
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !dailyPrice) {
      toast.error("Title and daily price are required.");
      return;
    }

    const payload: CreateItemPayload = {
      title,
      description: description || undefined,
      category_id: categoryId || undefined,
      daily_price: parseFloat(dailyPrice),
      security_deposit: parseFloat(securityDeposit || "0"),
      location_text: locationText || "Downtown",
      location_lat: 40.7128,
      location_lng: -74.0060,
      available_from: availableFrom || undefined,
      available_until: availableUntil || undefined,
      images: imageUrl ? [{ url: imageUrl }] : null,
    };

    createMutation.mutate(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="List an Item for Rent">
      <form onSubmit={handleSubmit} className="space-y-5 max-h-[80vh] overflow-y-auto pr-1">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Item Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Professional DSLR Camera Kit"
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600 transition-colors"
          />
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Tag className="w-3.5 h-3.5 mr-1 text-gray-500" /> Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600 bg-white transition-colors"
            >
              <option value="">Select Category</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <DollarSign className="w-3.5 h-3.5 mr-1 text-gray-500" /> Daily Rate ($/day) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              min="0"
              value={dailyPrice}
              onChange={(e) => setDailyPrice(e.target.value)}
              placeholder="e.g. 25.00"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600 transition-colors"
            />
          </div>
        </div>

        {/* Security Deposit & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <ShieldAlert className="w-3.5 h-3.5 mr-1 text-gray-500" /> Security Deposit ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={securityDeposit}
              onChange={(e) => setSecurityDeposit(e.target.value)}
              placeholder="e.g. 100.00"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-gray-500" /> Location / City
            </label>
            <input
              type="text"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              placeholder="e.g. Downtown, Seattle"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600 transition-colors"
            />
          </div>
        </div>

        {/* Dates Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
            <input
              type="date"
              value={availableFrom}
              onChange={(e) => setAvailableFrom(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available Until</label>
            <input
              type="date"
              min={availableFrom}
              value={availableUntil}
              onChange={(e) => setAvailableUntil(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600 transition-colors"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your item, usage guidelines, and features..."
            className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-green-600 resize-none transition-colors"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Item Photo</label>
          {imageUrl ? (
            <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200 group">
              <img src={imageUrl} alt="Uploaded preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setImageUrl(null)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-600 hover:bg-green-50/30 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-xs text-gray-500 font-medium">
                  {isUploading ? "Uploading..." : "Click to upload an image"}
                </p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
            </label>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white h-12 rounded-xl text-base font-semibold shadow-lg shadow-green-600/20 mt-4"
          isLoading={createMutation.isPending || isUploading}
        >
          Publish Item Listing
        </Button>
      </form>
    </Modal>
  );
};
