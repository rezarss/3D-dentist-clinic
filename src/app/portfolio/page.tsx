import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Types } from "mongoose";
import { Localized } from "@/components/i18n/Localized";
import { PortfolioFilters, PortfolioPagination } from "./PortfolioFilters";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { connectDB } from "@/lib/db";
import { MediaModel, PortfolioCategoryModel, PortfolioItemModel } from "@/models";

export const dynamic = "force-dynamic";

const pageSizes = [10, 20, 50, 100];

type SearchParams = Promise<{ page?: string; perPage?: string; search?: string; categoryId?: string }>;

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

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default async function PortfolioPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const requestedPage = parsePositiveInteger(params.page, 1);
  const requestedPerPage = parsePositiveInteger(params.perPage, 10);
  const perPage = pageSizes.includes(requestedPerPage) ? requestedPerPage : 10;
  const search = params.search?.trim().slice(0, 100) || "";
  const categoryId = params.categoryId || "";

  await connectDB();
  const filter: Record<string, unknown> = {
    status: "published",
    "privacy.consentStatus": "granted",
  };
  if (categoryId && Types.ObjectId.isValid(categoryId)) filter.categoryIds = categoryId;
  if (search) {
    const matcher = { $regex: escapeRegex(search), $options: "i" };
    filter.$or = [
      { "title.fa": matcher },
      { "title.en": matcher },
      { slug: matcher },
      { "description.fa": matcher },
      { "description.en": matcher },
    ];
  }

  const [totalItems, categories] = await Promise.all([
    PortfolioItemModel.countDocuments(filter),
    PortfolioCategoryModel.find().sort({ "name.fa": 1 }).select("_id name slug").lean(),
  ]);
  const pageCount = Math.max(1, Math.ceil(totalItems / perPage));
  const page = Math.min(requestedPage, pageCount);
  const items = await PortfolioItemModel.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .lean();

  const mediaIds = items.flatMap((item) => [
    ...(item.beforeMediaIds?.[0] ? [item.beforeMediaIds[0]] : []),
    ...(item.afterMediaIds?.[0] ? [item.afterMediaIds[0]] : []),
  ]);
  const media = mediaIds.length
    ? await MediaModel.find({ _id: { $in: mediaIds } }).select("url").lean()
    : [];
  const mediaById = new Map(media.map((item) => [String(item._id), item.url]));
  const categoryById = new Map<string, { fa: string; en: string }>(
    categories.map((category) => [String(category._id), plainLocalized(category.name)]),
  );
  const filterCategories = categories.map((category) => ({
    id: String(category._id),
    label: category.name.fa || category.name.en || category.slug,
  }));

  return (
    <main className="services-page portfolio-page">
      <header className="services-heading">
        <div className="services-heading-copy">
          <span className="services-eyebrow"><Sparkles size={15} aria-hidden="true" /> <Localized value={{ fa: "نتایج درمان و زیبایی", en: "Treatment results" }} /></span>
          <h1><Localized value={{ fa: "نمونه‌کارهای کلینیک", en: "Our Dental Cases" }} /></h1>
          <p><Localized value={{ fa: "نمونه‌هایی از درمان‌های انجام‌شده با حفظ حریم خصوصی بیماران را ببینید.", en: "Explore selected treatment cases shared with patient privacy in mind." }} /></p>
        </div>
        <Link className="services-home-link" href="/">
          <Localized value={{ fa: "صفحه اصلی", en: "Home" }} />
          <ArrowLeft size={16} aria-hidden="true" />
        </Link>
      </header>

      <PortfolioFilters search={search} categoryId={categoryId} categories={filterCategories} perPage={perPage} />

      {items.length ? (
        <>
          <div className="services-grid portfolio-grid">
            {items.map((item, index) => {
              const title = plainLocalized(item.title);
              const beforeUrl = item.beforeMediaIds?.[0]
                ? mediaById.get(String(item.beforeMediaIds[0]))
                : undefined;
              const afterUrl = item.afterMediaIds?.[0]
                ? mediaById.get(String(item.afterMediaIds[0]))
                : undefined;
              const categoryIds: unknown[] = item.categoryIds || [];
              const categoryLabels = categoryIds
                .map((id: unknown) => categoryById.get(String(id)))
                .filter((category): category is { fa: string; en: string } => Boolean(category))
                .map((category: { fa: string; en: string }) => category.fa || category.en)
                .filter(Boolean);

              return (
                <article className="service-card portfolio-card" key={String(item._id)}>
                  <BeforeAfterSlider
                    beforeUrl={beforeUrl}
                    afterUrl={afterUrl}
                    title={title.fa || title.en || item.slug}
                    number={String((page - 1) * perPage + index + 1).padStart(2, "0")}
                  />
                  <div className="service-card-content">
                    {categoryLabels.length > 0 && <div className="portfolio-card-categories">{categoryLabels.join("، ")}</div>}
                    <h2><Link href={`/portfolio/${item.slug}`}><Localized value={title} /></Link></h2>
                    <p><Localized value={plainText(item.description)} /></p>
                    <Link className="service-card-link" href={`/portfolio/${item.slug}`}>
                      <Localized value={{ fa: "مشاهده پرونده درمان", en: "View treatment case" }} />
                      <ArrowLeft size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
          <PortfolioPagination page={page} perPage={perPage} totalItems={totalItems} search={search} categoryId={categoryId} />
        </>
      ) : (
        <div className="services-empty">
          <span className="services-empty-icon"><Sparkles size={28} aria-hidden="true" /></span>
          <h2><Localized value={{ fa: "نمونه‌کاری برای نمایش پیدا نشد", en: "No cases found" }} /></h2>
          <p><Localized value={{ fa: "عبارت جست‌وجو یا دسته‌بندی را تغییر دهید.", en: "Try changing your search or category filter." }} /></p>
        </div>
      )}
    </main>
  );
}
