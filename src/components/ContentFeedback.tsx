"use client";

import { FormEvent, useEffect, useState } from "react";
import { MessageCircle, Send, Star } from "lucide-react";

type Review = {
  _id: string;
  body: string;
  authorName: string;
  rating?: number | null;
  createdAt: string;
};

export function ContentFeedback({
  targetId,
  targetType,
  contentLabel,
  commentsEnabled,
  ratingEnabled,
}: {
  targetId: string;
  targetType: "service" | "portfolio" | "blog" | "doctor";
  contentLabel: string;
  commentsEnabled: boolean;
  ratingEnabled: boolean;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(commentsEnabled);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [rating, setRating] = useState(5);
  const [form, setForm] = useState({ authorName: "", body: "", authorEmail: "" });

  useEffect(() => {
    if (!commentsEnabled) return;
    let active = true;
    fetch(`/api/v1/comments?targetType=${targetType}&targetId=${encodeURIComponent(targetId)}`, { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || !payload.success) throw new Error(payload.error?.message || "دریافت دیدگاه‌ها ناموفق بود.");
        if (active) setReviews(Array.isArray(payload.data) ? payload.data : []);
      })
      .catch((fetchError: unknown) => {
        if (active) setError(fetchError instanceof Error ? fetchError.message : "دریافت دیدگاه‌ها ناموفق بود.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [commentsEnabled, targetId, targetType]);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/v1/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType,
          targetId,
          authorName: form.authorName,
          authorEmail: form.authorEmail || undefined,
          body: form.body,
          ...(ratingEnabled ? { rating } : {}),
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error?.message || "ثبت دیدگاه ناموفق بود.");
      setNotice(payload.data?.message || "دیدگاه شما ثبت شد و پس از بررسی منتشر خواهد شد.");
      setForm({ authorName: "", body: "", authorEmail: "" });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "ثبت دیدگاه ناموفق بود.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="portfolio-feedback" id={`${targetType}-feedback`}>
      <div className="portfolio-detail-section-heading">
        <span className="portfolio-detail-section-icon"><MessageCircle size={20} aria-hidden="true" /></span>
        <div>
          <span className="portfolio-detail-kicker">گفت‌وگو و بازخورد</span>
          <h2>دیدگاه و امتیاز {contentLabel}</h2>
        </div>
      </div>

      {!commentsEnabled ? (
        <p className="portfolio-feedback-disabled" role="status">ارسال دیدگاه برای این {contentLabel} غیرفعال است.</p>
      ) : (
        <>
          <div className="portfolio-feedback-list" aria-live="polite">
            {loading ? <p className="portfolio-feedback-muted">در حال دریافت دیدگاه‌ها…</p>
              : reviews.length ? reviews.map((review) => (
                <article className="portfolio-review" key={review._id}>
                  <div className="portfolio-review-heading">
                    <strong>{review.authorName}</strong>
                    {review.rating && <span className="portfolio-review-rating" aria-label={`امتیاز ${review.rating} از ۵`}>
                      {Array.from({ length: review.rating }, (_, index) => <Star key={index} size={14} fill="currentColor" aria-hidden="true" />)}
                      <small>{review.rating}/۵</small>
                    </span>}
                  </div>
                  <p>{review.body}</p>
                </article>
              )) : <p className="portfolio-feedback-muted">هنوز دیدگاهی برای این {contentLabel} ثبت نشده است.</p>}
          </div>

          <form className="portfolio-feedback-form" onSubmit={submitReview}>
            <h3>دیدگاه خود را بنویسید</h3>
            {ratingEnabled && (
              <fieldset className="portfolio-rating-field">
                <legend>امتیاز شما</legend>
                <div className="portfolio-rating-options" dir="ltr">
                  {Array.from({ length: 5 }, (_, index) => {
                    const value = index + 1;
                    return (
                      <button
                        key={value}
                        type="button"
                        className={value <= rating ? "is-selected" : ""}
                        onClick={() => setRating(value)}
                        aria-label={`${value} از ۵`}
                        aria-pressed={rating === value}
                      >
                        <Star size={23} fill={value <= rating ? "currentColor" : "none"} aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}
            <div className="portfolio-feedback-fields">
              <label>نام شما
                <input value={form.authorName} onChange={(event) => setForm({ ...form, authorName: event.target.value })} minLength={2} maxLength={120} required autoComplete="name" />
              </label>
              <label>ایمیل <span>(اختیاری)</span>
                <input type="email" value={form.authorEmail} onChange={(event) => setForm({ ...form, authorEmail: event.target.value })} maxLength={254} autoComplete="email" />
              </label>
              <label className="portfolio-feedback-body">متن دیدگاه
                <textarea value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} minLength={2} maxLength={5000} rows={4} required />
              </label>
            </div>
            {error && <p className="portfolio-feedback-message is-error" role="alert">{error}</p>}
            {notice && <p className="portfolio-feedback-message is-success" role="status">{notice}</p>}
            <button className="portfolio-feedback-submit" type="submit" disabled={submitting}>
              <Send size={16} aria-hidden="true" />
              {submitting ? "در حال ارسال…" : "ارسال دیدگاه"}
            </button>
            <p className="portfolio-feedback-note">دیدگاه شما پس از بررسی مدیر در سایت نمایش داده می‌شود.</p>
          </form>
        </>
      )}
    </section>
  );
}
