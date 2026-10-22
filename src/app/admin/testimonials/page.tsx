"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminFeedback } from "@/components/admin/AdminFeedback";

type Testimonial = {
  _id: string;
  patientName: { fa: string; en?: string };
  treatment?: { fa?: string; en?: string };
  comment?: { fa?: string; en?: string };
  rating: number;
  videoUrl?: string;
  coverImageUrl?: string;
  status: "published" | "draft" | "archived";
  sortOrder: number;
  featured: boolean;
  createdAt: string;
};

export default function AdminTestimonialsPage() {
  const { toast } = useAdminFeedback();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [patientNameFa, setPatientNameFa] = useState("");
  const [treatmentFa, setTreatmentFa] = useState("");
  const [commentFa, setCommentFa] = useState("");
  const [rating, setRating] = useState(5);
  const [videoUrl, setVideoUrl] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [status, setStatus] = useState<"published" | "draft" | "archived">("published");
  const [sortOrder, setSortOrder] = useState(0);
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/v1/admin/testimonials", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error?.message || "خطا در دریافت لیست رضایت‌ها");
      setItems(data.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا در بارگذاری");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function resetForm() {
    setEditingId(null);
    setPatientNameFa("");
    setTreatmentFa("");
    setCommentFa("");
    setRating(5);
    setVideoUrl("");
    setCoverImageUrl("");
    setStatus("published");
    setSortOrder(0);
    setFeatured(false);
    setShowForm(false);
  }

  function startEdit(item: Testimonial) {
    setEditingId(item._id);
    setPatientNameFa(item.patientName?.fa || "");
    setTreatmentFa(item.treatment?.fa || "");
    setCommentFa(item.comment?.fa || "");
    setRating(item.rating || 5);
    setVideoUrl(item.videoUrl || "");
    setCoverImageUrl(item.coverImageUrl || "");
    setStatus(item.status || "published");
    setSortOrder(item.sortOrder || 0);
    setFeatured(Boolean(item.featured));
    setShowForm(true);
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
        status,
        sortOrder,
        featured,
      };

      const url = editingId ? `/api/v1/admin/testimonials/${editingId}` : "/api/v1/admin/testimonials";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "خطا در ذخیره‌سازی");
      }

      toast(editingId ? "تغییرات رضایت مراجع ذخیره شد." : "رضایت مراجع جدید با موفقیت اضافه شد.");
      resetForm();
      await load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "خطا در ارسال اطلاعات", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("آیا از حذف این مورد اطمینان دارید؟")) return;

    try {
      const res = await fetch(`/api/v1/admin/testimonials/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error?.message || "حذف ناموفق بود");

      toast("رضایت مراجع با موفقیت حذف شد.");
      await load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "خطا در حذف", "error");
    }
  }

  return (
    <div className="admin-shell max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>مدیریت رضایت مراجعین</span>
            <span className="text-xs bg-[#404c34]/20 text-[#625D45] px-2.5 py-1 rounded-full font-semibold">
              {items.length} مورد
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            ثبت، ویرایش و مدیریت نظرات و ویدئوهای رضایت مراجعین برای نمایش در صفحه اصلی
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="px-4 py-2 bg-[#404c34] text-white rounded-xl text-sm font-semibold hover:bg-[#8e896b] transition shadow-xs flex items-center gap-2"
        >
          {showForm && !editingId ? "بستن فرم" : "+ ثبت رضایت جدید"}
        </button>
      </div>

      {error ? (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
          {error}
        </div>
      ) : null}

      {/* فرم افزودن / ویرایش */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="font-bold text-base text-gray-800">
              {editingId ? "ویرایش رضایت مراجع" : "افزودن رضایت مراجع جدید"}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-gray-400 hover:text-gray-600"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                آدرس ویدئو (اختیاری - MP4)
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://.../video.mp4"
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#404c34] dir-ltr text-left"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                در صورت وارد کردن ویدئو، در صفحه اصلی اولویت نمایش با ویدئو و آیکون پخش خواهد بود.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                آدرس تصویر کاور / عکس مراجع (اختیاری)
              </label>
              <input
                type="url"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://.../photo.jpg"
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#404c34] dir-ltr text-left"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                اگر ویدیو نداشته باشد، تصویر کاور نمایش داده می‌شود؛ و اگر ویدیو داشته باشد به عنوان پوستر ویدئو استفاده خواهد شد.
              </span>
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
              {saving ? "در حال ذخیره..." : editingId ? "ذخیره تغییرات" : "ثبت رضایت"}
            </button>
          </div>
        </form>
      )}

      {/* جدول / لیست رضایت‌ها */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-400">در حال دریافت اطلاعات...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400">
            هنوز هیچ رضایتی ثبت نشده است. با کلیک بر روی دکمه «ثبت رضایت جدید» اولین مورد را اضافه کنید.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold">
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
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/70 transition">
                    <td className="py-3 px-4 font-semibold text-gray-800">
                      {item.patientName?.fa || "بدون نام"}
                      {item.featured && (
                        <span className="mr-2 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                          ویژه
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-500">{item.treatment?.fa || "—"}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {item.videoUrl ? (
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium text-[11px] flex items-center gap-1">
                            <span>▶</span> ویدئو
                          </span>
                        ) : null}
                        {item.coverImageUrl ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium text-[11px]">
                            عکس
                          </span>
                        ) : null}
                        {!item.videoUrl && !item.coverImageUrl ? (
                          <span className="text-gray-400">متنی</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-amber-600 font-bold">★ {item.rating}</td>
                    <td className="py-3 px-4">
                      {item.status === "published" ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                          منتشر شده
                        </span>
                      ) : item.status === "draft" ? (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                          پیش‌نویس
                        </span>
                      ) : (
                        <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                          بایگانی
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">{item.sortOrder}</td>
                    <td className="py-3 px-4 text-left">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="px-2.5 py-1 text-xs text-[#625D45] hover:bg-[#F7F4EE] rounded-lg transition"
                        >
                          ویرایش
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
