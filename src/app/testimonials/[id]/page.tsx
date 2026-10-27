import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CalendarDays, MessageCircleHeart, Play, Sparkles, Star } from "lucide-react";
import { Types } from "mongoose";
import { Localized } from "@/components/i18n/Localized";
import { connectDB } from "@/lib/db";
import { MediaModel, TestimonialModel } from "@/models";

type Props = { params: Promise<{ id: string }> };

function localized(value?: { fa?: string; en?: string } | null) {
  return {
    fa: typeof value?.fa === "string" ? value.fa : "",
    en: typeof value?.en === "string" ? value.en : "",
  };
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(new Date(value));
}

async function getTestimonial(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  await connectDB();
  const item = await TestimonialModel.findOne({ _id: id, status: "published" }).lean();
  if (!item) return null;

  const mediaIds = [item.photoMediaId, item.videoMediaId].filter(Boolean);
  const media = mediaIds.length
    ? await MediaModel.find({ _id: { $in: mediaIds } }).select("url").lean()
    : [];
  const mediaById = new Map(media.map((entry) => [String(entry._id), entry.url]));

  return {
    item,
    imageUrl: item.photoMediaId
      ? mediaById.get(String(item.photoMediaId)) || item.coverImageUrl
      : item.coverImageUrl,
    videoUrl: item.videoMediaId
      ? mediaById.get(String(item.videoMediaId)) || item.videoUrl
      : item.videoUrl,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const testimonial = await getTestimonial(id);
  if (!testimonial) return { title: "رضایت مراجع پیدا نشد" };

  const name = localized(testimonial.item.patientName);
  const treatment = localized(testimonial.item.treatment);
  return {
    title: `تجربه ${name.fa || name.en || "مراجع کلینیک"}`,
    description: treatment.fa || treatment.en || "تجربه و بازخورد یکی از مراجعین کلینیک دندانپزشکی.",
  };
}

export default async function TestimonialDetailPage({ params }: Props) {
  const { id } = await params;
  const testimonial = await getTestimonial(id);
  if (!testimonial) notFound();

  const { item, imageUrl, videoUrl } = testimonial;
  const patientName = localized(item.patientName);
  const treatment = localized(item.treatment);
  const comment = localized(item.comment);
  const rating = Math.max(1, Math.min(5, item.rating || 5));

  return (
    <main className="portfolio-detail-page testimonial-detail-page">
      <nav className="portfolio-detail-breadcrumb" aria-label="مسیر صفحه">
        <Link href="/"><Localized value={{ fa: "صفحه اصلی", en: "Home" }} /></Link>
        <span aria-hidden="true">/</span>
        <Link href="/testimonials"><Localized value={{ fa: "رضایت مراجعین", en: "Patient testimonials" }} /></Link>
        <span aria-hidden="true">/</span>
        <span>{patientName.fa || patientName.en || "مراجع کلینیک"}</span>
      </nav>

      <header className="portfolio-detail-hero testimonial-detail-hero">
        <div className="portfolio-detail-hero-copy">
          <span className="portfolio-detail-eyebrow"><MessageCircleHeart size={15} aria-hidden="true" /> تجربه مراجعین</span>
          <h1>{patientName.fa || patientName.en || "مراجع کلینیک"}</h1>
          {treatment.fa || treatment.en ? (
            <p className="portfolio-detail-summary">{treatment.fa || treatment.en}</p>
          ) : null}
          <div className="testimonial-detail-rating" aria-label={`امتیاز ${rating} از ۵`}>
            <span aria-hidden="true">{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>
            <strong>{rating} از ۵</strong>
          </div>
        </div>
        <div className="portfolio-detail-hero-note">
          <span className="portfolio-detail-note-icon"><Star size={22} aria-hidden="true" /></span>
          <div>
            <strong>بازخورد ثبت‌شده مراجع</strong>
            <p><CalendarDays size={13} aria-hidden="true" /> {formatDate(item.createdAt)}</p>
          </div>
        </div>
      </header>

      <div className="portfolio-detail-layout portfolio-detail-layout-no-toc testimonial-detail-layout">
        <div className="portfolio-detail-content">
          {imageUrl && (
            <section className="portfolio-detail-section testimonial-detail-media">
              <div className="portfolio-detail-section-heading">
                <span className="portfolio-detail-section-icon"><Sparkles size={20} aria-hidden="true" /></span>
                <div>
                  <span className="portfolio-detail-kicker">تصویر رضایت</span>
                  <h2>تصویر مراجع</h2>
                </div>
              </div>
              <Image src={imageUrl} alt={`تصویر رضایت ${patientName.fa || patientName.en}`} width={1200} height={800} unoptimized />
            </section>
          )}

          {videoUrl && (
            <section className="portfolio-detail-section testimonial-detail-media">
              <div className="portfolio-detail-section-heading">
                <span className="portfolio-detail-section-icon"><Play size={20} aria-hidden="true" /></span>
                <div>
                  <span className="portfolio-detail-kicker">ویدئوی رضایت</span>
                  <h2>مشاهده تجربه مراجع</h2>
                </div>
              </div>
              <video src={videoUrl} controls preload="metadata" playsInline aria-label={`ویدئوی رضایت ${patientName.fa || patientName.en}`} />
            </section>
          )}

          {(comment.fa || comment.en) && (
            <section className="portfolio-detail-section testimonial-detail-comment">
              <div className="portfolio-detail-section-heading">
                <span className="portfolio-detail-section-icon"><MessageCircleHeart size={20} aria-hidden="true" /></span>
                <div>
                  <span className="portfolio-detail-kicker">متن بازخورد مراجع</span>
                  <h2>تجربه مراجع از درمان</h2>
                </div>
              </div>
              <blockquote>{comment.fa || comment.en}</blockquote>
              <div className="testimonial-detail-comment-author">
                <span>{patientName.fa || patientName.en || "مراجع کلینیک"}</span>
                <span className="testimonial-rating" aria-hidden="true">{"★".repeat(rating)}</span>
              </div>
            </section>
          )}
        </div>

        <aside className="portfolio-detail-aside">
          <section className="portfolio-detail-aside-card">
            <span className="portfolio-detail-aside-icon"><MessageCircleHeart size={21} aria-hidden="true" /></span>
            <span className="portfolio-detail-kicker">رضایت مراجعین</span>
            <h2>سپاس از اعتماد شما</h2>
            <p>بازخورد مراجعین کمک می‌کند تجربه درمان در کلینیک را بهتر کنیم.</p>
            {treatment.fa || treatment.en ? (
              <div className="portfolio-detail-aside-categories">
                <span>خدمت دریافتی</span>
                <strong>{treatment.fa || treatment.en}</strong>
              </div>
            ) : null}
            {item.featured && (
              <div className="portfolio-detail-aside-categories">
                <span>نشان رضایت</span>
                <strong>رضایت ویژه کلینیک</strong>
              </div>
            )}
            <Link className="portfolio-detail-back-link" href="/testimonials">
              مشاهده همه رضایت‌ها
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </section>
        </aside>
      </div>
    </main>
  );
}
