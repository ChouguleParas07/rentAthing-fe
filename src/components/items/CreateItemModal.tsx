import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { itemsApi, type CreateItemPayload } from "@/api/items.api";
import { categoriesApi } from "@/api/categories.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, X, MapPin, DollarSign, ShieldAlert, Tag, Check, Calendar, ArrowRight, ArrowLeft, Lightbulb, Image as ImageIcon, CheckCircle2, Edit, Package, MessageCircle, Search } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { id: 1, title: "Basic Info", desc: "Title, category, description" },
  { id: 2, title: "Pricing", desc: "Rental rate & deposit" },
  { id: 3, title: "Location & Availability", desc: "Where and when" },
  { id: 4, title: "Photos", desc: "Add attractive photos" },
  { id: 5, title: "Review & Publish", desc: "Check and list" },
];

export const CreateItemModal: React.FC<CreateItemModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [dailyPrice, setDailyPrice] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [weeklyDiscount, setWeeklyDiscount] = useState("10");
  const [monthlyDiscount, setMonthlyDiscount] = useState("20");
  const [isWeeklyDiscount, setIsWeeklyDiscount] = useState(true);
  const [isMonthlyDiscount, setIsMonthlyDiscount] = useState(true);
  const [city, setCity] = useState("Pune");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableUntil, setAvailableUntil] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.list,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateItemPayload) => itemsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      setIsSuccess(true);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || "Failed to list item");
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (images.length >= 8) {
      toast.error("You can upload a maximum of 8 photos.");
      return;
    }

    setIsUploading(true);
    try {
      const res = await itemsApi.uploadImage(file);
      setImages((prev) => [...prev, res.url]);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (step === 1 && (!title || !categoryId)) {
      toast.error("Please fill in the required fields (Title, Category)");
      return;
    }
    if (step === 2 && !dailyPrice) {
      toast.error("Please set a daily rental rate");
      return;
    }
    if (step === 3 && (!city || !availableFrom)) {
      toast.error("Please provide location and start date");
      return;
    }
    if (step === 4 && images.length === 0) {
      toast.error("Please upload at least one photo");
      return;
    }
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    const payload: CreateItemPayload = {
      title,
      description: description || undefined,
      category_id: categoryId || undefined,
      daily_price: parseFloat(dailyPrice),
      security_deposit: parseFloat(securityDeposit || "0"),
      location_text: `${area ? area + ", " : ""}${city}`,
      location_lat: 18.5204, // Default Pune
      location_lng: 73.8567,
      available_from: availableFrom || undefined,
      available_until: availableUntil || undefined,
      images: images.length > 0 ? images.map(url => ({ url })) : null,
    };

    createMutation.mutate(payload);
  };

  const resetAndClose = () => {
    setTitle("");
    setDescription("");
    setCategoryId("");
    setDailyPrice("");
    setSecurityDeposit("");
    setImages([]);
    setStep(1);
    setIsSuccess(false);
    onClose();
  };

  const renderSidebar = () => (
    <div className="w-[260px] shrink-0 border-r border-gray-100 p-6 bg-gray-50/50 hidden md:block">
      <div className="space-y-6">
        {STEPS.map((s, idx) => (
          <div key={s.id} className="flex items-start gap-3 relative">
            {idx < STEPS.length - 1 && (
              <div className={cn("absolute top-8 left-3.5 w-px h-10 -ml-px", step > s.id ? "bg-green-500" : "bg-gray-200")} />
            )}
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors z-10",
                step > s.id ? "bg-green-500 text-white" : step === s.id ? "bg-[#00A843] text-white" : "bg-gray-200 text-gray-500"
              )}
            >
              {step > s.id ? <Check className="w-3.5 h-3.5" /> : s.id}
            </div>
            <div>
              <div className={cn("text-sm font-extrabold", step === s.id ? "text-green-800" : "text-gray-700")}>{s.title}</div>
              <div className="text-[11px] text-gray-500 font-medium">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} className="max-w-[1000px] w-[95vw] p-0 overflow-hidden rounded-[2rem] bg-white">
      {/* Hide default modal header by not passing title prop to Modal, we have our own layout */}
      <div className="flex flex-col h-[85vh] md:h-[650px] relative">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              List an Item <span className="text-[#00A843]">for Rent</span>
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-0.5">Share your item details and start earning from what you own</p>
          </div>
          <button onClick={resetAndClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors absolute top-6 right-6 z-20">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content Area */}
        {isSuccess ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-green-500/20">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Your item is now live!</h2>
            <p className="text-gray-500 text-center max-w-md mb-8">Congrats! Your item has been published and is visible to renters in your area. Start receiving booking requests!</p>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 max-w-sm w-full mb-10 relative">
              <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                {images[0] ? <img src={images[0]} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 m-auto mt-6 text-gray-300" />}
              </div>
              <div className="flex-1">
                <h4 className="font-extrabold text-sm text-gray-900 line-clamp-1">{title}</h4>
                <div className="font-extrabold text-[#00A843] text-sm mt-0.5">₹{dailyPrice}<span className="text-xs font-semibold text-gray-500">/day</span></div>
                <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium mt-1">
                  <MapPin className="w-3 h-3" /> {city}
                </div>
              </div>
              <div className="absolute top-4 right-4 px-2 py-1 bg-green-100 text-green-700 text-[9px] font-extrabold tracking-wider rounded-md border border-green-200">LIVE</div>
            </div>

            <div className="w-full max-w-2xl text-center">
              <p className="text-sm font-bold text-gray-900 mb-4">What's next?</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 bg-white border border-gray-100 rounded-2xl hover:border-green-200 cursor-pointer transition-colors shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-3 mx-auto"><Package className="w-5 h-5" /></div>
                  <div className="font-bold text-sm text-gray-900 mb-1">Manage Bookings</div>
                  <div className="text-[11px] text-gray-500">Check and respond to booking requests</div>
                </div>
                <div className="p-4 bg-white border border-gray-100 rounded-2xl hover:border-green-200 cursor-pointer transition-colors shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center mb-3 mx-auto"><MessageCircle className="w-5 h-5" /></div>
                  <div className="font-bold text-sm text-gray-900 mb-1">Chat with Renters</div>
                  <div className="text-[11px] text-gray-500">Answer questions from potential renters</div>
                </div>
                <div className="p-4 bg-white border border-gray-100 rounded-2xl hover:border-green-200 cursor-pointer transition-colors shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-3 mx-auto"><Edit className="w-5 h-5" /></div>
                  <div className="font-bold text-sm text-gray-900 mb-1">Edit Listing</div>
                  <div className="text-[11px] text-gray-500">Update details, photos or pricing anytime</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-8 w-full max-w-lg">
              <Button variant="outline" onClick={resetAndClose} className="flex-1 rounded-xl h-11 border-gray-200 text-gray-700 font-bold">Go to Dashboard</Button>
              <Button onClick={resetAndClose} className="flex-1 rounded-xl h-11 bg-[#00A843] hover:bg-[#009038] font-bold text-white shadow-md shadow-green-600/20">View Listing <ArrowRight className="w-4 h-4 ml-1.5" /></Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {renderSidebar()}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-white">
              {/* Main Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">

                {step === 1 && (
                  <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-3 mb-6 bg-white">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      </div>
                      <div>
                        <h3 className="font-extrabold text-gray-900 text-base leading-tight">Basic Information</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Tell renters about your item</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-xs font-bold text-gray-900">Item Title <span className="text-red-500">*</span></label>
                          <span className="text-[10px] font-medium text-gray-400">{title.length}/100</span>
                        </div>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                          placeholder="Professional DSLR Camera Kit"
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-shadow bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-900 mb-1.5">Category <span className="text-red-500">*</span></label>
                          <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 bg-white"
                          >
                            <option value="">Select...</option>
                            {categories?.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-900 mb-1.5">Subcategory</label>
                          <select
                            value={subcategory}
                            onChange={(e) => setSubcategory(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 bg-white"
                          >
                            <option value="">Select...</option>
                            <option value="dslr">DSLR Camera</option>
                            <option value="mirrorless">Mirrorless</option>
                            <option value="lenses">Lenses</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-900 mb-1.5">Brand <span className="font-normal text-gray-400">(Optional)</span></label>
                          <input type="text" value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. Canon, Nikon, Sony" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 bg-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-900 mb-1.5">Model <span className="font-normal text-gray-400">(Optional)</span></label>
                          <input type="text" value={model} onChange={e => setModel(e.target.value)} placeholder="e.g. EOS 90D, Z6, A7 III" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 bg-white" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1.5">Description <span className="text-red-500">*</span></label>
                        <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600 bg-white shadow-sm">
                          {/* Fake Toolbar */}
                          <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex gap-1">
                            {['B', 'I', 'U', 'List', 'NumList'].map((action, i) => (
                              <button key={i} type="button" className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-200 text-gray-600 text-xs font-serif font-bold transition-colors">
                                {action === 'List' ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg> :
                                  action === 'NumList' ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 6h11M9 12h11M9 18h11M5 6v.01M5 12v.01M5 18v.01"></path></svg> : action}
                              </button>
                            ))}
                          </div>
                          <textarea
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                            className="w-full p-4 text-sm outline-none resize-none"
                            placeholder="High quality DSLR camera kit in excellent condition. Perfect for events, travel, and professional photography. Includes camera body, 18-55mm lens, battery, charger, and carrying bag."
                          />
                          <div className="text-right px-3 pb-2 text-[10px] font-medium text-gray-400">{description.length}/500</div>
                        </div>
                      </div>

                      <div className="bg-orange-50/40 rounded-2xl p-4 flex gap-3 border border-orange-100">
                        <Lightbulb className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-[11px] font-bold text-orange-800 mb-1.5">Tips for a great description:</div>
                          <ul className="text-[10px] text-orange-700 space-y-1.5 list-disc list-inside ml-1">
                            <li>Mention what's included in the package</li>
                            <li>Highlight condition and usage guidelines</li>
                            <li>Share any important restrictions</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-gray-900 text-base leading-tight">Pricing Details</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Set a fair price and security deposit for your item</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row gap-5 items-start">
                        <div className="flex-1 w-full">
                          <label className="block text-xs font-bold text-gray-900 mb-1.5">Daily Rental Rate (₹) <span className="text-red-500">*</span></label>
                          <input type="number" value={dailyPrice} onChange={e => setDailyPrice(e.target.value)} placeholder="400" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 bg-white" />
                        </div>
                        <div className="flex-1 w-full bg-green-50/50 border border-green-100 rounded-2xl p-4 flex items-start gap-3 mt-1 sm:mt-6">
                          <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0"><DollarSign className="w-4 h-4" /></div>
                          <div>
                            <div className="text-[11px] font-bold text-green-800">Suggested price range</div>
                            <div className="text-sm font-extrabold text-green-700 mt-0.5">₹300 - ₹500 / day</div>
                            <div className="text-[10px] text-green-600/80 mt-1">Based on similar items in your area</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-5 items-start">
                        <div className="flex-1 w-full">
                          <label className="block text-xs font-bold text-gray-900 mb-1.5">Security Deposit (₹) <span className="text-red-500">*</span></label>
                          <input type="number" value={securityDeposit} onChange={e => setSecurityDeposit(e.target.value)} placeholder="2000" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 bg-white" />
                        </div>
                        <div className="flex-1 w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-start gap-3 mt-1 sm:mt-6">
                          <ShieldAlert className="w-6 h-6 text-gray-400 shrink-0 mt-0.5" />
                          <div className="text-[11px] text-gray-500 leading-relaxed font-medium">
                            The security deposit will be held as a safety measure and returned after the item is successfully returned.
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm mt-8">
                        <label className="block text-xs font-bold text-gray-900 mb-5">Discounts <span className="font-normal text-gray-400">(Optional)</span></label>

                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                              <input type="checkbox" checked={isWeeklyDiscount} onChange={() => setIsWeeklyDiscount(!isWeeklyDiscount)} className="sr-only peer" />
                              <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00A843]"></div>
                            </label>
                            <span className="text-xs font-bold text-gray-700 w-28">Weekly Discount</span>
                            <div className="flex items-center gap-2">
                              <input type="number" disabled={!isWeeklyDiscount} value={weeklyDiscount} onChange={e => setWeeklyDiscount(e.target.value)} className="w-20 rounded-xl border border-gray-200 px-3 py-2 text-sm text-center outline-none focus:border-green-600 disabled:bg-gray-50 disabled:text-gray-400 transition-colors" />
                              <span className="text-xs text-gray-500 font-medium">% off</span>
                            </div>
                            <div className="ml-auto hidden sm:block">
                              <div className="text-[10px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md">Popular: 10-20%</div>
                            </div>
                          </div>

                          <div className="h-px w-full bg-gray-100" />

                          <div className="flex flex-wrap items-center gap-4">
                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                              <input type="checkbox" checked={isMonthlyDiscount} onChange={() => setIsMonthlyDiscount(!isMonthlyDiscount)} className="sr-only peer" />
                              <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00A843]"></div>
                            </label>
                            <span className="text-xs font-bold text-gray-700 w-28">Monthly Discount</span>
                            <div className="flex items-center gap-2">
                              <input type="number" disabled={!isMonthlyDiscount} value={monthlyDiscount} onChange={e => setMonthlyDiscount(e.target.value)} className="w-20 rounded-xl border border-gray-200 px-3 py-2 text-sm text-center outline-none focus:border-green-600 disabled:bg-gray-50 disabled:text-gray-400 transition-colors" />
                              <span className="text-xs text-gray-500 font-medium">% off</span>
                            </div>
                            <div className="ml-auto flex flex-col items-end hidden sm:flex">
                              <div className="text-[10px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md mb-1">Popular: 20-40%</div>
                              <div className="text-[9px] text-gray-500 font-medium">Encourages longer rentals</div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-gray-900 text-base leading-tight">Location</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Help renters find your item</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-900 mb-1.5">City <span className="text-red-500">*</span></label>
                          <select value={city} onChange={e => setCity(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 bg-white">
                            <option>Pune</option>
                            <option>Mumbai</option>
                            <option>Bangalore</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-900 mb-1.5">Area / Locality <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" value={area} onChange={e => setArea(e.target.value)} placeholder="e.g. Kothrud" className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 bg-white" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1.5">Address <span className="font-normal text-gray-400">(Optional)</span></label>
                        <div className="relative border border-gray-200 rounded-xl focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600 bg-white overflow-hidden shadow-sm">
                          <textarea rows={2} value={address} onChange={e => setAddress(e.target.value.slice(0, 200))} className="w-full p-4 text-sm outline-none resize-none" placeholder="Near Kothrud Bus Stand, Pune" />
                          <div className="absolute bottom-2 right-3 text-[10px] font-medium text-gray-400">{address.length}/200</div>
                        </div>
                      </div>

                      <div>
                        <div className="relative w-full h-48 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 mb-1.5">
                          {/* Fake map image */}
                          <img src="https://placehold.co/800x400/e2e8f0/64748b?text=Map+View" className="w-full h-full object-cover opacity-70" alt="map" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                                <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center">
                                  <div className="w-3.5 h-3.5 bg-[#00A843] rounded-full shadow-sm ring-2 ring-white" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm text-[10px] font-bold text-gray-700 flex flex-col items-center gap-0.5 border border-gray-200"><MapPin className="w-4 h-4 text-gray-500" /> Drop a pin on map</div>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium">This location will be visible to renters.</p>
                      </div>

                      <div className="h-px w-full bg-gray-100 my-8" />

                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-gray-900 text-base leading-tight">Availability</h3>
                          <p className="text-xs text-gray-500 mt-0.5">Set when your item is available for rent</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-900 mb-1.5">Available From <span className="text-red-500">*</span></label>
                          <input type="date" value={availableFrom} onChange={e => setAvailableFrom(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 bg-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-900 mb-1.5">Available Until <span className="text-red-500">*</span></label>
                          <input type="date" min={availableFrom} value={availableUntil} onChange={e => setAvailableUntil(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 bg-white" />
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-gray-900 text-base leading-tight">Item Photos</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Add clear, high-quality photos to get more bookings</p>
                      </div>
                    </div>

                    <div className="space-y-6">

                      <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-[2rem] cursor-pointer hover:border-[#00A843] hover:bg-green-50/30 transition-all bg-white shadow-sm">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3 text-gray-500">
                            <Upload className="w-5 h-5" />
                          </div>
                          <p className="text-sm font-extrabold text-gray-900 mb-1">
                            {isUploading ? "Uploading..." : "Drag & drop photos here"}
                          </p>
                          <p className="text-xs text-gray-400 font-medium">or click to upload</p>
                          <p className="text-[10px] text-gray-400 font-medium mt-3">JPG, PNG (Max 5MB each)</p>
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                      </label>

                      {images.length > 0 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide">
                          {images.map((url, idx) => (
                            <div key={idx} className={cn("w-24 h-24 rounded-2xl relative shrink-0 group border-2 transition-colors", idx === 0 ? "border-[#00A843] p-0.5" : "border-gray-200")}>
                              <img src={url} className="w-full h-full object-cover rounded-[14px]" alt={`Upload ${idx}`} />
                              <button onClick={() => handleRemoveImage(idx)} className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-1 shadow-md hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 z-10">
                                <X className="w-3 h-3" />
                              </button>
                              {idx === 0 && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#00A843] text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-white whitespace-nowrap shadow-sm">Main</div>}
                            </div>
                          ))}
                          {images.length < 8 && (
                            <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center cursor-pointer hover:border-[#00A843] hover:bg-green-50 transition-colors shrink-0 group">
                              <span className="text-gray-400 group-hover:text-[#00A843] text-xl font-light mb-1">+</span>
                              <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#00A843] text-center leading-tight">Add More<br />(Up to 8)</span>
                              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                            </label>
                          )}
                        </div>
                      )}

                      <div className="bg-green-50/80 rounded-3xl p-6 border border-green-100 mt-8">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center"><CheckCircle2 className="w-3.5 h-3.5" /></div>
                          <h4 className="text-sm font-extrabold text-green-900">Photo Guidelines</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-green-800">
                          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Use clear, well-lit photos</div>
                          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Include all accessories</div>
                          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Show multiple angles</div>
                          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Avoid blurry or dark images</div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-gray-900 text-base leading-tight">Listing Preview</h3>
                        <p className="text-xs text-gray-500 mt-0.5">This is how your item will appear to renters</p>
                      </div>
                      <button onClick={() => setStep(1)} className="ml-auto text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-2 rounded-xl shadow-sm transition-colors">
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row p-6 gap-6">
                      {/* Preview Image */}
                      <div className="w-full md:w-[240px] shrink-0">
                        <div className="w-full aspect-[4/3] rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden mb-3 relative group">
                          {images[0] ? (
                            <img src={images[0]} alt="Main" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-10 h-10 text-gray-300 m-auto mt-16" />
                          )}
                          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-400 shadow-sm border border-gray-100">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                          </div>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                          {images.slice(1, 4).map((img, i) => (
                            <img key={i} src={img} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-200" alt="" />
                          ))}
                        </div>
                      </div>

                      {/* Preview Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-1 mb-2">
                          <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md uppercase">
                            {categories?.find(c => c.id === categoryId)?.name || "Category"}
                          </span>
                          {subcategory && <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md uppercase">{subcategory}</span>}
                        </div>
                        <h2 className="text-lg font-extrabold text-gray-900 line-clamp-2 mb-2 leading-tight">{title || "Professional DSLR Camera Kit"}</h2>
                        <div className="font-extrabold text-[#00A843] text-xl mb-4">
                          ₹{dailyPrice || "400"}<span className="text-xs font-semibold text-gray-500">/day</span>
                        </div>

                        <div className="space-y-2 mb-6">
                          {(brand || model) && <div className="text-xs text-gray-600 flex items-start gap-2"><Tag className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" /> <span className="font-medium"><span className="text-gray-400">Brand:</span> {brand || "N/A"} <span className="text-gray-400 ml-2">Model:</span> {model || "N/A"}</span></div>}
                          <div className="text-xs text-gray-600 flex items-start gap-2"><ShieldAlert className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" /> <span className="font-medium"><span className="text-gray-400">Security Deposit:</span> ₹{securityDeposit || "2000"}</span></div>
                          <div className="text-xs text-gray-600 flex items-start gap-2"><MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" /> <span className="font-medium"><span className="text-gray-400">Location:</span> {area ? area + ", " : ""}{city}</span></div>
                          <div className="text-xs text-gray-600 flex items-start gap-2"><Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" /> <span className="font-medium"><span className="text-gray-400">Available:</span> {availableFrom || "20 Sep 2026"} - {availableUntil || "31 Dec 2026"}</span></div>
                          {isWeeklyDiscount && <div className="text-xs text-gray-600 flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" /> <span className="font-medium"><span className="text-gray-400">Weekly Discount:</span> {weeklyDiscount}%</span></div>}
                          {isMonthlyDiscount && <div className="text-xs text-gray-600 flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" /> <span className="font-medium"><span className="text-gray-400">Monthly Discount:</span> {monthlyDiscount}%</span></div>}
                        </div>

                        <div>
                          <div className="text-xs font-bold text-gray-900 mb-1.5">Description</div>
                          <p className="text-[11px] text-gray-500 leading-relaxed">
                            {description || "High quality DSLR camera kit in excellent condition. Perfect for events, travel, and professional photography. Includes camera body, 18-55mm lens, battery, charger, and carrying bag."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Sticky Footer */}
              <div className="bg-white border-t border-gray-100 p-4 px-6 flex justify-between items-center shrink-0">
                <Button variant="ghost" onClick={step === 1 ? resetAndClose : handleBack} className="text-gray-600 font-bold rounded-xl px-5 hover:bg-gray-100 h-11 border border-transparent hover:border-gray-200 transition-all">
                  {step === 1 ? "Cancel" : <><ArrowLeft className="w-4 h-4 mr-1.5" /> Back</>}
                </Button>

                {step === 5 ? (
                  <Button
                    onClick={handleSubmit}
                    isLoading={createMutation.isPending}
                    className="bg-[#00A843] hover:bg-[#009038] text-white px-8 rounded-xl h-11 font-bold shadow-lg shadow-green-600/20"
                  >
                    <Upload className="w-4 h-4 mr-1.5" /> Publish Listing
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="bg-[#00A843] hover:bg-[#009038] text-white px-8 rounded-xl h-11 font-bold shadow-lg shadow-green-600/20">
                    {step === 4 && images.length === 0 ? "Skip for now" : "Next"} <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
