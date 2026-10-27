import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, CheckCircle2, Images, Sparkles, UserRound } from "lucide-react";
import { PortfolioCategoryModel, PortfolioItemModel, MediaModel, DoctorModel } from "@/models";
import { sanitizeLocalizedHtml } from "@/lib/sanitize";
import { Localized } from "@/components/i18n/Localized";
import { connectDB } from "@/lib/db";
import { BeforeAfterSlider } from "../BeforeAfterSlider";
import { ContentFeedback } from "@/components/ContentFeedback";

type Props = { params: Promise<{ slug: string }> };
type LocalizedValue = { fa: string; en: string };
type PortfolioMedia = {
  _id: { toString(): string };
  url: string;
  alt?: { fa?: string; en?: string };
};

function localized(value?: { fa?: string; en?: string } | null): LocalizedValue {
  return {
    fa: typeof value?.fa === "string" ? value.fa : "",
    en: typeof value?.en === "string" ? value.en : "",
  };
}

function hasContent(value: LocalizedValue) {
  return Boolean(value.fa || value.en);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const item = await PortfolioItemModel.findOne({
    slug,
    status: "published",
    "privacy.consentStatus": "granted",
  }).lean();
  if (!item) return { title: "Case not found" };

  const title = item.seo?.title?.fa || item.title?.fa || item.title?.en || "Dental Case";
  const description = item.seo?.description?.fa || item.description?.fa || "";
  const canonical = item.seo?.canonical?.fa || undefined;
  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: item.seo?.robots ? { index: item.seo.robots.index, follow: item.seo.robots.follow } : undefined,
    openGraph: {
      title: item.seo?.ogTitle?.fa || title,
      description: item.seo?.ogDescription?.fa || description,
      type: "article",
      url: canonical,
    },
  };
}

export default async function PortfolioDetail({ params }: Props) {
  const { slug } = await params;
  await connectDB();
  const item = await PortfolioItemModel.findOne({
    slug,
    status: "published",
    "privacy.consentStatus": "granted",
  }).lean();
  if (!item) notFound();

  const mediaIds = [...(item.beforeMediaIds || []), ...(item.afterMediaIds || [])];
  const [media, categories, doctor] = await Promise.all([
    mediaIds.length ? MediaModel.find({ _id: { $in: mediaIds } }).select("url alt").lean() : [],
    item.categoryIds?.length
      ? PortfolioCategoryModel.find({ _id: { $in: item.categoryIds } }).select("name slug").lean()
      : [],
    item.doctorId ? DoctorModel.findById(item.doctorId).select("name slug").lean() : null,
  ]);
  const mediaById = new Map<string, PortfolioMedia>(
    (media as PortfolioMedia[]).map((entry) => [String(entry._id), entry]),
  );
  const beforeIds: unknown[] = item.beforeMediaIds || [];
  const afterIds: unknown[] = item.afterMediaIds || [];
  const beforeImages = beforeIds
    .map((id) => mediaById.get(String(id)))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const afterImages = afterIds
    .map((id) => mediaById.get(String(id)))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  const title = localized(item.title);
  const description = sanitizeLocalizedHtml(localized(item.description));
  const treatment = sanitizeLocalizedHtml(localized(item.treatment));
  const categoriesLocalized = categories.map((category) => ({
    id: String(category._id),
    label: localized(category.name),
  }));
  const displayCategories = categoriesLocalized
    .map((category) => category.label.fa || category.label.en)
    .filter(Boolean);
  const sections = [
    { id: "case-overview", label: { fa: "درباره این نمونه‌کار", en: "About this case" }, visible: hasContent(description) },
    { id: "treatment-details", label: { fa: "شرح درمان", en: "Treatment details" }, visible: hasContent(treatment) },
    { id: "case-gallery", label: { fa: "گالری تصاویر", en: "Image gallery" }, visible: beforeImages.length + afterImages.length > 2 },
    { id: "portfolio-feedback", label: { fa: "دیدگاه و امتیاز", en: "Reviews & rating" }, visible: item.commentSettings?.enabled === true },
  ].filter((section) => section.visible);

  return (
    <main className="portfolio-detail-page">
      <nav className="portfolio-detail-breadcrumb" aria-label="مسیر صفحه">
        <Link href="/"><Localized value={{ fa: "صفحه اصلی", en: "Home" }} /></Link>
        <span aria-hidden="true">/</span>
        <Link href="/portfolio"><Localized value={{ fa: "نمونه‌کارها", en: "Portfolio" }} /></Link>
        <span aria-hidden="true">/</span>
        <span><Localized value={title} /></span>
      </nav>

      <header className="portfolio-detail-hero">
        <div className="portfolio-detail-hero-copy">
          <span className="portfolio-detail-eyebrow"><Sparkles size={15} aria-hidden="true" /><Localized value={{ fa: "داستان یک لبخند", en: "A smile story" }} /></span>
          <h1><Localized value={title} /></h1>
          {hasContent(description) && <div className="portfolio-detail-summary"><Localized value={description} html /></div>}
          {displayCategories.length > 0 && (
            <div className="portfolio-detail-tags">
              {displayCategories.map((label) => <span key={label}>{label}</span>)}
            </div>
          )}
          <a className="portfolio-detail-scroll-link" href="#case-comparison">
            <Localized value={{ fa: "دیدن نتیجه درمان", en: "See the results" }} />
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="portfolio-detail-hero-note">
          <span className="portfolio-detail-note-icon"><CheckCircle2 size={23} aria-hidden="true" /></span>
          <div>
            <strong><Localized value={{ fa: "مقایسه قبل و بعد", en: "Before & after comparison" }} /></strong>
            <p><Localized value={{ fa: "برای بررسی جزئیات، دستگیره وسط تصویر را بکشید.", en: "Drag the handle across the image to compare the result." }} /></p>
          </div>
        </div>
      </header>

      {beforeImages[0] || afterImages[0] ? (
        <section className="portfolio-detail-comparison" id="case-comparison" aria-label="مقایسه تصاویر قبل و بعد درمان">
          <div className="portfolio-detail-section-heading">
            <span className="portfolio-detail-section-icon"><Images size={20} aria-hidden="true" /></span>
            <div>
              <span className="portfolio-detail-kicker"><Localized value={{ fa: "نتیجه درمان", en: "The result" }} /></span>
              <h2><Localized value={{ fa: "قبل و بعد از درمان", en: "Before & after treatment" }} /></h2>
            </div>
          </div>
          <BeforeAfterSlider
            beforeUrl={beforeImages[0]?.url}
            afterUrl={afterImages[0]?.url}
            title={title.fa || title.en || slug}
            number="01"
          />
        </section>
      ) : null}

      {sections.length > 0 && (
        <nav className="portfolio-detail-toc" aria-label="بخش‌های نمونه‌کار">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}><Localized value={section.label} /></a>
          ))}
        </nav>
      )}

      <div className={`portfolio-detail-layout ${sections.length === 0 ? "portfolio-detail-layout-no-toc" : ""}`}>
        <div className="portfolio-detail-content">
          {hasContent(description) && (
            <section className="portfolio-detail-section" id="case-overview">
              <div className="portfolio-detail-section-heading">
                <span className="portfolio-detail-section-icon"><Sparkles size={20} aria-hidden="true" /></span>
                <div>
                  <span className="portfolio-detail-kicker"><Localized value={{ fa: "معرفی پرونده", en: "Case overview" }} /></span>
                  <h2><Localized value={{ fa: "درباره این نمونه‌کار", en: "About this case" }} /></h2>
                </div>
              </div>
              <div className="portfolio-detail-rich-content"><Localized value={description} html /></div>
            </section>
          )}

          {hasContent(treatment) && (
            <section className="portfolio-detail-section portfolio-detail-treatment" id="treatment-details">
              <div className="portfolio-detail-section-heading">
                <span className="portfolio-detail-section-icon"><CheckCircle2 size={20} aria-hidden="true" /></span>
                <div>
                  <span className="portfolio-detail-kicker"><Localized value={{ fa: "مراحل انجام‌شده", en: "Care provided" }} /></span>
                  <h2><Localized value={{ fa: "شرح درمان", en: "Treatment details" }} /></h2>
                </div>
              </div>
              <div className="portfolio-detail-rich-content"><Localized value={treatment} html /></div>
            </section>
          )}

          {beforeImages.length + afterImages.length > 2 && (
            <section className="portfolio-detail-section" id="case-gallery">
              <div className="portfolio-detail-section-heading">
                <span className="portfolio-detail-section-icon"><Images size={20} aria-hidden="true" /></span>
                <div>
                  <span className="portfolio-detail-kicker"><Localized value={{ fa: "تصاویر پرونده", en: "Case images" }} /></span>
                  <h2><Localized value={{ fa: "گالری تصاویر", en: "Image gallery" }} /></h2>
                </div>
              </div>
              <div className="portfolio-detail-gallery">
                {beforeImages.slice(1).map((image, index) => (
                  <figure key={`before-${String(image._id)}`}>
                    <Image src={image.url} alt={image.alt?.fa || `تصویر ${index + 2} قبل از درمان`} width={720} height={520} unoptimized />
                    <figcaption><Localized value={{ fa: `قبل از درمان · ${index + 2}`, en: `Before treatment · ${index + 2}` }} /></figcaption>
                  </figure>
                ))}
                {afterImages.slice(1).map((image, index) => (
                  <figure key={`after-${String(image._id)}`}>
                    <Image src={image.url} alt={image.alt?.fa || `تصویر ${index + 2} بعد از درمان`} width={720} height={520} unoptimized />
                    <figcaption><Localized value={{ fa: `بعد از درمان · ${index + 2}`, en: `After treatment · ${index + 2}` }} /></figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

          <ContentFeedback
            targetId={String(item._id)}
            targetType="portfolio"
            contentLabel="نمونه‌کار"
            commentsEnabled={item.commentSettings?.enabled === true}
            ratingEnabled={item.commentSettings?.allowRating === true}
          />
        </div>

        <aside className="portfolio-detail-aside">
          <section className="portfolio-detail-aside-card">
            <span className="portfolio-detail-aside-icon"><CheckCircle2 size={21} aria-hidden="true" /></span>
            <span className="portfolio-detail-kicker"><Localized value={{ fa: "پرونده درمان", en: "Treatment case" }} /></span>
            <h2><Localized value={{ fa: "نمونه‌کار کلینیک", en: "Clinic portfolio" }} /></h2>
            <p><Localized value={{ fa: "این نمونه‌کار با رعایت حریم خصوصی و با رضایت بیمار منتشر شده است.", en: "This case is shared with the patient's consent and with privacy in mind." }} /></p>
            {doctor && (
              <div className="portfolio-detail-doctor">
                <UserRound size={17} aria-hidden="true" />
                <span><Localized value={{ fa: "پزشک:", en: "Doctor:" }} /></span>
                <strong><Localized value={localized(doctor.name)} /></strong>
              </div>
            )}
            {displayCategories.length > 0 && (
              <div className="portfolio-detail-aside-categories">
                <span><Localized value={{ fa: "دسته‌بندی", en: "Categories" }} /></span>
                <strong>{displayCategories.join("، ")}</strong>
              </div>
            )}
            <Link className="portfolio-detail-back-link" href="/portfolio">
              <Localized value={{ fa: "مشاهده همه نمونه‌کارها", en: "Browse all cases" }} />
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </section>
        </aside>
      </div>
    </main>
  );
}
