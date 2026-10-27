import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircleHeart, Play, Sparkles } from "lucide-react";
import { connectDB } from "@/lib/db";
import { MediaModel, TestimonialModel } from "@/models";
import { TestimonialPagination } from "./TestimonialPagination";

export const dynamic = "force-dynamic";

const pageSizes = [10, 20, 50, 100];

type SearchParams = Promise<{ page?: string; perPage?: string }>;

function parsePositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function plainLocalized(value?: { fa?: string; en?: string } | null) {
  return {
    fa: typeof value?.fa === "string" ? value.fa : "",
    en: typeof value?.en === "string" ? value.en : "",
  };
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(new Date(value));
}

export default async function TestimonialsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const requestedPage = parsePositiveInteger(params.page, 1);
  const requestedPerPage = parsePositiveInteger(params.perPage, 10);
  const perPage = pageSizes.includes(requestedPerPage) ? requestedPerPage : 10;

  await connectDB();
  const filter = { status: "published" };
  const totalItems = await TestimonialModel.countDocuments(filter);
  const pageCount = Math.max(1, Math.ceil(totalItems / perPage));
  const page = Math.min(requestedPage, pageCount);
  const items = await TestimonialModel.find(filter)
    .sort({ sortOrder: 1, createdAt: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .lean();

  const mediaIds = items.flatMap((item) => [item.photoMediaId, item.videoMediaId].filter(Boolean));
  const media = mediaIds.length
    ? await MediaModel.find({ _id: { $in: mediaIds } }).select("url").lean()
    : [];
  const mediaById = new Map(media.map((entry) => [String(entry._id), entry.url]));

  return (
    <main className="services-page testimonials-archive-page">
      <header className="services-heading">
        <div className="services-heading-copy">
          <span className="services-eyebrow"><MessageCircleHeart size={15} aria-hidden="true" /> رضایت مراجعین</span>
          <h1>تجربه‌های واقعی مراجعین</h1>
          <p>بازخوردها و تجربه‌های مراجعین از درمان و خدمات کلینیک را بخوانید و ببینید.</p>
        </div>
        <Link className="services-home-link" href="/">
          صفحه اصلی
          <ArrowLeft size={16} aria-hidden="true" />
        </Link>
      </header>

      {items.length > 0 ? (
        <>
          <div className="services-grid testimonial-archive-grid">
            {items.map((item, index) => {
              const patientName = plainLocalized(item.patientName);
              const treatment = plainLocalized(item.treatment);
              const comment = plainLocalized(item.comment);
              const imageUrl = item.photoMediaId
                ? mediaById.get(String(item.photoMediaId)) || item.coverImageUrl
                : item.coverImageUrl;
              const videoUrl = item.videoMediaId
                ? mediaById.get(String(item.videoMediaId)) || item.videoUrl
                : item.videoUrl;

              return (
                <article className="service-card testimonial-archive-card" key={String(item._id)}>
                  <Link className="testimonial-archive-cover" href={`/testimonials/${String(item._id)}`} aria-label={`مشاهده رضایت ${patientName.fa || patientName.en}`}>
                    {imageUrl ? (
                      <Image src={imageUrl} alt={patientName.fa || "تصویر رضایت مراجع"} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" unoptimized />
                    ) : (
                      <span className="testimonial-archive-placeholder"><MessageCircleHeart size={38} aria-hidden="true" /></span>
                    )}
                    {videoUrl && <span className="testimonial-video-badge"><Play size={14} fill="currentColor" aria-hidden="true" /> ویدئو</span>}
                    <span className="testimonial-archive-number">{String((page - 1) * perPage + index + 1).padStart(2, "0")}</span>
                  </Link>
                  <div className="service-card-content">
                    <div className="testimonial-archive-meta">
                      <span className="testimonial-rating" aria-label={`امتیاز ${item.rating} از ۵`}>
                        {"★".repeat(Math.max(0, Math.min(5, item.rating || 5)))}
                        <small>{item.rating || 5} از ۵</small>
                      </span>
                      <time dateTime={new Date(item.createdAt).toISOString()}>{formatDate(item.createdAt)}</time>
                    </div>
                    {item.featured && <span className="testimonial-featured-label"><Sparkles size={13} aria-hidden="true" /> رضایت ویژه</span>}
                    <h2><Link href={`/testimonials/${String(item._id)}`}>{patientName.fa || patientName.en || "مراجع کلینیک"}</Link></h2>
                    <div className="testimonial-treatment">{treatment.fa || treatment.en || "تجربه دریافت خدمات کلینیک"}</div>
                    <p className="testimonial-archive-comment">{comment.fa || comment.en || "برای مشاهده جزئیات این رضایت، وارد صفحه آن شوید."}</p>
                    <Link className="service-card-link" href={`/testimonials/${String(item._id)}`}>
                      مشاهده جزئیات رضایت
                      <ArrowLeft size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
          <TestimonialPagination page={page} perPage={perPage} totalItems={totalItems} />
        </>
      ) : (
        <div className="services-empty">
          <span className="services-empty-icon"><MessageCircleHeart size={28} aria-hidden="true" /></span>
          <h2>هنوز رضایتی برای نمایش ثبت نشده است</h2>
          <p>پس از انتشار بازخوردهای مراجعین، آن‌ها را در این صفحه خواهید دید.</p>
        </div>
      )}
    </main>
  );
}
