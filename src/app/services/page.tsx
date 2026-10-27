import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Localized } from "@/components/i18n/Localized";
import { ServicesPagination } from "./ServicesPagination";
import { connectDB } from "@/lib/db";
import { MediaModel, ServiceModel } from "@/models";

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

function plainText(value?: { fa?: string; en?: string } | null) {
  const localized = plainLocalized(value);
  const stripMarkup = (text = "") => text
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

  return { fa: stripMarkup(localized.fa), en: stripMarkup(localized.en) };
}

export default async function ServicesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const requestedPage = parsePositiveInteger(params.page, 1);
  const requestedPerPage = parsePositiveInteger(params.perPage, 10);
  const perPage = pageSizes.includes(requestedPerPage) ? requestedPerPage : 10;

  await connectDB();
  const totalItems = await ServiceModel.countDocuments({ status: "published" });
  const pageCount = Math.max(1, Math.ceil(totalItems / perPage));
  const page = Math.min(requestedPage, pageCount);
  const services = await ServiceModel.find({ status: "published" })
    .sort({ createdAt: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .lean();

  const mediaIds = services.flatMap((service) => service.coverMediaId ? [service.coverMediaId] : []);
  const media = mediaIds.length
    ? await MediaModel.find({ _id: { $in: mediaIds } }).select("url").lean()
    : [];
  const mediaById = new Map(media.map((item) => [String(item._id), item.url]));

  return (
    <main className="services-page">
      <header className="services-heading">
        <div className="services-heading-copy">
          <span className="services-eyebrow"><Sparkles size={15} aria-hidden="true" /> <Localized value={{ fa: "مراقبت و زیبایی لبخند", en: "Care for your smile" }} /></span>
          <h1><Localized value={{ fa: "خدمات دندانپزشکی", en: "Dental Services" }} /></h1>
          <p><Localized value={{ fa: "با خدمات تخصصی کلینیک آشنا شوید و بهترین مسیر درمان را برای لبخندتان پیدا کنید.", en: "Explore our specialized treatments and find the right care for your smile." }} /></p>
        </div>
        <Link className="services-home-link" href="/">
          <Localized value={{ fa: "صفحه اصلی", en: "Home" }} />
          <ArrowLeft size={16} aria-hidden="true" />
        </Link>
      </header>

      {services.length ? (
        <>
          <div className="services-grid">
            {services.map((service, index) => {
              const title = plainLocalized(service.title);
              const coverUrl = service.coverMediaId
                ? mediaById.get(String(service.coverMediaId))
                : undefined;

              return (
                <article className="service-card" key={String(service._id)}>
                  <Link
                    className="service-card-cover"
                    href={`/services/${service.slug}`}
                    aria-label={title.fa || title.en || service.slug}
                  >
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt=""
                        width={800}
                        height={520}
                        sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 33vw"
                        unoptimized
                        loading={index < 3 ? "eager" : "lazy"}
                      />
                    ) : (
                      <span className="service-card-placeholder" aria-hidden="true">
                        <Sparkles size={42} strokeWidth={1.3} />
                      </span>
                    )}
                    <span className="service-card-cover-shade" />
                    <span className="service-card-number">{String((page - 1) * perPage + index + 1).padStart(2, "0")}</span>
                  </Link>
                  <div className="service-card-content">
                    <h2><Link href={`/services/${service.slug}`}><Localized value={title} /></Link></h2>
                    <p><Localized value={plainText(service.excerpt)} /></p>
                    <Link className="service-card-link" href={`/services/${service.slug}`}>
                      <Localized value={{ fa: "جزئیات خدمت", en: "Explore treatment" }} />
                      <ArrowLeft size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
          {pageCount > 1 && <ServicesPagination page={page} perPage={perPage} totalItems={totalItems} />}
        </>
      ) : (
        <div className="services-empty">
          <span className="services-empty-icon"><Sparkles size={28} aria-hidden="true" /></span>
          <h2><Localized value={{ fa: "خدمتی برای نمایش وجود ندارد", en: "No services available yet" }} /></h2>
          <p><Localized value={{ fa: "خدمات کلینیک به‌زودی در این بخش قرار می‌گیرند.", en: "Our clinic services will appear here soon." }} /></p>
        </div>
      )}
    </main>
  );
}
