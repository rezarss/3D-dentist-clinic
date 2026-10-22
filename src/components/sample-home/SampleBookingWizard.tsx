"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FormattedService } from "./SampleServices";
import { 
  CalendarCheck, 
  Clock, 
  ArrowLeft, 
  Check, 
  User, 
  Phone, 
  FileText, 
  ShieldCheck,
  Calendar,
  Sparkles
} from "lucide-react";

type SampleBookingWizardProps = {
  services?: FormattedService[];
  preselectedServiceId?: string;
};

const TIME_SLOTS = [
  { id: "slot-1", label: "۰۹:۰۰ الی ۱۰:۳۰ (نوبت صبح)", raw: "09:00" },
  { id: "slot-2", label: "۱۰:۳۰ الی ۱۲:۰۰ (نوبت صبح)", raw: "10:30" },
  { id: "slot-3", label: "۱۲:۰۰ الی ۱۳:۳۰ (نوبت ظهر)", raw: "12:00" },
  { id: "slot-4", label: "۱۶:۰۰ الی ۱۷:۳۰ (نوبت عصر)", raw: "16:00" },
  { id: "slot-5", label: "۱۷:۳۰ الی ۱۹:۰۰ (نوبت عصر)", raw: "17:30" },
  { id: "slot-6", label: "۱۹:۰۰ الی ۲۰:۳۰ (نوبت شب)", raw: "19:00" },
];

const QUICK_DATES = [
  { id: "today", label: "امروز", offsetDays: 0 },
  { id: "tomorrow", label: "فردا", offsetDays: 1 },
  { id: "dayAfter", label: "پس‌فردا", offsetDays: 2 },
  { id: "threeDays", label: "۳ روز بعد", offsetDays: 3 },
];

export function SampleBookingWizard({ services = [], preselectedServiceId }: SampleBookingWizardProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [servicesList, setServicesList] = useState<FormattedService[]>(services);
  const [loadingServices, setLoadingServices] = useState<boolean>(services.length === 0);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedServiceId || (services[0]?._id ?? "")
  );

  // Client-side fetch effect to ensure services are ALWAYS loaded from MongoDB
  useEffect(() => {
    if (services && services.length > 0) {
      setServicesList(services);
      setSelectedServiceId((prev) => prev || services[0]._id);
      setLoadingServices(false);
      return;
    }

    setLoadingServices(true);
    fetch("/api/v1/services", { cache: "no-store" })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const formatted: FormattedService[] = res.data.map((s: any) => ({
            _id: String(s._id),
            slug: s.slug,
            title: {
              fa: s.title?.fa || (typeof s.title === "string" ? s.title : s.slug),
              en: s.title?.en || "",
            },
            excerpt: {
              fa: s.excerpt?.fa || "",
              en: s.excerpt?.en || "",
            },
            category: s.category || "cosmetic",
            duration: s.duration || "۱ جلسه",
            warranty: s.warranty || "گارانتی اصالت",
          }));
          setServicesList(formatted);
          setSelectedServiceId((prev) => prev || formatted[0]._id);
        }
      })
      .catch((err) => {
        console.error("Error fetching services for booking wizard:", err);
      })
      .finally(() => {
        setLoadingServices(false);
      });
  }, [services]);

  // Default date
  const todayISO = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(todayISO);
  const [selectedDateLabel, setSelectedDateLabel] = useState<string>("امروز");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[3]); // default 16:00
  
  // Patient info for Step 3
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [privacyAgreed, setPrivacyAgreed] = useState<boolean>(true);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [bookingSuccess, setBookingSuccess] = useState<{
    appointmentId: string;
    serviceTitle: string;
    startsAt: string;
    message: string;
  } | null>(null);

  const selectedService = servicesList.find((s) => s._id === selectedServiceId) || servicesList[0];

  const handleSelectQuickDate = (quick: typeof QUICK_DATES[0]) => {
    const d = new Date();
    d.setDate(d.getDate() + quick.offsetDays);
    setSelectedDate(d.toISOString().split("T")[0]);
    setSelectedDateLabel(quick.label);
  };

  const validateStepThree = () => {
    if (!selectedServiceId) {
      setError("لطفاً در مرحله اول یک خدمت را انتخاب فرمایید.");
      setCurrentStep(1);
      return false;
    }
    if (!name.trim() || name.trim().length < 3) {
      setError("لطفاً نام و نام خانوادگی را کامل وارد کنید (حداقل ۳ حرف).");
      return false;
    }
    const cleanPhone = phone.replace(/[\s\-()]/g, "");
    if (!/^09\d{9}$/.test(cleanPhone) && !/^\+989\d{9}$/.test(cleanPhone)) {
      setError("لطفاً یک شماره همراه معتبر (مانند ۰۹۱۲۱۲۳۴۵۶۷) وارد کنید.");
      return false;
    }
    if (!privacyAgreed) {
      setError("لطفاً موافقت با ثبت اطلاعات در سامانه پزشکی را تأیید فرمایید.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmitBooking = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateStepThree()) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/v1/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedServiceId,
          name: name.trim(),
          phone: phone.trim(),
          date: selectedDate,
          time: selectedTimeSlot.raw,
          note: note.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "ثبت نوبت در دیتابیس ناموفق بود.");
      }

      setBookingSuccess(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سامانه نوبت‌دهی.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setBookingSuccess(null);
    setCurrentStep(1);
    setName("");
    setPhone("");
    setNote("");
    setError("");
  };

  const getServiceTitle = (srv: FormattedService) => {
    if (!srv) return "خدمت دندانپزشکی";
    if (typeof srv.title === "string") return srv.title;
    return srv.title?.fa || srv.title?.en || srv.slug || "خدمت دندانپزشکی";
  };

  return (
    <section id="appointment" className="py-24 relative overflow-hidden bg-[#F7F4EE]">
      {/* Ambient Seamless Lighting Orbs */}
      <div 
        className="absolute top-1/3 left-10 w-96 h-96 rounded-full blur-[140px] opacity-25 pointer-events-none"
        style={{ background: "#404c34" }}
      />
      <div 
        className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-[140px] opacity-20 pointer-events-none"
        style={{ background: "#d1cfbc" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className="text-xs font-semibold tracking-wider text-[#817C70] flex items-center justify-center gap-2">
            <span>سیستم پذیرش دیجیتال</span>
            <span className="text-[#C2BFA9]">·</span>
            <span className="text-[#404c34]">نوبت‌دهی آنی</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#302A21] tracking-tight text-balance">
            رزرو اختصاصی و هوشمند نوبت کلینیک
          </h2>

          <p className="text-base text-[#817C70] leading-relaxed text-pretty">
            در ۳ گام ساده درمان مدنظر خود را از خدمات ثبت‌شده کلینیک برگزینید، زمان ایده‌آل را مشخص کنید و نوبت خود را در دیتابیس ثبت فرمایید.
          </p>
        </div>

        {/* Wizard Main Seamless Surface */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#FCFAF6] p-7 sm:p-10 shadow-[0_20px_50px_rgba(48,42,33,0.04)] border border-[#E8E2D5]/50">
          
          {/* Step Indicator Header (Clean Unboxed Numbers) */}
          <div className="grid grid-cols-3 gap-4 pb-8 border-b border-[#E8E2D5]/40 text-center">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 transition-colors cursor-pointer group"
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep >= 1 ? "bg-[#404c34] text-white" : "bg-[#F7F4EE] text-[#817C70]"
              }`}>
                ۱
              </span>
              <span className={`text-xs sm:text-sm font-semibold ${
                currentStep === 1 ? "text-[#302A21]" : "text-[#817C70]"
              }`}>
                انتخاب نوع خدمت
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (selectedServiceId) setCurrentStep(2);
                else setError("لطفاً ابتدا یک خدمت را انتخاب کنید.");
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 transition-colors cursor-pointer group"
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep >= 2 ? "bg-[#404c34] text-white" : "bg-[#F7F4EE] text-[#817C70]"
              }`}>
                ۲
              </span>
              <span className={`text-xs sm:text-sm font-semibold ${
                currentStep === 2 ? "text-[#302A21]" : "text-[#817C70]"
              }`}>
                زمان نوبت
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (selectedServiceId) setCurrentStep(3);
                else setError("لطفاً ابتدا خدمت را مشخص فرمایید.");
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 transition-colors cursor-pointer group"
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep >= 3 ? "bg-[#404c34] text-white" : "bg-[#F7F4EE] text-[#817C70]"
              }`}>
                ۳
              </span>
              <span className={`text-xs sm:text-sm font-semibold ${
                currentStep === 3 ? "text-[#302A21]" : "text-[#817C70]"
              }`}>
                مشخصات و ثبت نهایی
              </span>
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm text-right">
              {error}
            </div>
          )}

          {/* Success View */}
          {bookingSuccess ? (
            <div className="py-10 text-right space-y-6 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-[#404c34]/20 text-[#625D45] flex items-center justify-center">
                <Check className="w-8 h-8 text-[#625D45]" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-[#302A21]">
                  درخواست نوبت شما با موفقیت در دیتابیس ثبت شد
                </h3>
                <p className="text-sm text-[#817C70] mt-2 leading-relaxed">
                  {bookingSuccess.message}
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-6 rounded-2xl bg-[#F7F4EE] space-y-3">
                <div className="text-xs font-semibold text-[#817C70]">اطلاعات رزرو ثبت شده:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#302A21]">
                  <div>خدمت: <strong className="text-[#625D45]">{bookingSuccess.serviceTitle}</strong></div>
                  <div>کد پیگیری نوبت: <strong className="text-[#625D45]">{String(bookingSuccess.appointmentId).slice(-6).toUpperCase()}</strong></div>
                  <div>تاریخ و ساعت: <strong>{selectedDateLabel} — {selectedTimeSlot.label}</strong></div>
                  <div>وضعیت: <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">در انتظار بررسی پذیرش</span></div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white bg-[#404c34] hover:bg-[#343F2B] transition-colors cursor-pointer shadow-xs"
                >
                  <span>ثبت نوبت جدید</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Wizard Content Steps */
            <div className="py-8">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: SERVICE SELECTION (from DB services) */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="text-right">
                      <h3 className="text-lg font-bold text-[#302A21]">
                        مرحله اول: خدمت مدنظر خود را مشخص فرمایید
                      </h3>
                      <p className="text-xs text-[#817C70] mt-1">
                        خدمات مستقیماً از دیتابیس کلینیک بارگذاری شده‌اند؛ انتخاب تک‌گزینه‌ای انجام داده و پزشک معالج توسط مدیریت کلینیک تخصیص خواهد یافت.
                      </p>
                    </div>

                    {loadingServices ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div key={i} className="p-5 rounded-2xl bg-[#F7F4EE] animate-pulse h-28" />
                        ))}
                      </div>
                    ) : servicesList.length === 0 ? (
                      <div className="text-center py-8 p-6 rounded-2xl bg-[#F7F4EE] space-y-3">
                        <p className="text-xs sm:text-sm text-[#756F62]">در حال بارگذاری خدمات از دیتابیس...</p>
                        <button
                          type="button"
                          onClick={() => {
                            setLoadingServices(true);
                            fetch("/api/v1/services", { cache: "no-store" })
                              .then((r) => r.json())
                              .then((res) => {
                                if (res.success && Array.isArray(res.data)) {
                                  setServicesList(res.data.map((s: any) => ({
                                    _id: String(s._id),
                                    slug: s.slug,
                                    title: { fa: s.title?.fa || s.slug, en: s.title?.en || "" },
                                    duration: s.duration || "۱ جلسه",
                                    warranty: s.warranty || "گارانتی اصالت",
                                  })));
                                }
                              })
                              .finally(() => setLoadingServices(false));
                          }}
                          className="text-xs font-bold text-[#404c34] hover:underline cursor-pointer"
                        >
                          تلاش مجدد برای دریافت از دیتابیس
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {servicesList.map((srv) => {
                          const isSelected = selectedServiceId === srv._id;
                          const title = getServiceTitle(srv);
                          return (
                            <div
                              key={srv._id}
                              onClick={() => {
                                setSelectedServiceId(srv._id);
                                setError("");
                              }}
                              className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 text-right flex flex-col justify-between ${
                                isSelected
                                  ? "bg-[#404c34]/15 shadow-sm border border-[#404c34]/30"
                                  : "bg-[#F7F4EE]/70 hover:bg-[#F7F4EE] border border-transparent"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-[#817C70]">{srv.warranty || "گارانتی اصالت"}</span>
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                    isSelected ? "bg-[#404c34] text-white" : "bg-[#E8E2D5]/60 text-transparent"
                                  }`}
                                >
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-[#302A21]">{title}</h4>
                                <p className="text-xs text-[#817C70] mt-1 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-[#404c34]" />
                                  <span>{srv.duration || "۱ جلسه"}</span>
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          if (!selectedServiceId) {
                            setError("لطفاً یک خدمت را انتخاب فرمایید.");
                            return;
                          }
                          setError("");
                          setCurrentStep(2);
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white bg-[#404c34] hover:bg-[#343F2B] transition-colors cursor-pointer shadow-xs"
                      >
                        <span>ادامه: انتخاب زمان نوبت</span>
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: TIME & DATE SELECTION */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="text-right">
                      <h3 className="text-lg font-bold text-[#302A21]">
                        مرحله دوم: تاریخ و بازه زمانی پیشنهادی
                      </h3>
                      <p className="text-xs text-[#817C70] mt-1">
                        زمان مورد نظر خود برای مراجعه یا دریافت تماس هماهنگی پذیرش را تعیین کنید.
                      </p>
                    </div>

                    {/* Quick Date Buttons */}
                    <div className="space-y-2 text-right">
                      <label className="text-xs font-bold text-[#625D45] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#404c34]" />
                        <span>انتخاب روز مراجعه:</span>
                      </label>
                      <div className="flex flex-wrap items-center gap-2.5">
                        {QUICK_DATES.map((q) => {
                          const isActive = selectedDateLabel === q.label;
                          return (
                            <button
                              key={q.id}
                              type="button"
                              onClick={() => handleSelectQuickDate(q)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isActive
                                  ? "bg-[#404c34] text-white shadow-xs"
                                  : "bg-[#F7F4EE] text-[#756F62] hover:bg-[#ece8df]"
                              }`}
                            >
                              {q.label}
                            </button>
                          );
                        })}

                        {/* Custom Date Input */}
                        <div className="relative">
                          <input
                            type="date"
                            min={todayISO}
                            value={selectedDate}
                            onChange={(e) => {
                              setSelectedDate(e.target.value);
                              setSelectedDateLabel(e.target.value);
                            }}
                            className="text-xs bg-[#F7F4EE] text-[#302A21] px-3 py-1.5 rounded-xl border border-[#E8E2D5] focus:outline-none focus:border-[#404c34]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Time Slots Grid */}
                    <div className="space-y-2 text-right">
                      <label className="text-xs font-bold text-[#625D45] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#404c34]" />
                        <span>بازه زمانی مطلوب:</span>
                      </label>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {TIME_SLOTS.map((ts) => {
                          const isSelected = selectedTimeSlot.id === ts.id;
                          return (
                            <div
                              key={ts.id}
                              onClick={() => setSelectedTimeSlot(ts)}
                              className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 text-right flex items-center justify-between gap-3 ${
                                isSelected
                                  ? "bg-[#404c34]/15 shadow-sm border border-[#404c34]/30"
                                  : "bg-[#F7F4EE]/70 hover:bg-[#F7F4EE] border border-transparent"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Clock className="w-4 h-4 text-[#404c34] shrink-0" />
                                <span className="text-xs font-semibold text-[#302A21]">{ts.label}</span>
                              </div>
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                  isSelected ? "bg-[#404c34] text-white" : "bg-[#E8E2D5]/60 text-transparent"
                                }`}
                              >
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Back / Forward Actions */}
                    <div className="flex items-center justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="px-5 py-2.5 rounded-full text-xs font-medium text-[#817C70] hover:text-[#302A21] transition-colors cursor-pointer"
                      >
                        مرحله قبل
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white bg-[#404c34] hover:bg-[#343F2B] transition-colors cursor-pointer shadow-xs"
                      >
                        <span>ادامه: مشخصات و ثبت نهایی</span>
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: PATIENT CONTACT & FINAL SUBMISSION */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="text-right">
                      <h3 className="text-lg font-bold text-[#302A21]">
                        مرحله سوم: مشخصات مراجعه‌کننده و ثبت نهایی
                      </h3>
                      <p className="text-xs text-[#817C70] mt-1">
                        اطلاعات تماس خود را وارد نمایید؛ پذیرش کلینیک جهت هماهنگی ساعت دقیق با شما تماس خواهد گرفت.
                      </p>
                    </div>

                    {/* Input Form Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#302A21] flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#404c34]" />
                          <span>نام و نام خانوادگی بیمار:</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            setError("");
                          }}
                          placeholder="مثال: سارا معتمدی"
                          className="w-full text-xs p-3.5 rounded-xl border border-[#E8E2D5] bg-white focus:outline-none focus:border-[#404c34] transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#302A21] flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#404c34]" />
                          <span>شماره تماس (موبایل):</span>
                        </label>
                        <input
                          type="tel"
                          required
                          dir="ltr"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            setError("");
                          }}
                          placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                          className="w-full text-xs p-3.5 rounded-xl border border-[#E8E2D5] bg-white text-right focus:outline-none focus:border-[#404c34] transition"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-[#302A21] flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#404c34]" />
                          <span>توضیحات تکمیلی یا علت مراجعه (اختیاری):</span>
                        </label>
                        <input
                          type="text"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="توضیح مختصر درباره وضعیت دندان، حساسیت دارویی یا شرایط خاص..."
                          className="w-full text-xs p-3.5 rounded-xl border border-[#E8E2D5] bg-white focus:outline-none focus:border-[#404c34] transition"
                        />
                      </div>
                    </div>

                    {/* Summary Card */}
                    <div className="p-6 rounded-2xl bg-[#F7F4EE] space-y-2 text-right">
                      <div className="text-xs font-semibold text-[#817C70]">خلاصه پیش‌فاکتور زمان‌بندی:</div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-[#302A21]">
                        <span>خدمت: <strong className="text-[#625D45]">{getServiceTitle(selectedService)}</strong></span>
                        <span className="text-[#C2BFA9]">·</span>
                        <span>پزشک معالج: <strong className="text-[#625D45]">تعیین و تخصیص توسط مدیریت کلینیک</strong></span>
                        <span className="text-[#C2BFA9]">·</span>
                        <span>زمان: <strong className="text-[#625D45]">{selectedDateLabel} — {selectedTimeSlot.label}</strong></span>
                      </div>
                    </div>

                    {/* Privacy Checkbox */}
                    <label className="flex items-center gap-2.5 text-xs text-[#756F62] cursor-pointer text-right">
                      <input
                        type="checkbox"
                        checked={privacyAgreed}
                        onChange={(e) => setPrivacyAgreed(e.target.checked)}
                        className="w-4 h-4 rounded text-[#404c34] focus:ring-[#404c34]"
                      />
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#404c34]" />
                        <span>اطلاعات تماس من تنها برای هماهنگی و تشکیل پرونده پزشکی در کلینیک ثبت می‌شود.</span>
                      </span>
                    </label>

                    {/* Back / Submit Actions */}
                    <div className="flex items-center justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="px-5 py-2.5 rounded-full text-xs font-medium text-[#817C70] hover:text-[#302A21] transition-colors cursor-pointer"
                      >
                        مرحله قبل
                      </button>
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => handleSubmitBooking()}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-[#404c34] hover:bg-[#343F2B] disabled:opacity-50 transition-colors cursor-pointer shadow-[0_6px_20px_rgba(64,76,52,0.3)]"
                      >
                        <CalendarCheck className="w-4 h-4" />
                        <span>{submitting ? "در حال ثبت نوبت..." : "تایید و ثبت نهایی نوبت در سیستم"}</span>
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
