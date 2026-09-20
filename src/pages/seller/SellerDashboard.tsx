import React, { useState } from "react";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useProfile } from "@/hooks/auth/useProfile";
import { useItems } from "@/hooks/items/useItems";
import { itemsApi, type CreateItemPayload } from "@/api/items.api";
import { useCategories } from "@/hooks/categories/useCategories";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

const SellerDashboard: React.FC = () => {
  const { data: user } = useProfile();
  const { data: itemsData, isLoading } = useItems({ owner_id: user?.id, limit: 100 });
  const { data: categories } = useCategories();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dailyPrice, setDailyPrice] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [locationText, setLocationText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDailyPrice("");
    setSecurityDeposit("");
    setCategoryId("");
    setLocationText("");
    setImageUrl("");
    setEditingItemId(null);
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItemId(item.id);
      setTitle(item.title);
      setDescription(item.description || "");
      setDailyPrice(item.daily_price.toString());
      setSecurityDeposit(item.security_deposit.toString());
      setCategoryId(item.category_id || "");
      setLocationText(item.location_text || "");
      setImageUrl(item.images?.[0]?.url || "");
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    try {
      setUploadingImage(true);
      const res = await itemsApi.uploadImage(e.target.files[0]);
      setImageUrl(res.url);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }

    setIsSubmitting(true);
    const payload: Partial<CreateItemPayload> = {
      title,
      description,
      daily_price: Number(dailyPrice),
      security_deposit: Number(securityDeposit),
      category_id: categoryId,
      location_text: locationText,
      location_lat: 0, // Mock location for now
      location_lng: 0,
      images: imageUrl ? [{ url: imageUrl }] : null,
    };

    try {
      if (editingItemId) {
        await itemsApi.update(editingItemId, payload);
        toast.success("Item updated successfully!");
      } else {
        await itemsApi.create(payload as CreateItemPayload);
        toast.success("Item created successfully!");
      }
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["items"] });
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to save item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await itemsApi.delete(id);
      toast.success("Item deleted.");
      queryClient.invalidateQueries({ queryKey: ["items"] });
    } catch (err) {
      toast.error("Failed to delete item.");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Seller Dashboard</h1>
        <Button onClick={() => handleOpenModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus size={18} className="mr-2" /> Add New Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Listings</h3>
          <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{itemsData?.total || 0}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading your items...</div>
        ) : itemsData?.items && itemsData.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                  <th className="p-4 font-medium text-gray-600 dark:text-gray-400 text-sm">Item</th>
                  <th className="p-4 font-medium text-gray-600 dark:text-gray-400 text-sm">Category</th>
                  <th className="p-4 font-medium text-gray-600 dark:text-gray-400 text-sm">Price/Day</th>
                  <th className="p-4 font-medium text-gray-600 dark:text-gray-400 text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {itemsData.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {item.images?.[0]?.url ? (
                            <img src={item.images[0].url} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-400 m-auto mt-3" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.location_text}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{item.category?.name || 'N/A'}</td>
                    <td className="p-4 text-gray-900 dark:text-white font-medium">${item.daily_price}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="text-gray-400 w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">No items listed yet</h2>
            <p className="text-gray-500 mb-6">List your first item and start earning today.</p>
            <Button onClick={() => handleOpenModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Add Your First Item
            </Button>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItemId ? "Edit Item" : "Create New Item"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 h-24" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daily Price ($)</label>
              <input required type="number" min="0" step="0.01" value={dailyPrice} onChange={(e) => setDailyPrice(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit ($)</label>
              <input required type="number" min="0" step="0.01" value={securityDeposit} onChange={(e) => setSecurityDeposit(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 bg-white">
                <option value="">Select Category</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" value={locationText} onChange={(e) => setLocationText(e.target.value)} placeholder="e.g. New York, NY" className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            {imageUrl && (
              <div className="mb-2 w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            {uploadingImage && <p className="text-xs text-indigo-600 mt-1">Uploading...</p>}
          </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-4">
            {editingItemId ? "Save Changes" : "Create Item"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default SellerDashboard;
