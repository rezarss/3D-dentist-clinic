"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquareText, Play } from "lucide-react";
import { useAdminFeedback } from "@/components/admin/AdminFeedback";
import { MediaPicker } from "@/components/editor/MediaPicker";
import { Pagination } from "@/components/admin/Pagination";

type Testimonial = {
  _id: string;
  patientName: { fa: string; en?: string };
  treatment?: { fa?: string; en?: string };
  comment?: { fa?: string; en?: string };
  rating: number;
  videoUrl?: string;
  coverImageUrl?: string;
  videoMediaId?: string | null;
  coverMediaId?: string | null;
  status: "published" | "draft" | "archived";
  sortOrder: number;
  featured: boolean;
  showInReviews: boolean;
  createdAt: string;
};
type MediaSelection = { _id: string; url: string };
type PaginationState = { page: number; limit: number; total: number; pages: number };

export default function AdminTestimonialsPage() {
  const { confirm, toast } = useAdminFeedback();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [patientNameFa, setPatientNameFa] = useState("");
  const [treatmentFa, setTreatmentFa] = useState("");
  const [commentFa, setCommentFa] = useState("");
  const [rating, setRating] = useState(5);
  const [videoUrl, setVideoUrl] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [videoMediaId, setVideoMediaId] = useState<string | null>(null);
  const [coverMediaId, setCoverMediaId] = useState<string | null>(null);
  const [pickerMode, setPickerMode] = useState<"image" | "video" | null>(null);
  const [status, setStatus] = useState<"published" | "draft" | "archived">("published");
  const [sortOrder, setSortOrder] = useState(0);
  const [featured, setFeatured] = useState(false);
  const [showInReviews, setShowInReviews] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(perPage) });
      const res = await fetch(`/api/v1/admin/testimonials?${params}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error?.message || "خطا در دریافت لیست رضایت‌ها");
      setItems(data.data?.items || []);
      setPagination(data.data?.pagination || { page, limit: perPage, total: 0, pages: 0 });
      if (data.data?.pagination?.pages && page > data.data.pagination.pages) {
        setPage(data.data.pagination.pages);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا در بارگذاری");
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!showForm) return;
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [showForm]);

  function resetForm() {
    setPatientNameFa("");
    setTreatmentFa("");
    setCommentFa("");
    setRating(5);
    setVideoUrl("");
    setCoverImageUrl("");
    setVideoMediaId(null);
    setCoverMediaId(null);
    setStatus("published");
    setSortOrder(0);
    setFeatured(false);
    setShowInReviews(false);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!patientNameFa.trim()) {
      toast("لطفاً نام مراجعه‌کننده را وارد کنید.", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        patientName: { fa: patientNameFa.trim() },
        treatment: { fa: treatmentFa.trim() },
        comment: { fa: commentFa.trim() },
        rating,
        videoUrl: videoUrl.trim(),
        coverImageUrl: coverImageUrl.trim(),
        videoMediaId,
        coverMediaId,
        status,
        sortOrder,
        featured,
        showInReviews,
      };

      const res = await fetch("/api/v1/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "خطا در ذخیره‌سازی");
      }

      toast("رضایت مراجع جدید با موفقیت اضافه شد.");
      resetForm();
      if (page !== 1) setPage(1);
      else await load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "خطا در ارسال اطلاعات", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: Testimonial) {
    const patientName = item.patientName?.fa || "این رضایت مراجع";
    if (!await confirm({
      title: "حذف رضایت مراجع",
      description: `رکورد «${patientName}» شامل نام، نوع درمان، متن بازخورد، امتیاز، وضعیت انتشار و تنظیمات نمایش برای همیشه حذف می‌شود. فایل‌های رسانه‌ای مستقل از این رکورد حذف نخواهند شد.`,
      confirmLabel: "حذف دائمی",
      tone: "danger",
    })) return;

    setDeletingId(item._id);
    try {
      const res = await fetch(`/api/v1/admin/testimonials/${item._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error?.message || "حذف ناموفق بود");

      toast("رضایت مراجع با موفقیت حذف شد.");
      await load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "خطا در حذف", "error");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="content-list-page testimonials-page">
      <header className="content-list-heading">
        <div className="testimonials-heading-copy">
          <span className="dashboard-eyebrow">مدیریت بازخوردها</span>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>مدیریت رضایت مراجعین</span>
            <span className="testimonials-count">
              {pagination.total} مورد
            </span>
          </h1>
          <p>
            ثبت، ویرایش و مدیریت نظرات و ویدئوهای رضایت مراجعین برای نمایش در صفحه اصلی
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="admin-action-create"
        >
          {showForm ? "بستن فرم" : "+ ثبت رضایت جدید"}
        </button>
      </header>

      {error ? (
        <div className="content-list-error" role="alert">
          {error}
        </div>
      ) : null}

      {/* فرم افزودن / ویرایش */}
      {showForm && (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="testimonials-form"
        >
          <div className="testimonials-form-heading">
            <h2>
              افزودن رضایت مراجع جدید
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="testimonials-cancel-link"
            >
              انصراف
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                نام مراجعه‌کننده <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={patientNameFa}
                onChange={(e) => setPatientNameFa(e.target.value)}
                placeholder="مثلاً سارا معتمدی"
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#404c34]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                نوع درمان / خدمات دریافتی
              </label>
              <input
                type="text"
                value={treatmentFa}
                onChange={(e) => setTreatmentFa(e.target.value)}
                placeholder="مثلاً لمینت سرامیکی و اصلاح لبخند"
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#404c34]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              متن رضایت / بازخورد مراجع
            </label>
            <textarea
              value={commentFa}
              onChange={(e) => setCommentFa(e.target.value)}
              rows={3}
              placeholder="شرح تجربه مراجع از فضای کلینیک و روند درمان..."
              className="w-full text-sm border border-gray-200 rounded-xl p-3 outline-none focus:border-[#404c34]"
            />
          </div>

          <div className="testimonials-media-fields">
            <div>
              <span className="testimonials-media-label">ویدئوی رضایت (اختیاری)</span>
              {videoUrl ? (
                <div className="testimonials-media-preview">
                  <video src={videoUrl} controls preload="metadata" />
                  <div className="testimonials-media-preview-actions">
                    <button type="button" className="admin-action-neutral" onClick={() => setPickerMode("video")}>تغییر ویدئو</button>
                    <button type="button" className="admin-action-danger" onClick={() => { setVideoUrl(""); setVideoMediaId(null); }}>حذف ویدئو</button>
                  </div>
                </div>
              ) : (
                <button type="button" className="testimonials-media-select" onClick={() => setPickerMode("video")}>＋ انتخاب یا بارگذاری ویدئو</button>
              )}
              <span className="testimonials-media-help">از کتابخانه ویدئو انتخاب کنید یا از همان پنجره ویدئوی تازه بارگذاری کنید.</span>
            </div>

            <div>
              <span className="testimonials-media-label">تصویر کاور / عکس مراجع (اختیاری)</span>
              {coverImageUrl ? (
                <div className="testimonials-media-preview">
                  <Image src={coverImageUrl} alt="تصویر انتخاب‌شده" width={240} height={150} unoptimized />
                  <div className="testimonials-media-preview-actions">
                    <button type="button" className="admin-action-neutral" onClick={() => setPickerMode("image")}>تغییر تصویر</button>
                    <button type="button" className="admin-action-danger" onClick={() => { setCoverImageUrl(""); setCoverMediaId(null); }}>حذف تصویر</button>
                  </div>
                </div>
              ) : (
                <button type="button" className="testimonials-media-select" onClick={() => setPickerMode("image")}>＋ انتخاب یا بارگذاری تصویر</button>
              )}
              <span className="testimonials-media-help">تصویر از کتابخانه رسانه انتخاب یا از پنجرهٔ انتخاب بارگذاری می‌شود.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">امتیاز (۱ تا ۵)</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#404c34]"
              >
                <option value={5}>۵ ستاره (عالی)</option>
                <option value={4}>۴ ستاره</option>
                <option value={3}>۳ ستاره</option>
                <option value={2}>۲ ستاره</option>
                <option value={1}>۱ ستاره</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">وضعیت انتشار</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#404c34]"
              >
                <option value="published">منتشر شده (نمایش در سایت)</option>
                <option value="draft">پیش‌نویس (مخفی)</option>
                <option value="archived">بایگانی شده</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">ترتیب نمایش</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#404c34]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="featured-check"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded text-[#404c34] focus:ring-[#404c34]"
            />
            <label htmlFor="featured-check" className="text-xs font-medium text-gray-700 cursor-pointer">
              نمایش در بخش ویژه / کارت‌های کاروسل ویدئویی
            </label>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="show-in-reviews-check"
              checked={showInReviews}
              onChange={(e) => setShowInReviews(e.target.checked)}
              className="rounded text-[#404c34] focus:ring-[#404c34]"
            />
            <label htmlFor="show-in-reviews-check" className="text-xs font-medium text-gray-700 cursor-pointer">
              نمایش در سکشن نظرات متحرک صفحه اصلی
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-[#404c34] text-white rounded-xl text-xs font-semibold hover:bg-[#8e896b] transition disabled:opacity-50"
            >
              {saving ? "در حال ذخیره..." : "ثبت رضایت"}
            </button>
          </div>
        </form>
      )}

      {/* جدول / لیست رضایت‌ها */}
      <section className="content-list-table-wrap testimonials-table-wrap">
        {loading ? (
          <div className="content-list-state">در حال دریافت اطلاعات…</div>
        ) : items.length === 0 ? (
          <div className="content-list-state">
            <strong>هنوز رضایتی ثبت نشده است</strong>
            <span>برای افزودن اولین مورد، دکمهٔ «ثبت رضایت جدید» را انتخاب کنید.</span>
          </div>
        ) : (
          <div className="content-list-scroll">
            <table className="content-list-table testimonials-table">
              <thead>
                <tr>
                  <th className="py-3 px-4">مراجع</th>
                  <th className="py-3 px-4">نوع درمان</th>
                  <th className="py-3 px-4">رسانه</th>
                  <th className="py-3 px-4">امتیاز</th>
                  <th className="py-3 px-4">وضعیت</th>
                  <th className="py-3 px-4">ترتیب</th>
                  <th className="py-3 px-4 text-left">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <Link className="testimonial-name-edit" href={`/admin/testimonials/${item._id}`} aria-label={`ویرایش رضایت ${item.patientName?.fa || "مراجع"}`}>
                        {item.patientName?.fa || "بدون نام"}
                      </Link>
                      <span className="testimonials-display-flags">
                        {item.featured && (
                          <span className="testimonials-display-flag is-featured" title="نمایش در بخش ویژه / کارت‌های کاروسل ویدئویی" aria-label="نمایش در بخش ویژه / کارت‌های کاروسل ویدئویی">
                            <Play size={11} fill="currentColor" aria-hidden="true" />
                          </span>
                        )}
                        {item.showInReviews && (
                          <span className="testimonials-display-flag is-reviews" title="نمایش در سکشن نظرات متحرک صفحه اصلی" aria-label="نمایش در سکشن نظرات متحرک صفحه اصلی">
                            <MessageSquareText size={12} aria-hidden="true" />
                          </span>
                        )}
                      </span>
                    </td>
                    <td>{item.treatment?.fa || "—"}</td>
                    <td>
                      <div className="testimonials-media-badges">
                        {item.videoUrl ? (
                          <span className="testimonials-media-video">
                            <span>▶</span> ویدئو
                          </span>
                        ) : null}
                        {item.coverImageUrl ? (
                          <span className="testimonials-media-image">
                            عکس
                          </span>
                        ) : null}
                        {!item.videoUrl && !item.coverImageUrl ? (
                          <span>متنی</span>
                        ) : null}
                      </div>
                    </td>
                    <td><span className="testimonials-rating">★ {item.rating}</span></td>
                    <td>
                      {item.status === "published" ? (
                        <span className="content-status-badge status-published">
                          منتشر شده
                        </span>
                      ) : item.status === "draft" ? (
                        <span className="content-status-badge status-scheduled">
                          پیش‌نویس
                        </span>
                      ) : (
                        <span className="content-status-badge status-archived">
                          بایگانی
                        </span>
                      )}
                    </td>
                    <td>{item.sortOrder}</td>
                    <td>
                      <div className="content-row-actions">
                        {item.status === "published" ? (
                          <Link
                            className="admin-action-neutral"
                            href={`/${item.videoUrl && item.featured ? "#stories" : "#reviews"}`}
                            target="_blank"
                            rel="noreferrer"
                            title="نمایش در سایت"
                          >
                            نمایش
                          </Link>
                        ) : (
                          <button
                            type="button"
                            className="admin-action-neutral"
                            disabled
                            title="برای نمایش، ابتدا مورد را منتشر کنید"
                          >
                            نمایش
                          </button>
                        )}
                        <button
                          onClick={() => void handleDelete(item)}
                          className="admin-action-danger"
                          disabled={deletingId === item._id}
                        >
                          {deletingId === item._id ? "در حال حذف…" : "حذف"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && (
          <Pagination
            page={page}
            perPage={perPage}
            totalItems={pagination.total}
            onPageChange={setPage}
            onPerPageChange={(value) => {
              setPerPage(value);
              setPage(1);
            }}
          />
        )}
      </section>
      <MediaPicker
        open={pickerMode !== null}
        mode={pickerMode || "image"}
        onClose={() => setPickerMode(null)}
        onSelect={(media: MediaSelection) => {
          if (pickerMode === "video") {
            setVideoMediaId(media._id);
            setVideoUrl(media.url);
          } else {
            setCoverMediaId(media._id);
            setCoverImageUrl(media.url);
          }
          setPickerMode(null);
        }}
      />
    </main>
  );
}
