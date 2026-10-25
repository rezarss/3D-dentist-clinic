"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PersianDatePicker } from "@/components/admin/PersianDatePicker";
import { 
  CalendarCheck, 
  Clock, 
  ArrowLeft, 
  Check, 
  User,
  Phone,
  FileText,
  Loader2
} from "lucide-react";

export type FormattedService = {
  _id: string;
  slug: string;
  title: { fa?: string; en?: string } | string;
  duration?: string;
  warranty?: string;
  excerpt?: { fa?: string; en?: string };
  category?: string;
};

type HomeBookingWidgetProps = {
  services?: FormattedService[];
};

type AvailabilitySlot = {
  start: string;
  end: string;
  label: string;
  available: boolean;
};

function getClinicToday() {
  const todayParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const dateParts = Object.fromEntries(todayParts.map(part => [part.type, part.value]));
  const year = Number(dateParts.year);
  const month = Number(dateParts.month);
  const day = Number(dateParts.day);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function HomeBookingWidget({ services = [] }: HomeBookingWidgetProps) {

  const [servicesList, setServicesList] = useState<Array<{
    id: string;
    slug: string;
    title: string;
    duration: string;
    note: string;
  }>>(() => {
    if (services && services.length > 0) {
      return services.map(s => ({
        id: s._id,
        slug: s.slug,
        title: typeof s.title === "string" ? s.title : (s.title?.fa || s.title?.en || s.slug),
        duration: s.duration || "۱ جلسه",
        note: s.warranty || "پذیرش دیجیتال",
      }));
    }
    return [];
  });

  const [loadingServices, setLoadingServices] = useState<boolean>(services.length === 0);
  const [servicesError, setServicesError] = useState("");

  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(getClinicToday);
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form inputs for direct booking into database
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientNote, setPatientNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState<{
    appointmentId: string;
    serviceTitle: string;
    status: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (services && services.length > 0) {
      const mapped = services.map(s => ({
        id: s._id,
        slug: s.slug,
        title: typeof s.title === "string" ? s.title : (s.title?.fa || s.title?.en || s.slug),
        duration: s.duration || "۱ جلسه",
        note: s.warranty || "پذیرش دیجیتال",
      }));
      setServicesList(mapped);
      setLoadingServices(false);
      return;
    }

    setLoadingServices(true);
    setServicesError("");
    fetch("/api/v1/services", { cache: "no-store" })
      .then(async r => {
        const res = await r.json();
        if (!r.ok || !res.success) {
          throw new Error(res.error?.message || "دریافت خدمات از پایگاه داده ناموفق بود.");
        }
        return res;
      })
      .then(res => {
        const mapped = (res.data || []).map((s: { _id: string; slug: string; title: { fa?: string; en?: string } | string; duration?: string; warranty?: string }) => ({
          id: s._id,
          slug: s.slug,
          title: typeof s.title === "string" ? s.title : (s.title?.fa || s.title?.en || s.slug),
          duration: s.duration || "۱ جلسه",
          note: s.warranty || "پذیرش دیجیتال",
        }));
        setServicesList(mapped);
      })
      .catch(err => {
        console.error("Error fetching services for HomeBookingWidget:", err);
        setServicesError(err instanceof Error ? err.message : "خطا در دریافت خدمات از پایگاه داده.");
      })
      .finally(() => setLoadingServices(false));
  }, [services]);

  useEffect(() => {
    if (!selectedService || !selectedDate) {
      setAvailableSlots([]);
      setSelectedSlot(null);
      return;
    }

    let isCurrent = true;
    setLoadingAvailability(true);
    setAvailabilityError("");
    setAvailableSlots([]);
    setSelectedSlot(null);
    const query = new URLSearchParams({ date: selectedDate, serviceId: selectedService });

    fetch(`/api/v1/booking/availability?${query.toString()}`, { cache: "no-store" })
      .then(async response => {
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error?.message || "دریافت زمان‌های آزاد ناموفق بود.");
        }
        return result;
      })
      .then(result => {
        if (isCurrent) setAvailableSlots((result.data?.slots || []) as AvailabilitySlot[]);
      })
      .catch(error => {
        if (isCurrent) {
          setAvailabilityError(error instanceof Error ? error.message : "خطا در دریافت زمان‌های آزاد.");
        }
      })
      .finally(() => {
        if (isCurrent) setLoadingAvailability(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [selectedService, selectedDate]);

  const selectedServiceObj = servicesList.find(s => s.id === selectedService) || {
    id: "",
    slug: "",
    title: "خدمت دندانپزشکی",
    duration: "۱ جلسه",
    note: "پذیرش دیجیتال"
  };
  const selectedDateLabel = selectedDate
    ? new Intl.DateTimeFormat("fa-IR", {
        timeZone: "UTC",
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(new Date(`${selectedDate}T12:00:00Z`))
    : "";

  // Direct database appointment submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceObj.id) {
      setSubmitError("لطفاً ابتدا خدمت مورد نظر را انتخاب فرمایید.");
      return;
    }
    if (!selectedSlot) {
      setSubmitError("لطفاً زمان نوبت را انتخاب فرمایید.");
      return;
    }
    if (!patientName.trim() || patientName.trim().length < 3) {
      setSubmitError("لطفاً نام و نام خانوادگی را کامل وارد کنید (حداقل ۳ حرف).");
      return;
    }
    if (!patientPhone.trim() || !/^(\+98|0)?9\d{9}$/.test(patientPhone.trim().replace(/\s+/g, ""))) {
      setSubmitError("لطفاً یک شماره موبایل معتبر ۱۱ رقمی وارد نمایید (مانند ۰۹۱۲۳۴۵۶۷۸۹).");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/v1/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedServiceObj.id,
          name: patientName.trim(),
          phone: patientPhone.trim(),
          startsAt: selectedSlot.start,
          endsAt: selectedSlot.end,
          note: patientNote.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "خطا در ثبت نوبت در پایگاه داده.");
      }

      setBookingSuccess(data.data);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "خطای ارتباط با سرور کلینیک.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetBooking = () => {
    setBookingSuccess(null);
    setCurrentStep(1);
    setSelectedService("");
    setSelectedSlot(null);
    setPatientName("");
    setPatientPhone("");
    setPatientNote("");
    setSubmitError("");
  };

  return (
    <section id="appointment" className="py-24 relative overflow-hidden bg-white">
      {/* Invisible anchor target for #booking compatibility */}
      <span id="booking" className="sr-only" />

      {/* Ambient Seamless Lighting Orbs */}
      <div 
        className="absolute top-1/3 left-10 w-96 h-96 rounded-full blur-[140px] opacity-25 pointer-events-none"
        style={{ background: "#404c34" }}
      />
      <div 
        className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-[140px] opacity-20 pointer-events-none"
        style={{ background: "#D8AE98" }}
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
            ابتدا خدمت موردنظر و سپس یکی از زمان‌های آزاد را انتخاب کنید؛ پزشک پس از ثبت درخواست توسط مدیر پذیرش تعیین می‌شود.
          </p>
        </div>

        {/* Wizard Main Seamless Surface */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#FCFAF6] p-7 sm:p-10 shadow-[0_20px_50px_rgba(48,42,33,0.04)] border border-[#E8E2D5]/50">
          
          {/* Step Indicator Header */}
          <div className="grid grid-cols-2 gap-4 pb-8 border-b border-[#E8E2D5]/40 text-center">
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
                if (selectedService) setCurrentStep(2);
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
                انتخاب زمان و ثبت نوبت
              </span>
            </button>
          </div>

          {/* Success Screen after direct booking */}
          {bookingSuccess ? (
            <div className="py-10 text-right space-y-6 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-[#404c34]/20 text-[#625D45] flex items-center justify-center">
                <Check className="w-8 h-8 text-[#625D45]" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-[#302A21]">
                  درخواست نوبت شما با موفقیت در پایگاه‌داده ثبت شد
                </h3>
                <p className="text-sm text-[#817C70] mt-2 leading-relaxed">
                  {bookingSuccess.message || "اطلاعات رزرو شما در سیستم پذیرش ذخیره گردید و پیامک تایید ارسال خواهد شد."}
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-6 rounded-2xl bg-[#F7F4EE] space-y-3 border border-[#E8E2D5]/60">
                <div className="text-xs font-semibold text-[#817C70]">اطلاعات رزرو ثبت شده در دیتابیس:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#302A21]">
                  <div>خدمت انتخابی: <strong className="text-[#625D45]">{bookingSuccess.serviceTitle || selectedServiceObj.title}</strong></div>
                  <div>پزشک معالج: <strong className="text-[#625D45]">پس از ثبت، توسط مدیر پذیرش تعیین می‌شود</strong></div>
                  <div>کد پیگیری نوبت: <strong className="text-[#625D45]">{String(bookingSuccess.appointmentId).slice(-6).toUpperCase()}</strong></div>
                  <div>زمان نوبت: <strong>{selectedDateLabel}، {selectedSlot?.label}</strong></div>
                  <div>بیمار: <strong>{patientName} ({patientPhone})</strong></div>
                  <div>وضعیت: <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">در انتظار بررسی پذیرش</span></div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleResetBooking}
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
                {/* STEP 1: SERVICE SELECTION FROM DATABASE */}
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
                      <h3 className="text-lg font-bold text-[#302A21]">مرحله اول: خدمت مدنظر خود را مشخص فرمایید</h3>
                      <p className="text-xs text-[#817C70] mt-1">
                        تمامی خدمات به صورت زنده از پایگاه داده کلینیک فراخوانی می‌شوند؛ مشاوران بالینی قبل از حضور با شما هماهنگ خواهند شد.
                      </p>
                    </div>

                    {loadingServices ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                          <div key={i} className="p-5 rounded-2xl bg-[#F7F4EE] animate-pulse h-28" />
                        ))}
                      </div>
                    ) : servicesList.length === 0 ? (
                      <div className="text-center py-8 p-6 rounded-2xl bg-[#F7F4EE] space-y-3">
                        <p className="text-xs sm:text-sm text-[#756F62]">
                          {servicesError || "در حال حاضر خدمتی برای رزرو در پایگاه داده ثبت نشده است."}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setLoadingServices(true);
                            setServicesError("");
                            fetch("/api/v1/services", { cache: "no-store" })
                              .then(async response => {
                                const result = await response.json();
                                if (!response.ok || !result.success) {
                                  throw new Error(result.error?.message || "دریافت خدمات ناموفق بود.");
                                }
                                const mapped = (result.data || []).map((s: { _id: string; slug: string; title: { fa?: string; en?: string } | string; duration?: string; warranty?: string }) => ({
                                  id: s._id,
                                  slug: s.slug,
                                  title: typeof s.title === "string" ? s.title : (s.title?.fa || s.title?.en || s.slug),
                                  duration: s.duration || "۱ جلسه",
                                  note: s.warranty || "پذیرش دیجیتال",
                                }));
                                setServicesList(mapped);
                              })
                              .catch(error => {
                                setServicesError(error instanceof Error ? error.message : "خطا در دریافت خدمات.");
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
                        {servicesList.map(srv => {
                          const isSelected = selectedService === srv.id;
                          return (
                            <button
                              type="button"
                              key={srv.id}
                              onClick={() => {
                                setSelectedService(srv.id);
                                setSelectedSlot(null);
                                setSubmitError("");
                              }}
                              aria-pressed={isSelected}
                              className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 text-right flex flex-col justify-between ${
                                isSelected
                                  ? "bg-[#404c34]/15 shadow-sm border border-[#404c34]/30"
                                  : "bg-[#F7F4EE]/70 hover:bg-[#F7F4EE] border border-transparent"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-[#817C70]">{srv.note}</span>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                  isSelected ? "bg-[#404c34] text-white" : "bg-[#E8E2D5]/60 text-transparent"
                                }`}>
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-[#302A21]">{srv.title}</h4>
                                <p className="text-xs text-[#817C70] mt-1 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-[#404c34]" />
                                  <span>{srv.duration}</span>
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        disabled={!selectedService || loadingServices}
                        onClick={() => setCurrentStep(2)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white bg-[#404c34] hover:bg-[#343F2B] disabled:opacity-50 transition-colors cursor-pointer shadow-xs"
                      >
                        <span>ادامه: انتخاب زمان نوبت</span>
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: TIME SELECTION & BOOKING */}
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
                      <h3 className="text-lg font-bold text-[#302A21]">مرحله دوم: انتخاب زمان نوبت</h3>
                      <p className="text-xs text-[#817C70] mt-1">زمان‌های آزاد از برنامه کلینیک دریافت می‌شوند؛ پزشک پس از ثبت درخواست توسط مدیر پذیرش تعیین خواهد شد.</p>
                    </div>

                    <div className="w-full max-w-xs text-right">
                      <PersianDatePicker
                        mode="date"
                        id="booking-date"
                        label="روز مراجعه"
                        value={selectedDate}
                        onChange={date => setSelectedDate(date)}
                        minDate={getClinicToday()}
                        clearable={false}
                      />
                    </div>

                    {loadingAvailability ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map(index => (
                          <div key={index} className="p-3 rounded-2xl bg-[#F7F4EE] animate-pulse h-14" />
                        ))}
                      </div>
                    ) : availabilityError ? (
                      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-right">
                        {availabilityError}
                      </div>
                    ) : availableSlots.filter(slot => slot.available).length === 0 ? (
                      <div className="p-4 rounded-xl bg-[#F7F4EE] text-[#756F62] text-xs text-right">
                        برای این روز زمان آزادی وجود ندارد؛ لطفاً روز دیگری را انتخاب کنید.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                        {availableSlots.filter(slot => slot.available).map(slot => {
                          const isSelected = selectedSlot?.start === slot.start;
                          return (
                            <button
                              type="button"
                              key={slot.start}
                              onClick={() => {
                                setSelectedSlot(slot);
                                setSubmitError("");
                              }}
                              aria-pressed={isSelected}
                              className={`min-w-0 p-3 rounded-2xl cursor-pointer transition-all duration-200 text-right flex items-center justify-between gap-2 ${
                                isSelected
                                  ? "bg-[#404c34]/15 shadow-sm border border-[#404c34]/30"
                                  : "bg-[#F7F4EE]/70 hover:bg-[#F7F4EE] border border-transparent"
                              }`}
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-[#404c34] shrink-0" />
                                <span className="text-xs font-semibold text-[#302A21] whitespace-nowrap" dir="ltr">{slot.label}</span>
                              </div>
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                isSelected ? "bg-[#404c34] text-white" : "bg-[#E8E2D5]/60 text-transparent"
                              }`}>
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Summary of Selection */}
                    <div className="p-6 rounded-2xl bg-[#F7F4EE] space-y-2 text-right border border-[#E8E2D5]/60">
                      <div className="text-xs font-semibold text-[#817C70]">خلاصه پیش‌فاکتور زمان‌بندی:</div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-[#302A21]">
                        <span>خدمت: <strong className="text-[#625D45]">{selectedServiceObj.title}</strong></span>
                        <span className="text-[#C2BFA9]">·</span>
                        <span>تاریخ: <strong className="text-[#625D45]">{selectedDateLabel || "—"}</strong></span>
                        <span className="text-[#C2BFA9]">·</span>
                        <span>زمان: <strong className="text-[#625D45]">{selectedSlot?.label || "انتخاب نشده"}</strong></span>
                      </div>
                    </div>

                    {/* Direct Booking Form Fields (Persistent Database Saving) */}
                    <form onSubmit={handleSubmitBooking} className="p-6 rounded-2xl bg-[#FCFAF6] border border-[#E8E2D5] space-y-4 text-right">
                      <div className="text-xs font-bold text-[#302A21]">مشخصات مراجعه‌کننده برای ثبت درخواست:</div>
                      
                      {submitError && (
                        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                          {submitError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-[#756F62] flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#404c34]" />
                            <span>نام و نام خانوادگی *</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="مثال: سارا محمدی"
                            value={patientName}
                            onChange={e => setPatientName(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#E8E2D5] text-xs sm:text-sm text-[#302A21] focus:outline-hidden focus:border-[#404c34]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-[#756F62] flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#404c34]" />
                            <span>شماره موبایل *</span>
                          </label>
                          <input
                            type="tel"
                            required
                            dir="ltr"
                            placeholder="09123456789"
                            value={patientPhone}
                            onChange={e => setPatientPhone(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#E8E2D5] text-xs sm:text-sm text-[#302A21] focus:outline-hidden focus:border-[#404c34]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-[#756F62] flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#404c34]" />
                          <span>توضیحات و ترجیحات (اختیاری)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="مثلاً: حساسیت دارویی، ترجیح ساعت دقیق‌تر و..."
                          value={patientNote}
                          onChange={e => setPatientNote(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#E8E2D5] text-xs sm:text-sm text-[#302A21] focus:outline-hidden focus:border-[#404c34]"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[#E8E2D5]/50">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="px-5 py-2.5 rounded-full text-xs font-medium text-[#817C70] hover:text-[#302A21] transition-colors cursor-pointer"
                        >
                          مرحله قبل
                        </button>

                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="submit"
                            disabled={submitting || !selectedSlot || loadingAvailability}
                            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#404c34] hover:bg-[#343F2B] disabled:opacity-50 transition-colors cursor-pointer shadow-[0_6px_20px_rgba(64,76,52,0.3)]"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>در حال ثبت نوبت در دیتابیس...</span>
                              </>
                            ) : (
                              <>
                                <CalendarCheck className="w-4 h-4" />
                                <span>ثبت درخواست نوبت</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
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
