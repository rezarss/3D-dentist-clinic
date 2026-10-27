import Image from "next/image";
import Link from "next/link";
import { Types } from "mongoose";
import { ArrowLeft, BookOpenText, Sparkles } from "lucide-react";
import { Localized } from "@/components/i18n/Localized";
import { connectDB } from "@/lib/db";
import { BlogCategoryModel, BlogPostModel, MediaModel } from "@/models";
import { BlogControls, BlogPagination } from "./BlogControls";

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
  const stripMarkup = (text: string) => text
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

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(new Date(value));
}

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const requestedPage = parsePositiveInteger(params.page, 1);
  const requestedPerPage = parsePositiveInteger(params.perPage, 10);
  const perPage = pageSizes.includes(requestedPerPage) ? requestedPerPage : 10;
  const search = params.search?.trim().slice(0, 100) || "";
  const categoryId = params.categoryId || "";

  await connectDB();
  const filter: Record<string, unknown> = { status: "published" };
  if (categoryId && Types.ObjectId.isValid(categoryId)) filter.categoryIds = categoryId;
  if (search) {
    const matcher = { $regex: escapeRegex(search), $options: "i" };
    filter.$or = [
      { "title.fa": matcher },
      { "title.en": matcher },
      { "excerpt.fa": matcher },
      { "excerpt.en": matcher },
      { "content.fa": matcher },
      { "content.en": matcher },
      { slug: matcher },
    ];
  }

  const [totalItems, categories] = await Promise.all([
    BlogPostModel.countDocuments(filter),
    BlogCategoryModel.find().sort({ "name.fa": 1 }).select("_id name slug").lean(),
  ]);
  const pageCount = Math.max(1, Math.ceil(totalItems / perPage));
  const page = Math.min(requestedPage, pageCount);
  const posts = await BlogPostModel.find(filter)
    .sort({ publishedAt: -1, createdAt: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .lean();

  const mediaIds = posts.flatMap((post) => post.coverMediaId ? [post.coverMediaId] : []);
  const media = mediaIds.length
    ? await MediaModel.find({ _id: { $in: mediaIds } }).select("url").lean()
    : [];
  const mediaById = new Map(media.map((item) => [String(item._id), item.url]));
  const categoryById = new Map<string, string>(categories.map((category) => [
    String(category._id),
    category.name?.fa || category.name?.en || category.slug,
  ]));
  const categoryOptions = categories.map((category) => ({
    id: String(category._id),
    label: category.name?.fa || category.name?.en || category.slug,
  }));

  return (
    <main className="services-page blog-page">
      <header className="services-heading">
        <div className="services-heading-copy">
          <span className="services-eyebrow"><BookOpenText size={15} aria-hidden="true" /> مجله و دانستنی‌های دندانپزشکی</span>
          <h1>آگاهی بیشتر، لبخندی سالم‌تر</h1>
          <p>مقاله‌های کاربردی کلینیک دربارهٔ مراقبت دهان و دندان، درمان‌ها و سلامت لبخند.</p>
        </div>
        <Link className="services-home-link" href="/">
          صفحه اصلی
          <ArrowLeft size={16} aria-hidden="true" />
        </Link>
      </header>

      <BlogControls
        search={search}
        categoryId={categoryId}
        categories={categoryOptions}
        perPage={perPage}
      />

      {posts.length > 0 ? (
        <div className="services-grid blog-grid">
          {posts.map((post, index) => {
            const title = plainLocalized(post.title);
            const excerpt = plainText(post.excerpt);
            const categoryIds: unknown[] = post.categoryIds || [];
            const categoryLabels = categoryIds
              .map((id) => categoryById.get(String(id)))
              .filter((label): label is string => Boolean(label));
            const coverUrl = post.coverMediaId ? mediaById.get(String(post.coverMediaId)) : undefined;
            const publishedDate = post.publishedAt || post.createdAt;

            return (
              <article className="service-card blog-card" key={String(post._id)}>
                <Link className="service-card-cover" href={`/blog/${post.slug}`} aria-label={title.fa || title.en || post.slug}>
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
                    <span className="service-card-placeholder" aria-hidden="true"><BookOpenText size={42} strokeWidth={1.3} /></span>
                  )}
                  <span className="service-card-cover-shade" />
                  <span className="service-card-number">{String((page - 1) * perPage + index + 1).padStart(2, "0")}</span>
                </Link>
                <div className="service-card-content">
                  {categoryLabels.length > 0 && <div className="blog-card-categories">{categoryLabels.join("، ")}</div>}
                  <h2><Link href={`/blog/${post.slug}`}><Localized value={title} /></Link></h2>
                  <p><Localized value={excerpt} /></p>
                  <div className="blog-card-date">{formatDate(publishedDate)}</div>
                  <Link className="service-card-link" href={`/blog/${post.slug}`}>
                    مطالعه مقاله
                    <ArrowLeft size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

      ) : (
        <div className="services-empty">
          <span className="services-empty-icon"><Sparkles size={28} aria-hidden="true" /></span>
          <h2>مقاله‌ای برای نمایش پیدا نشد</h2>
          <p>عبارت جست‌وجو یا دسته‌بندی را تغییر دهید.</p>
        </div>
      )}
      {posts.length > 0 && (
        <BlogPagination page={page} perPage={perPage} totalItems={totalItems} search={search} categoryId={categoryId} />
      )}
    </main>
  );
}
