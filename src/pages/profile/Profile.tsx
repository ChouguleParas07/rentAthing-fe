import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  User, List, Calendar as CalendarIcon, MessageCircle, Star, Bookmark, CreditCard, Settings,
  ExternalLink, Edit3, Camera, MapPin, Mail, Phone, CheckCircle2,
  ChevronDown, Check, Info, Sparkles, Pencil, ArrowRight,
  Shield, Image as ImageIcon, Briefcase, Camera as CameraIcon
} from "lucide-react";
import { AvatarCropModal } from "@/components/profile/AvatarCropModal";
import { authApi } from "@/api/auth";
import { setUser } from "@/store/authSlice";

export const Profile = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Personal Info");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9]">
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

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F8FAF9] py-8 px-4 sm:px-6 lg:px-8 pb-20 font-sans text-gray-900">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ================= LEFT SIDEBAR ================= */}
          <div className="w-full lg:w-[260px] shrink-0 space-y-6">
            <nav className="space-y-1">
              <a href="#" className="flex items-center justify-between px-4 py-3 bg-green-50 text-green-700 rounded-2xl font-bold transition-colors">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5" />
                  My Profile
                </div>
              </a>
              <a href="#" className="flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-900 rounded-2xl font-semibold transition-colors">
                <div className="flex items-center gap-3">
                  <List className="w-5 h-5 text-gray-400" />
                  My Listings
                </div>
                <span className="bg-green-100 text-green-700 py-0.5 px-2 rounded-full text-xs font-bold">3</span>
              </a>
              <a href="#" className="flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-900 rounded-2xl font-semibold transition-colors">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  My Bookings
                </div>
                <span className="bg-green-100 text-green-700 py-0.5 px-2 rounded-full text-xs font-bold">5</span>
              </a>
              <a href="#" className="flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-900 rounded-2xl font-semibold transition-colors">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-gray-400" />
                  Messages
                </div>
                <span className="bg-green-100 text-green-700 py-0.5 px-2 rounded-full text-xs font-bold">2</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-900 rounded-2xl font-semibold transition-colors">
                <Star className="w-5 h-5 text-gray-400" />
                Reviews
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-900 rounded-2xl font-semibold transition-colors">
                <Bookmark className="w-5 h-5 text-gray-400" />
                Saved Items
              </a>
              <div className="h-px bg-gray-200 my-2 mx-4" />
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-900 rounded-2xl font-semibold transition-colors">
                <CreditCard className="w-5 h-5 text-gray-400" />
                Payment Methods
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-900 rounded-2xl font-semibold transition-colors">
                <Settings className="w-5 h-5 text-gray-400" />
                Settings
              </a>
            </nav>

            <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-3xl relative overflow-hidden border border-green-100">
              <div className="relative z-10">
                <h3 className="text-xl font-extrabold text-green-900 leading-tight mb-2">Turn your unused items into income</h3>
                <p className="text-sm text-green-700 font-medium mb-32">List your items and start earning today!</p>
                <button className="w-full bg-[#00A843] hover:bg-[#009038] text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 transition-all">
                  Create a Listing <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Illustration graphics (Camera, Box, Leaves) */}
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

          {/* ================= CENTER CONTENT ================= */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-[28px] font-extrabold text-gray-900 flex items-center gap-2">
                  My Profile <Sparkles className="w-6 h-6 text-yellow-400" fill="currentColor" />
                </h1>
                <p className="text-sm text-gray-500 font-medium">Manage your personal information, listings, bookings, and account settings.</p>
              </div>
              <div className="flex items-center gap-3">
                <Link to={`/profile/${user.id}`} className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
                  <ExternalLink className="w-4 h-4" /> Public Profile
                </Link>
                <button className="px-6 py-2.5 rounded-full bg-[#00A843] hover:bg-[#009038] text-white text-sm font-bold shadow-md shadow-[#00A843]/20 transition-all flex items-center gap-2">
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
              </div>
            </div>

            {/* Profile Banner */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden p-3 pb-6">
              <div className="relative h-56 rounded-[1.5rem] overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop" alt="Cover" className="w-full h-full object-cover" />

                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute top-6 right-8 text-right rotate-[-4deg]">
                  <p className="font-[Caveat,cursive] text-4xl text-white drop-shadow-md">"Rent.</p>
                  <p className="font-[Caveat,cursive] text-4xl text-white drop-shadow-md ml-4">Reuse.</p>
                  <p className="font-[Caveat,cursive] text-4xl text-white drop-shadow-md ml-8">Earn.</p>
                  <p className="font-[Caveat,cursive] text-4xl text-white drop-shadow-md ml-12">Live Sustainably."</p>
                </div>

                <button className="absolute bottom-4 right-4 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all border border-white/20">
                  <CameraIcon className="w-4 h-4" /> Change Cover
                </button>
              </div>

              <div className="px-6 flex flex-col md:flex-row gap-6 relative">

                <div className="relative -mt-16 shrink-0 z-10 w-32 h-32">
                  <div className="w-full h-full rounded-full bg-white p-1.5 shadow-xl">
                    <div className="w-full h-full rounded-full bg-gray-100 overflow-hidden relative">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-green-600 to-emerald-400 text-white font-bold text-4xl">
                          {avatarLetter}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 w-4 h-4 bg-[#00A843] border-2 border-white rounded-full shadow-sm z-20" />
                  <button onClick={handleAvatarClick} className="absolute bottom-2 right-0 w-8 h-8 bg-white text-gray-700 rounded-full shadow-lg border border-gray-100 hover:text-green-600 hover:bg-green-50 flex items-center justify-center transition-colors z-20">
                    <Camera className="w-4 h-4" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                </div>

                <div className="pt-4 flex-1 min-w-0">
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <h2 className="text-2xl font-extrabold text-gray-900 truncate">{name}</h2>
                        <CheckCircle2 className="w-5 h-5 text-[#00A843]" fill="#dcfce7" />
                        <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {user.role}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-gray-600 bg-gray-100 border border-gray-200">
                          Verified Member
                        </span>
                        <div className="ml-2 flex items-center gap-2 bg-gray-100 rounded-full px-1 py-1 pr-3">
                          <div className="w-6 h-4 bg-[#00A843] rounded-full flex items-center p-0.5"><div className="w-3 h-3 bg-white rounded-full ml-auto shadow-sm"></div></div>
                          <span className="text-[10px] font-bold text-gray-600">Available to Rent</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mb-4">
                        <span>@{user.email.split("@")[0]}</span>
                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {user.email}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {user.phone || "8999834789"}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {user.city || "Pune, Maharashtra"}</span>
                      </div>
                    </div>

                    <div className="flex gap-4 shrink-0">
                      <div className="text-center">
                        <div className="text-lg font-extrabold text-gray-900">12</div>
                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Listings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-extrabold text-gray-900">28</div>
                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Bookings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-extrabold text-gray-900 flex items-center justify-center gap-1"><Star className="w-4 h-4 text-yellow-400" fill="currentColor" /> 4.8</div>
                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-extrabold text-gray-900">2</div>
                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Years</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm font-medium text-gray-600 flex items-center gap-1.5 pt-4 border-t border-gray-100">
                    Tech enthusiast | Love capturing moments | Renting to build a sustainable community <span className="text-green-600">🌱</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats 4 Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                  <Star className="w-6 h-6" fill="currentColor" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 flex items-center gap-1">Trust Score <Info className="w-3 h-3" /></div>
                  <div className="text-lg font-extrabold text-green-700">100 / 100</div>
                  <div className="text-[11px] text-gray-500 font-medium">Great reputation!</div>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500">Primary Location</div>
                  <div className="text-lg font-extrabold text-gray-900">Pune</div>
                  <div className="text-[11px] text-gray-500 font-medium">India</div>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500">Account Status</div>
                  <div className="text-lg font-extrabold text-gray-900">Verified</div>
                  <div className="text-[11px] text-gray-500 font-medium">High trust member</div>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500">Member Since</div>
                  <div className="text-lg font-extrabold text-gray-900">Sep 2024</div>
                  <div className="text-[11px] text-gray-500 font-medium">2 years on Stashly</div>
                </div>
              </div>
            </div>

            {/* Tabs & Form Layout */}
            <div className="flex gap-2 border-b border-gray-200 pb-4">
              {['Personal Info', 'Preferences', 'Payment Methods', 'Social Links'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${activeTab === tab
                    ? "bg-[#00A843] text-white shadow-md shadow-green-600/20"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  {tab === 'Personal Info' && <User className="w-4 h-4" />}
                  {tab === 'Preferences' && <Settings className="w-4 h-4" />}
                  {tab === 'Payment Methods' && <CreditCard className="w-4 h-4" />}
                  {tab === 'Social Links' && <ExternalLink className="w-4 h-4" />}
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900">Personal Information</h3>
                    <p className="text-xs text-gray-500 font-medium">Basic details about your account</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" readOnly value={name} className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" readOnly value={user.email} className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" readOnly value={user.phone || "8999834789"} className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" readOnly value={user.city || "Pune, Maharashtra"} className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 outline-none" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Bio</label>
                  <textarea readOnly rows={3} className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 outline-none resize-none" value="Tech enthusiast | Love capturing moments | Renting to build a sustainable community 🌱"></textarea>
                  <div className="text-right text-[10px] text-gray-400 font-bold mt-1">74/200</div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900">Profile Photo</h3>
                    <p className="text-xs text-gray-500 font-medium">Update your profile picture</p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center bg-gray-50/50 hover:bg-green-50/30 hover:border-green-300 transition-colors cursor-pointer flex flex-col items-center justify-center mb-6">
                    <CameraIcon className="w-8 h-8 text-gray-400 mb-3" />
                    <div className="text-sm font-bold text-gray-700 mb-1">Drag & drop an image<br />or click to upload</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">JPG, PNG (Max 5MB)</div>
                  </div>

                  <div className="flex gap-2">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-green-500 relative">
                      <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" className="w-full h-full object-cover" alt="" />
                      <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border border-white rounded-full flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" />
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100">
                      <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=100&q=80" className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100">
                      <img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=100&q=80" className="w-full h-full object-cover" alt="" />
                    </div>
                    <button className="w-14 h-14 rounded-2xl border border-gray-200 flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 bg-white">
                      <span className="text-lg font-light leading-none">+</span>
                      <span className="text-[9px] font-bold">Add More</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDEBAR ================= */}
          <div className="w-full xl:w-[280px] shrink-0 space-y-6 hidden xl:block">

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-extrabold text-gray-900">About Me</h3>
                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] font-medium text-gray-500 mb-3">Share a little about yourself</p>
              <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                Passionate about technology, photography, and sustainable living. I love exploring new places, capturing moments, and renting out items to help build a more sustainable and sharing community.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-extrabold text-gray-900">Quick Stats</h3>
                <button className="text-[10px] font-bold text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200 flex items-center gap-1">
                  This Month <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 flex justify-between items-center">
                    <div>
                      <div className="text-[11px] font-semibold text-gray-500">Items Rented Out</div>
                      <div className="text-base font-extrabold text-gray-900">5</div>
                    </div>
                    <span className="text-[10px] font-bold text-green-600">+2 this month</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <span className="font-bold">₹</span>
                  </div>
                  <div className="flex-1 min-w-0 flex justify-between items-center">
                    <div>
                      <div className="text-[11px] font-semibold text-gray-500">Total Earnings</div>
                      <div className="text-base font-extrabold text-gray-900">₹3,200</div>
                    </div>
                    <span className="text-[10px] font-bold text-green-600">+18%</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 flex justify-between items-center">
                    <div>
                      <div className="text-[11px] font-semibold text-gray-500">Active Bookings</div>
                      <div className="text-base font-extrabold text-gray-900">3</div>
                    </div>
                    <span className="text-[10px] font-bold text-green-600">2 upcoming</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4" fill="currentColor" />
                  </div>
                  <div className="flex-1 min-w-0 flex justify-between items-center">
                    <div>
                      <div className="text-[11px] font-semibold text-gray-500">Average Rating</div>
                      <div className="text-base font-extrabold text-gray-900">4.8</div>
                    </div>
                    <span className="text-[10px] font-bold text-green-600">+0.2</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-extrabold text-gray-900 mb-5">Verified Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00A843] flex items-center justify-center shrink-0 shadow-sm shadow-green-600/30">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Email Verified</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00A843] flex items-center justify-center shrink-0 shadow-sm shadow-green-600/30">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Phone Verified</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00A843] flex items-center justify-center shrink-0 shadow-sm shadow-green-600/30">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Identity Verified</span>
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

export default Profile;
