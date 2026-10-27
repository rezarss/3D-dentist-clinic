"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MediaPicker } from "@/components/editor/MediaPicker";
import { useAdminFeedback } from "@/components/admin/AdminFeedback";

type Status = "published" | "draft" | "archived";
type Testimonial = {
  patientName?: { fa?: string };
  treatment?: { fa?: string };
  comment?: { fa?: string };
  rating?: number;
  videoUrl?: string;
  coverImageUrl?: string;
  videoMediaId?: string | null;
  coverMediaId?: string | null;
  status?: Status;
  sortOrder?: number;
  featured?: boolean;
  showInReviews?: boolean;
};
type MediaSelection = { _id: string; url: string };

export default function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { toast } = useAdminFeedback();
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [patientNameFa, setPatientNameFa] = useState("");
  const [treatmentFa, setTreatmentFa] = useState("");
  const [commentFa, setCommentFa] = useState("");
  const [rating, setRating] = useState(5);
  const [videoUrl, setVideoUrl] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [videoMediaId, setVideoMediaId] = useState<string | null>(null);
  const [coverMediaId, setCoverMediaId] = useState<string | null>(null);
  const [pickerMode, setPickerMode] = useState<"image" | "video" | null>(null);
  const [status, setStatus] = useState<Status>("published");
  const [sortOrder, setSortOrder] = useState(0);
  const [featured, setFeatured] = useState(false);
  const [showInReviews, setShowInReviews] = useState(false);

  useEffect(() => {
    let active = true;
    void params.then(({ id: testimonialId }) => {
      if (!active) return;
      setId(testimonialId);
      void fetch(`/api/v1/admin/testimonials/${testimonialId}`, { cache: "no-store" })
        .then(async (response) => {
          const payload = await response.json();
          if (!response.ok || !payload.success) throw new Error(payload.error?.message || "دریافت رضایت مراجع ناموفق بود.");
          const item = payload.data as Testimonial;
          if (!active) return;
          setPatientNameFa(item.patientName?.fa || "");
          setTreatmentFa(item.treatment?.fa || "");
          setCommentFa(item.comment?.fa || "");
          setRating(item.rating || 5);
          setVideoUrl(item.videoUrl || "");
          setCoverImageUrl(item.coverImageUrl || "");
          setVideoMediaId(item.videoMediaId ? String(item.videoMediaId) : null);
          setCoverMediaId(item.coverMediaId ? String(item.coverMediaId) : null);
          setStatus(item.status || "published");
          setSortOrder(item.sortOrder || 0);
          setFeatured(Boolean(item.featured));
          setShowInReviews(Boolean(item.showInReviews));
        })
        .catch((fetchError: unknown) => {
          if (active) setError(fetchError instanceof Error ? fetchError.message : "دریافت رضایت مراجع ناموفق بود.");
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    });
    return () => {
      active = false;
    };
  }, [params]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!patientNameFa.trim()) {
      setError("لطفاً نام مراجعه‌کننده را وارد کنید.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/v1/admin/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error?.message || "ذخیره تغییرات ناموفق بود.");
      toast("تغییرات رضایت مراجع ذخیره شد.");
      router.push("/admin/testimonials");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "ذخیره تغییرات ناموفق بود.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="content-list-page testimonials-page">
      <header className="content-list-heading">
        <div className="testimonials-heading-copy">
          <span className="dashboard-eyebrow">مدیریت بازخوردها</span>
          <h1>ویرایش رضایت مراجع</h1>
          <p>اطلاعات و رسانه‌های این رضایت را ویرایش کنید.</p>
        </div>
        <Link className="admin-action-neutral" href="/admin/testimonials">بازگشت به فهرست</Link>
      </header>

      {error && <p className="content-list-error" role="alert">{error}</p>}
      {loading ? <div className="content-list-state">در حال دریافت اطلاعات…</div> : (
        <form className="testimonials-form" onSubmit={(event) => void handleSubmit(event)}>
          <div className="testimonials-form-heading"><h2>اطلاعات رضایت مراجع</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="testimonials-edit-label"><span className="testimonials-edit-label-title">نام مراجعه‌کننده <span>*</span></span>
              <input value={patientNameFa} onChange={(event) => setPatientNameFa(event.target.value)} required maxLength={160} />
            </label>
            <label className="testimonials-edit-label">نوع درمان / خدمات دریافتی
              <input value={treatmentFa} onChange={(event) => setTreatmentFa(event.target.value)} maxLength={500} />
            </label>
          </div>
          <label className="testimonials-edit-label">متن رضایت / بازخورد مراجع
            <textarea value={commentFa} onChange={(event) => setCommentFa(event.target.value)} rows={4} maxLength={5000} />
          </label>

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
              ) : <button type="button" className="testimonials-media-select" onClick={() => setPickerMode("video")}>＋ انتخاب یا بارگذاری ویدئو</button>}
              <span className="testimonials-media-help">از کتابخانه ویدئو انتخاب کنید یا ویدئوی تازه بارگذاری کنید.</span>
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
              ) : <button type="button" className="testimonials-media-select" onClick={() => setPickerMode("image")}>＋ انتخاب یا بارگذاری تصویر</button>}
              <span className="testimonials-media-help">تصویر از کتابخانه رسانه انتخاب یا بارگذاری می‌شود.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="testimonials-edit-label">امتیاز (۱ تا ۵)
              <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
                {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} ستاره</option>)}
              </select>
            </label>
            <label className="testimonials-edit-label">وضعیت انتشار
              <select value={status} onChange={(event) => setStatus(event.target.value as Status)}>
                <option value="published">منتشر شده</option>
                <option value="draft">پیش‌نویس</option>
                <option value="archived">بایگانی شده</option>
              </select>
            </label>
            <label className="testimonials-edit-label">ترتیب نمایش
              <input type="number" value={sortOrder} onChange={(event) => setSortOrder(Number(event.target.value))} />
            </label>
          </div>

          <label className="testimonials-featured-toggle">
            <input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} />
            نمایش در بخش ویژه / کارت‌های کاروسل ویدئویی
          </label>
          <label className="testimonials-featured-toggle">
            <input type="checkbox" checked={showInReviews} onChange={(event) => setShowInReviews(event.target.checked)} />
            نمایش در سکشن نظرات متحرک صفحه اصلی
          </label>
          <div className="testimonials-edit-actions">
            <Link href="/admin/testimonials" className="admin-action-neutral">انصراف</Link>
            <button type="submit" className="admin-action-create" disabled={saving}>{saving ? "در حال ذخیره…" : "ذخیره تغییرات"}</button>
          </div>
        </form>
      )}

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
