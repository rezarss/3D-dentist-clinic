import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  HeartPulse,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ServiceModel, MediaModel } from "@/models";
import { sanitizeLocalizedHtml } from "@/lib/sanitize";
import { Localized } from "@/components/i18n/Localized";
import { connectDB } from "@/lib/db";
import { ContentFeedback } from "@/components/ContentFeedback";

type Props = { params: Promise<{ slug: string }> };
type LocalizedValue = { fa: string; en: string };
type ServiceRecord = {
  slug: string;
  title?: LocalizedValue;
  excerpt?: LocalizedValue;
  content?: LocalizedValue;
  suitableFor?: LocalizedValue;
  benefits?: LocalizedValue;
  limitations?: LocalizedValue;
  careInstructions?: LocalizedValue;
  faqs?: { question?: LocalizedValue; answer?: LocalizedValue }[];
  coverMediaId?: { toString(): string } | string | null;
  coverMediaUrl?: string;
  _id?: { toString(): string };
  commentSettings?: { enabled?: boolean; allowRating?: boolean };
  seo?: {
    title?: LocalizedValue;
    description?: LocalizedValue;
    canonical?: LocalizedValue;
    robots?: { index?: boolean; follow?: boolean };
    ogTitle?: LocalizedValue;
    ogDescription?: LocalizedValue;
  };
};

const defaultServicesMap: Record<string, ServiceRecord> = {
  implant: {
    slug: "implant",
    title: { fa: "ایمپلنت دندان", en: "Dental Implants" },
    excerpt: { fa: "کاشت دندان با جدیدترین تکنیک‌ها و ماندگاری بسیار بالا", en: "Dental implants with advanced techniques and long-term durability" },
    content: { fa: "<p>ایمپلنت دندان جایگزینی دائمی و مقاوم برای ریشه دندان از دست رفته است و ظاهری کاملاً طبیعی ایجاد می‌کند.</p>", en: "<p>Dental implants are permanent fixtures replacing the root of missing teeth, providing natural aesthetics and function.</p>" },
    suitableFor: { fa: "<p>افرادی که به دلیل تروما یا پوسیدگی دندان خود را از دست داده‌اند و سلامت عمومی لثه دارند.</p>", en: "<p>Patients who have lost teeth due to trauma or decay and have healthy gums.</p>" },
    benefits: { fa: "<p>حفظ ساختار استخوان فک، عدم آسیب به دندان‌های مجاور، طول عمر بسیار بالا.</p>", en: "<p>Preserves jawbone density, protects adjacent teeth, and offers lifelong durability.</p>" },
    limitations: { fa: "<p>در افراد با دیابت کنترل‌نشده یا مصرف‌کنندگان خاص داروها نیاز به ارزیابی دقیق‌تر دارد.</p>", en: "<p>Requires consultation in patients with uncontrolled diabetes or bone-related conditions.</p>" },
    careInstructions: { fa: "<p>استفاده منظم از نخ دندان و واترپیک و ویزیت‌های دوره‌ای ۶ ماهه.</p>", en: "<p>Regular flossing, water flosser usage, and biannual dental examinations.</p>" },
  },
  laminate: {
    slug: "laminate",
    title: { fa: "لمینت سرامیکی", en: "Ceramic Laminates" },
    excerpt: { fa: "اصلاح طرح لبخند با لمینت‌های سرامیکی طبیعی و درخشان", en: "Smile makeover with ultra-thin natural ceramic veneers" },
    content: { fa: "<p>پوسته‌های ظریف و مستحکم سرامیکی که برای اصلاح رنگ، فرم و فواصل دندان‌ها طراحی می‌شوند.</p>", en: "<p>Thin, durable ceramic shells custom-crafted to enhance tooth shade, shape, and alignment.</p>" },
    suitableFor: { fa: "<p>افرادی که به دنبال لبخندی درخشان، یکنواخت و هماهنگ هستند.</p>", en: "<p>Patients seeking a harmonious, radiant, and symmetrical smile.</p>" },
    benefits: { fa: "<p>مقاومت فوق‌العاده در برابر تغییر رنگ، درخشندگی طبیعی مشابه مینای دندان.</p>", en: "<p>Superior stain resistance and lifelike optical translucency.</p>" },
    limitations: { fa: "<p>در موارد دندان‌قروچه شدید نیاز به استفاده از نایت‌گارد است.</p>", en: "<p>Night guard recommended for patients with bruxism.</p>" },
    careInstructions: { fa: "<p>رعایت بهداشت دهان و پرهیز از اعمال فشار شدید به لبه دندان‌ها.</p>", en: "<p>Practice standard oral hygiene and avoid biting hard objects.</p>" },
  },
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

async function getService(slug: string): Promise<ServiceRecord | null> {
  try {
    await connectDB();
    const service = await ServiceModel.findOne({ slug, status: "published" }).lean();
    if (service) {
      const cover = service.coverMediaId
        ? await MediaModel.findById(service.coverMediaId).select("url").lean()
        : null;
      return { ...service, coverMediaUrl: cover?.url || "" };
    }
  } catch {
    return defaultServicesMap[slug] || null;
  }
  return defaultServicesMap[slug] || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let service: ServiceRecord | null = null;
  try {
    await connectDB();
    service = await ServiceModel.findOne({ slug, status: "published" }).lean();
  } catch {}
  if (!service) service = defaultServicesMap[slug];
  if (!service) return { title: "Service not found" };
  const title = service.seo?.title?.fa || service.title?.fa || service.title?.en || "Dental Service";
  const description = service.seo?.description?.fa || service.excerpt?.fa || "";
  const canonical = service.seo?.canonical?.fa || undefined;
  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: service.seo?.robots ? { index: service.seo.robots.index, follow: service.seo.robots.follow } : undefined,
    openGraph: { title: service.seo?.ogTitle?.fa || title, description: service.seo?.ogDescription?.fa || description, type: "article", url: canonical },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const title = localized(service.title);
  const excerpt = localized(service.excerpt);
  const content = sanitizeLocalizedHtml(localized(service.content));
  const suitable = sanitizeLocalizedHtml(localized(service.suitableFor));
  const benefits = sanitizeLocalizedHtml(localized(service.benefits));
  const limitations = sanitizeLocalizedHtml(localized(service.limitations));
  const care = sanitizeLocalizedHtml(localized(service.careInstructions));
  const faqs = Array.isArray(service.faqs)
    ? service.faqs.map((faq: { question?: LocalizedValue; answer?: LocalizedValue }) => ({
        question: localized(faq.question),
        answer: sanitizeLocalizedHtml(localized(faq.answer)),
      })).filter((faq: { question: LocalizedValue; answer: LocalizedValue }) => hasContent(faq.question))
    : [];
  const sections = [
    { id: "overview", label: { fa: "معرفی خدمت", en: "Overview" }, visible: hasContent(content) },
    { id: "suitable-for", label: { fa: "مناسب چه کسانی؟", en: "Who is it for?" }, visible: hasContent(suitable) },
    { id: "benefits", label: { fa: "مزایا", en: "Benefits" }, visible: hasContent(benefits) },
    { id: "limitations", label: { fa: "محدودیت‌ها", en: "Limitations" }, visible: hasContent(limitations) },
    { id: "aftercare", label: { fa: "مراقبت‌های بعد از درمان", en: "Aftercare" }, visible: hasContent(care) },
    { id: "faq", label: { fa: "سؤالات متداول", en: "FAQs" }, visible: faqs.length > 0 },
    { id: "service-feedback", label: { fa: "دیدگاه و امتیاز", en: "Reviews & rating" }, visible: service.commentSettings?.enabled === true },
  ].filter((section) => section.visible);
  const bookingHref = `/booking?service=${encodeURIComponent(service.slug)}`;

  return (
    <main className="service-detail-page">
      <nav className="service-detail-breadcrumb" aria-label="مسیر صفحه">
        <Link href="/"><Localized value={{ fa: "خانه", en: "Home" }} /></Link>
        <span aria-hidden="true">/</span>
        <Link href="/services"><Localized value={{ fa: "خدمات", en: "Services" }} /></Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page"><Localized value={title} /></span>
      </nav>

      <header className="service-detail-hero">
        <div className="service-detail-hero-copy">
          <span className="service-detail-eyebrow"><Sparkles size={15} aria-hidden="true" /><Localized value={{ fa: "خدمات تخصصی کلینیک", en: "Specialized dental care" }} /></span>
          <h1><Localized value={title} /></h1>
          {hasContent(excerpt) && <p className="service-detail-excerpt"><Localized value={excerpt} /></p>}
          <div className="service-detail-trust"><ShieldCheck size={17} aria-hidden="true" /><span><Localized value={{ fa: "ارزیابی و برنامه درمانی متناسب با نیاز شما", en: "Care planned around your individual needs" }} /></span></div>
          <Link className="service-detail-primary-cta" href={bookingHref}>
            <CalendarDays size={18} aria-hidden="true" />
            <Localized value={{ fa: "درخواست نوبت", en: "Book an appointment" }} />
            <ArrowLeft size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="service-detail-hero-art" aria-hidden="true">
          {service.coverMediaUrl ? (
            <Image src={service.coverMediaUrl} alt="" fill priority unoptimized sizes="(max-width: 760px) 100vw, 48vw" />
          ) : (
            <div className="service-detail-art-placeholder"><HeartPulse size={82} strokeWidth={1} /></div>
          )}
          <div className="service-detail-art-badge"><Sparkles size={16} /><span><Localized value={{ fa: "لبخندی سالم‌تر", en: "A healthier smile" }} /></span></div>
        </div>
      </header>

      {sections.length > 1 && (
        <nav className="service-detail-toc" aria-label="بخش‌های خدمت">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}><Localized value={section.label} /></a>
          ))}
        </nav>
      )}

      <div className={`service-detail-layout${sections.length <= 1 ? " service-detail-layout-without-toc" : ""}`}>
        <div className="service-detail-content">
          {hasContent(content) && (
            <section className="service-detail-section service-detail-overview" id="overview">
              <div className="service-detail-section-heading">
                <span className="service-detail-section-icon"><HeartPulse size={20} aria-hidden="true" /></span>
                <div><span className="service-detail-kicker"><Localized value={{ fa: "آشنایی با درمان", en: "The treatment" }} /></span><h2><Localized value={{ fa: "دربارهٔ این خدمت", en: "About this treatment" }} /></h2></div>
              </div>
              <Localized value={content} html />
            </section>
          )}

          {hasContent(suitable) && (
            <section className="service-detail-section service-detail-highlight" id="suitable-for">
              <div className="service-detail-section-heading">
                <span className="service-detail-section-icon"><ShieldCheck size={20} aria-hidden="true" /></span>
                <div><span className="service-detail-kicker"><Localized value={{ fa: "ارزیابی اولیه", en: "Initial assessment" }} /></span><h2><Localized value={{ fa: "این درمان برای چه کسانی مناسب است؟", en: "Who may benefit from this treatment?" }} /></h2></div>
              </div>
              <Localized value={suitable} html />
            </section>
          )}

          {(hasContent(benefits) || hasContent(limitations)) && (
            <div className="service-detail-points">
              {hasContent(benefits) && (
                <section className="service-detail-section service-detail-point-card" id="benefits">
                  <div className="service-detail-section-heading">
                    <span className="service-detail-section-icon service-detail-icon-positive"><Check size={20} aria-hidden="true" /></span>
                    <div><span className="service-detail-kicker"><Localized value={{ fa: "نکات مثبت", en: "What to expect" }} /></span><h2><Localized value={{ fa: "مزایای درمان", en: "Benefits" }} /></h2></div>
                  </div>
                  <Localized value={benefits} html />
                </section>
              )}
              {hasContent(limitations) && (
                <section className="service-detail-section service-detail-point-card" id="limitations">
                  <div className="service-detail-section-heading">
                    <span className="service-detail-section-icon service-detail-icon-caution"><AlertTriangle size={19} aria-hidden="true" /></span>
                    <div><span className="service-detail-kicker"><Localized value={{ fa: "موارد قابل توجه", en: "Things to consider" }} /></span><h2><Localized value={{ fa: "محدودیت‌ها و ملاحظات", en: "Limitations & considerations" }} /></h2></div>
                  </div>
                  <Localized value={limitations} html />
                </section>
              )}
            </div>
          )}

          {hasContent(care) && (
            <section className="service-detail-section service-detail-aftercare" id="aftercare">
              <div className="service-detail-section-heading">
                <span className="service-detail-section-icon"><Clock3 size={20} aria-hidden="true" /></span>
                <div><span className="service-detail-kicker"><Localized value={{ fa: "برای ماندگاری بهتر", en: "For lasting results" }} /></span><h2><Localized value={{ fa: "مراقبت‌های بعد از درمان", en: "Aftercare instructions" }} /></h2></div>
              </div>
              <Localized value={care} html />
            </section>
          )}

          {faqs.length > 0 && (
            <section className="service-detail-section service-detail-faq" id="faq">
              <div className="service-detail-section-heading">
                <span className="service-detail-section-icon"><CircleHelp size={20} aria-hidden="true" /></span>
                <div><span className="service-detail-kicker"><Localized value={{ fa: "پاسخ پرسش‌های شما", en: "Helpful answers" }} /></span><h2><Localized value={{ fa: "سؤالات متداول", en: "Frequently asked questions" }} /></h2></div>
              </div>
              <div className="service-detail-faq-list">
                {faqs.map((faq: { question: LocalizedValue; answer: LocalizedValue }, index: number) => (
                  <details className="service-detail-faq-item" key={`${faq.question.fa}-${index}`}>
                    <summary><span>{String(index + 1).padStart(2, "0")}</span><Localized value={faq.question} /><ChevronDown size={18} aria-hidden="true" /></summary>
                    <div className="service-detail-faq-answer"><Localized value={faq.answer} html /></div>
                  </details>
                ))}
              </div>
            </section>
          )}

          <ContentFeedback
            targetId={String(service._id || service.slug)}
            targetType="service"
            contentLabel="خدمت"
            commentsEnabled={service.commentSettings?.enabled === true}
            ratingEnabled={service.commentSettings?.allowRating === true}
          />
        </div>

        <aside className="service-detail-aside">
          <div className="service-detail-booking-card">
            <span className="service-detail-aside-icon"><CalendarDays size={21} aria-hidden="true" /></span>
            <span className="service-detail-kicker"><Localized value={{ fa: "قدم بعدی", en: "Next step" }} /></span>
            <h2><Localized value={{ fa: "برای مشاوره و نوبت اقدام کنید", en: "Ready to take the next step?" }} /></h2>
            <p><Localized value={{ fa: "برای بررسی شرایط و انتخاب زمان مناسب، درخواست نوبت خود را ثبت کنید.", en: "Request an appointment to discuss your needs and find a suitable time." }} /></p>
            <Link className="service-detail-primary-cta" href={bookingHref}>
              <Localized value={{ fa: "رزرو نوبت", en: "Request an appointment" }} />
              <ArrowLeft size={17} aria-hidden="true" />
            </Link>
            <div className="service-detail-aside-note"><ShieldCheck size={16} aria-hidden="true" /><span><Localized value={{ fa: "انتخاب روش درمان پس از بررسی و مشاوره انجام می‌شود.", en: "Treatment options are discussed after a professional assessment." }} /></span></div>
          </div>
          <Link className="service-detail-back-link" href="/services">
            <ArrowLeft size={16} aria-hidden="true" />
            <Localized value={{ fa: "مشاهده همهٔ خدمات", en: "Browse all services" }} />
          </Link>
        </aside>
      </div>
    </main>
  );
}
