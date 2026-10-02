import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useQueryClient } from "@tanstack/react-query";
import {
  User, List, Calendar as CalendarIcon, MessageCircle, Heart, Settings,
  ArrowRight, Sparkles, ChevronRight, Home, Upload, Image as ImageIcon,
  Camera, X, Plus, Save
} from "lucide-react";
import { AvatarCropModal } from "@/components/profile/AvatarCropModal";
import { authApi } from "@/api/auth";
import { setUser } from "@/store/authSlice";
import { useItems } from "@/hooks/items/useItems";
import { useBookings } from "@/hooks/bookings/useBookings";
import { ROUTES } from "@/routes/routes";

export const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [coverImageSrc, setCoverImageSrc] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    city: "",
    bio: "Passionate about technology, photography, and sustainable living. I love exploring new places, capturing moments, and renting out items to help build a more sustainable and sharing community.",
  });

  const [tags, setTags] = useState(["Technology", "Photography", "Sustainable Living", "Travel", "Community"]);
  const [newTag, setNewTag] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        phone: user.phone || "",
        city: user.city || "",
        bio: "Passionate about technology, photography, and sustainable living. I love exploring new places, capturing moments, and renting out items to help build a more sustainable and sharing community.",
      });
    }
  }, [user]);

  const { data: userItems } = useItems(user ? { owner_id: user.id } : undefined);
  const { data: renterBookings } = useBookings(user ? { renter_id: user.id } : undefined);
  const { data: ownerBookings } = useBookings(user ? { owner_id: user.id } : undefined);

  const activeListingsCount = userItems?.total || 0;
  const totalBookingsCount = (renterBookings?.total || 0) + (ownerBookings?.total || 0);

  if (!user) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedImageSrc(reader.result);
        setIsCropOpen(true);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCoverClick = () => {
    coverInputRef.current?.click();
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCoverImageSrc(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSaveCroppedAvatar = async (croppedDataUrl: string) => {
    try {
      const updatedUser = await authApi.updateProfile({
        avatar_url: croppedDataUrl,
      });

      dispatch(setUser(updatedUser));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsCropOpen(false);
      setSelectedImageSrc(null);
    } catch (error) {
      console.error("Failed to update profile photo:", error);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      setIsAddingTag(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedUser = await authApi.updateProfile({
        full_name: formData.full_name,
        phone: formData.phone,
        city: formData.city,
      });
      dispatch(setUser(updatedUser));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      navigate(ROUTES.PROFILE);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  const avatarLetter = (formData.full_name[0] || user.email[0] || "U").toUpperCase();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F8FAF9] py-8 px-4 sm:px-6 lg:px-8 pb-20 font-sans text-gray-900">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ================= LEFT SIDEBAR ================= */}
          <div className="w-full lg:w-[260px] shrink-0 space-y-6">
            <nav className="space-y-1">
              <Link to={ROUTES.PROFILE} className="flex items-center justify-between px-4 py-3 bg-green-50 text-green-700 rounded-2xl font-bold transition-colors">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5" />
                  My Profile
                </div>
              </Link>
              <Link to={ROUTES.DASHBOARD} className="flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-900 rounded-2xl font-semibold transition-colors">
                <div className="flex items-center gap-3">
                  <List className="w-5 h-5 text-gray-400" />
                  My Listings
                </div>
                {activeListingsCount > 0 && <span className="bg-green-100 text-green-700 py-0.5 px-2 rounded-full text-xs font-bold">{activeListingsCount}</span>}
              </Link>
              <Link to={ROUTES.DASHBOARD} className="flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-900 rounded-2xl font-semibold transition-colors">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  My Bookings
                </div>
                {totalBookingsCount > 0 && <span className="bg-green-100 text-green-700 py-0.5 px-2 rounded-full text-xs font-bold">{totalBookingsCount}</span>}
              </Link>
              <Link to={ROUTES.MESSAGES} className="flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-900 rounded-2xl font-semibold transition-colors">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-gray-400" />
                  Messages
                </div>
              </Link>
              <Link to={ROUTES.DASHBOARD} className="flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-900 rounded-2xl font-semibold transition-colors">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-gray-400" />
                  Favourite Items
                </div>
              </Link>
              <Link to={ROUTES.DASHBOARD} className="flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-900 rounded-2xl font-semibold transition-colors">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-400" />
                  Settings
                </div>
              </Link>
            </nav>

            <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-3xl relative overflow-hidden border border-green-100">
              <div className="relative z-10">
                <h3 className="text-xl font-extrabold text-green-900 leading-tight mb-2">Turn your unused items into income</h3>
                <p className="text-sm text-green-700 font-medium mb-32">List your items and start earning today!</p>
                <Link to={ROUTES.DASHBOARD} className="w-full bg-[#00A843] hover:bg-[#009038] text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 transition-all">
                  Create a Listing <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Illustration graphics */}
              <div className="absolute bottom-16 right-0 left-0 flex justify-center items-end opacity-90 pointer-events-none">
                <div className="relative w-32 h-24">
                  <div className="absolute bottom-0 right-4 w-16 h-16 bg-[#e4c59a] rounded-lg shadow-sm border border-[#d3b487] rotate-6"></div>
                  <div className="absolute bottom-2 left-2 w-20 h-16 bg-gray-800 rounded-xl shadow-lg border-2 border-gray-700 -rotate-3 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-4 border-gray-600 bg-gray-900 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-blue-900/50 blur-[2px]"></div>
                    </div>
                  </div>
                  <Sparkles className="absolute top-2 left-0 w-5 h-5 text-green-600" />
                  <Sparkles className="absolute top-8 right-0 w-6 h-6 text-green-500" />
                </div>
              </div>
            </div>
          </div>

          {/* ================= CENTER & RIGHT CONTENT ================= */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-4">
                <Link to={ROUTES.HOME} className="hover:text-gray-900 transition-colors flex items-center gap-1"><Home className="w-3.5 h-3.5" /></Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link to={ROUTES.PROFILE} className="hover:text-gray-900 transition-colors">My Profile</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-gray-900 font-bold">Edit Profile</span>
              </div>

              <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Edit Profile</h1>
              <p className="text-sm text-gray-500 font-medium">Update your personal information, profile picture, and account settings.</p>
            </div>

            <div className="flex flex-col xl:flex-row gap-6">
              {/* Main Form Area */}
              <div className="flex-1 space-y-6">

                {/* Personal Information */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-gray-900">Personal Information</h3>
                      <p className="text-xs text-gray-500 font-medium">Basic details about your account.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-700 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="email" value={user.email} disabled className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-500 outline-none opacity-80 cursor-not-allowed" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-700 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Location <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-700 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Me */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                      <List className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-gray-900">About Me</h3>
                      <p className="text-xs text-gray-500 font-medium">Tell others a little bit about yourself.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full p-4 bg-white rounded-2xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all resize-y"
                    />
                    <div className="text-right text-[10px] text-gray-400 font-medium mt-1">0/500</div>
                  </div>
                </div>

                {/* Interests & Tags */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                      <List className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-gray-900">Interests & Tags</h3>
                      <p className="text-xs text-gray-500 font-medium">Add tags to show your interests (optional).</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <div key={tag} className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 rounded-full text-xs font-bold text-gray-700 border border-gray-200">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="text-gray-400 hover:text-gray-700 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {isAddingTag ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                          placeholder="New tag..."
                          className="px-4 py-2 bg-white rounded-full text-xs font-semibold text-gray-700 border border-green-500 outline-none focus:ring-1 focus:ring-green-500 w-32"
                          autoFocus
                          onBlur={() => {
                            if (!newTag.trim()) setIsAddingTag(false);
                            else handleAddTag();
                          }}
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsAddingTag(true)}
                        className="flex items-center gap-1 px-4 py-2 bg-white hover:bg-gray-50 rounded-full text-xs font-bold text-gray-700 border border-gray-200 transition-colors"
                      >
                        New Tag <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Sidebar Area (Photos & Actions) */}
              <div className="w-full xl:w-[320px] shrink-0 space-y-6">

                {/* Profile Picture */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                  <div className="w-full flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-extrabold text-gray-900">Profile Picture</h3>
                      <p className="text-xs text-gray-500 font-medium">Upload a clear photo of yourself.</p>
                    </div>
                  </div>

                  <div className="relative w-36 h-36 mb-6">
                    <div className="w-full h-full rounded-full bg-white p-2 shadow-xl border border-gray-50">
                      <div className="w-full h-full rounded-full bg-gray-100 overflow-hidden relative">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-green-600 to-emerald-400 text-white font-bold text-5xl">
                            {avatarLetter}
                          </div>
                        )}
                      </div>
                    </div>
                    <button onClick={handleAvatarClick} className="absolute bottom-1 right-1 w-9 h-9 bg-white text-gray-700 rounded-full shadow-lg border border-gray-200 hover:text-green-600 hover:bg-green-50 flex items-center justify-center transition-colors z-20">
                      <Camera className="w-4 h-4" />
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                  </div>

                  <button onClick={handleAvatarClick} className="w-full py-2.5 rounded-full border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 mb-3 shadow-sm">
                    <Upload className="w-4 h-4" /> Change Photo
                  </button>
                  <p className="text-[10px] text-gray-400 font-medium">JPG, PNG or GIF. Max size 5MB.</p>
                </div>

                {/* Cover Photo */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                  <div className="w-full flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                      <ImageIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-extrabold text-gray-900">Cover Photo</h3>
                      <p className="text-xs text-gray-500 font-medium">Choose a cover image for your profile.</p>
                    </div>
                  </div>

                  <div className="relative w-full h-32 rounded-2xl overflow-hidden mb-6 border border-gray-100 shadow-sm group">
                    <img src={coverImageSrc || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"} alt="Cover" className="w-full h-full object-cover" />
                    <button onClick={handleCoverClick} className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm text-gray-700 rounded-xl shadow-md flex items-center justify-center hover:bg-white transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                    <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverSelect} />
                  </div>

                  <button onClick={handleCoverClick} className="w-full py-2.5 rounded-full border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 mb-3 shadow-sm">
                    <Upload className="w-4 h-4" /> Change Cover Photo
                  </button>
                  <p className="text-[10px] text-gray-400 font-medium">JPG, PNG or GIF. Recommended size: 1200 x 400px.</p>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-[#00A843] hover:bg-[#009038] text-white text-sm font-bold shadow-md shadow-[#00A843]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
                  </button>
                  <Link to={ROUTES.PROFILE} className="w-full py-3.5 rounded-xl border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 text-sm font-bold transition-all flex items-center justify-center shadow-sm">
                    Cancel
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedImageSrc && (
        <AvatarCropModal
          isOpen={isCropOpen}
          imageSrc={selectedImageSrc}
          onClose={() => {
            setIsCropOpen(false);
            setSelectedImageSrc(null);
          }}
          onSave={handleSaveCroppedAvatar}
        />
      )}
    </div>
  );
};

export default EditProfile;
