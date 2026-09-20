import React, { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/authSlice";
import { authApi } from "@/api/auth";
import { Modal } from "@/components/ui/Modal";
import { AvatarCropModal } from "@/components/profile/AvatarCropModal";
import {
  Mail,
  MapPin,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Edit3,
  ExternalLink,
  Sparkles,
  Camera,
  UserCheck,
  Building2,
  Lock,
} from "lucide-react";

export const Profile = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    city: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const name = user.full_name || user.email.split("@")[0];
  const avatarLetter = (name[0] || "U").toUpperCase();

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

  const handleOpenEdit = () => {
    setFormData({
      full_name: user.full_name || "",
      phone: user.phone || "",
      city: user.city || "",
    });
    setSaveSuccess(false);
    setIsEditOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updatedUser = await authApi.updateProfile({
        full_name: formData.full_name.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        city: formData.city.trim() || undefined,
      });

      dispatch(setUser(updatedUser));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setSaveSuccess(true);
      setTimeout(() => {
        setIsEditOpen(false);
        setSaveSuccess(false);
      }, 800);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50/60 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Top Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              My Profile <Sparkles className="w-6 h-6 text-green-600 animate-pulse" />
            </h1>
            <p className="mt-1 text-sm text-gray-500">Manage your personal account settings, contact details, and platform credentials.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/profile/${user.id}`}
              className="px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all flex items-center gap-2 shadow-xs"
            >
              <ExternalLink className="w-4 h-4 text-gray-500" /> Public Profile
            </Link>
            <button
              onClick={handleOpenEdit}
              className="px-5 py-2.5 rounded-2xl bg-green-600 hover:bg-green-700 text-white text-xs font-semibold shadow-md shadow-green-600/20 transition-all flex items-center gap-2 active:scale-98"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Banner & Main Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Aesthetic Gradient Banner */}
          <div className="h-44 bg-gradient-to-r from-green-700 via-emerald-600 to-teal-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_40%)]" />
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1.5 border border-white/20">
              <ShieldCheck className="w-4 h-4 text-emerald-300" /> Stashly Verified Account
            </div>
          </div>

          {/* Profile Details Header */}
          <div className="px-8 pb-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 mb-6">

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />

              {/* Avatar Circle */}
              <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-green-600 to-emerald-400 text-white font-bold text-4xl flex items-center justify-center shadow-xl border-4 border-white transition-transform group-hover:scale-102 overflow-hidden">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    avatarLetter
                  )}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAvatarClick();
                  }}
                  title="Upload & Adjust Profile Photo"
                  className="absolute bottom-1 right-1 p-2 bg-white text-gray-700 rounded-full shadow-md border border-gray-200 hover:bg-green-50 hover:text-green-600 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-xs" />
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-green-100 text-green-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> {user.role}
                </span>
                {user.is_verified ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Member
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                    Pending Verification
                  </span>
                )}
              </div>
            </div>

            {/* User Title Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">{name}</h2>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <span>{user.email}</span>
                {user.city && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" /> {user.city}
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100/60 mb-8">
              <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Trust Rating</p>
                  <p className="text-base font-bold text-emerald-700">100 / 100</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Primary Location</p>
                  <p className="text-base font-bold text-gray-900 truncate">{user.city || "Not set"}</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Security</p>
                  <p className="text-base font-bold text-gray-900">Protected</p>
                </div>
              </div>
            </div>

            {/* Detailed Contact Cards */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white text-gray-600 shadow-xs flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 font-medium">Email Address</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white text-gray-600 shadow-xs flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 font-medium">Phone Number</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.phone || "Not provided"}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white text-gray-600 shadow-xs flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 font-medium">City Location</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.city || "Not provided"}</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Interactive Edit Profile Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            <Edit3 className="w-5 h-5 text-green-600" /> Edit Profile Details
          </div>
        }
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          {saveSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" /> Profile updated successfully!
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="e.g. Rajesh Kumar"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-green-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. +91 9876543210"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-green-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              City / Location
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="e.g. Bengaluru"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-green-600 transition-colors"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-semibold shadow-md shadow-green-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Avatar Crop & Photo Adjuster Modal */}
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

export default Profile;

