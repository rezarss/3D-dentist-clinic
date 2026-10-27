import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BookOpenText, CalendarDays, MessageCircle, Sparkles } from "lucide-react";
import { BlogCategoryModel, BlogPostModel, MediaModel } from "@/models";
import { sanitizeLocalizedHtml } from "@/lib/sanitize";
import { Localized } from "@/components/i18n/Localized";
import { connectDB } from "@/lib/db";
import { ContentFeedback } from "@/components/ContentFeedback";

type Props = { params: Promise<{ slug: string }> };
type LocalizedValue = { fa: string; en: string };

function localized(value?: { fa?: string; en?: string } | null): LocalizedValue {
  return {
    fa: typeof value?.fa === "string" ? value.fa : "",
    en: typeof value?.en === "string" ? value.en : "",
  };
}

async function getPost(slug: string) {
  await connectDB();
  const post = await BlogPostModel.findOne({ slug, status: "published" }).lean();
  if (!post) return null;

  const [cover, categories] = await Promise.all([
    post.coverMediaId ? MediaModel.findById(post.coverMediaId).select("url").lean() : null,
    post.categoryIds?.length
      ? BlogCategoryModel.find({ _id: { $in: post.categoryIds } }).select("name slug").lean()
      : [],
  ]);
  return { post, coverUrl: cover?.url || "", categories };
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(new Date(value));
}

function readingTime(content: LocalizedValue) {
  const text = `${content.fa} ${content.en}`.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return Math.max(1, Math.ceil(text.split(" ").filter(Boolean).length / 200));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPost(slug);
  if (!data) return { title: "مقاله پیدا نشد" };

  const title = data.post.seo?.title?.fa || data.post.title?.fa || data.post.title?.en || "مقاله دندانپزشکی";
  const description = data.post.seo?.description?.fa || data.post.excerpt?.fa || "";
  const canonical = data.post.seo?.canonical?.fa || undefined;
  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: data.post.seo?.robots ? { index: data.post.seo.robots.index, follow: data.post.seo.robots.follow } : undefined,
    openGraph: {
      title: data.post.seo?.ogTitle?.fa || title,
      description: data.post.seo?.ogDescription?.fa || description,
      type: "article",
      url: canonical,
      images: data.coverUrl ? [data.coverUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const data = await getPost(slug);
  if (!data) notFound();

  const { post, coverUrl, categories } = data;
  const title = localized(post.title);
  const excerpt = localized(post.excerpt);
  const content = sanitizeLocalizedHtml(localized(post.content));
  const plainContent = localized(post.content);
  const categoryLabels = categories
    .map((category) => localized(category.name))
    .map((category) => category.fa || category.en)
    .filter(Boolean);
  const date = post.publishedAt || post.createdAt;
  const readMinutes = readingTime(plainContent);
  const sections = [
    { id: "article-content", label: { fa: "متن مقاله", en: "Article" } },
    ...(post.commentSettings?.enabled === true
      ? [{ id: "blog-feedback", label: { fa: "دیدگاه‌ها", en: "Comments" } }]
      : []),
  ];

  return (
    <main className="service-detail-page blog-detail-page">
      <nav className="service-detail-breadcrumb" aria-label="مسیر صفحه">
        <Link href="/"><Localized value={{ fa: "صفحه اصلی", en: "Home" }} /></Link>
        <span aria-hidden="true">/</span>
        <Link href="/blog"><Localized value={{ fa: "مجله", en: "Journal" }} /></Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page"><Localized value={title} /></span>
      </nav>

      <header className="blog-detail-hero">
        <div className="blog-detail-hero-copy">
          <span className="service-detail-eyebrow"><BookOpenText size={15} aria-hidden="true" /> مقاله آموزشی کلینیک</span>
          <h1><Localized value={title} /></h1>
          {(excerpt.fa || excerpt.en) && <p className="service-detail-excerpt"><Localized value={excerpt} /></p>}
          <div className="blog-detail-meta">
            <span><CalendarDays size={15} aria-hidden="true" />{formatDate(date)}</span>
            <span><BookOpenText size={15} aria-hidden="true" />{readMinutes} دقیقه مطالعه</span>
          </div>
          {categoryLabels.length > 0 && (
            <div className="blog-detail-categories">
              {categoryLabels.map((label) => <span key={label}>{label}</span>)}
            </div>
          )}
          <a className="service-detail-primary-cta" href="#article-content">
            <Localized value={{ fa: "مطالعه مقاله", en: "Read article" }} />
            <ArrowLeft size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="blog-detail-hero-cover" aria-hidden="true">
          {coverUrl ? (
            <Image src={coverUrl} alt="" fill priority unoptimized sizes="(max-width: 760px) 100vw, 48vw" />
          ) : (
            <div className="service-detail-art-placeholder"><BookOpenText size={82} strokeWidth={1} /></div>
          )}
          <div className="blog-detail-cover-badge"><Sparkles size={16} /><span>دانستنی‌های دندانپزشکی</span></div>
        </div>
      </header>

      {sections.length > 1 && (
        <nav className="service-detail-toc" aria-label="بخش‌های مقاله">
          {sections.map((section) => <a key={section.id} href={`#${section.id}`}><Localized value={section.label} /></a>)}
        </nav>
      )}

      <div className={`service-detail-layout${sections.length <= 1 ? " service-detail-layout-without-toc" : ""} blog-detail-layout`}>
        <div className="service-detail-content">
          <article className="service-detail-section blog-detail-article" id="article-content">
            <div className="service-detail-section-heading">
              <span className="service-detail-section-icon"><BookOpenText size={20} aria-hidden="true" /></span>
              <div>
                <span className="service-detail-kicker">مجلهٔ کلینیک</span>
                <h2><Localized value={title} /></h2>
              </div>
            </div>
            <Localized value={content} html />
          </article>

          <ContentFeedback
            targetId={String(post._id)}
            targetType="blog"
            contentLabel="مقاله"
            commentsEnabled={post.commentSettings?.enabled === true}
            ratingEnabled={post.commentSettings?.allowRating === true}
          />
        </div>

        <aside className="service-detail-aside">
          <section className="blog-detail-aside-card">
            <span className="service-detail-aside-icon"><MessageCircle size={21} aria-hidden="true" /></span>
            <span className="service-detail-kicker">مطالب آموزشی</span>
            <h2>مطالعه و آگاهی برای لبخندی سالم‌تر</h2>
            <p>مقاله‌های مجله با هدف افزایش آگاهی دربارهٔ مراقبت دهان و دندان تهیه شده‌اند و جایگزین معاینه و مشاوره تخصصی نیستند.</p>
            <div className="blog-detail-aside-meta">
              <span>زمان مطالعه</span>
              <strong>{readMinutes} دقیقه</strong>
            </div>
            {categoryLabels.length > 0 && (
              <div className="blog-detail-aside-categories">
                <span>دسته‌بندی</span>
                <strong>{categoryLabels.join("، ")}</strong>
              </div>
            )}
            <Link className="service-detail-back-link" href="/blog">
              <Localized value={{ fa: "مشاهده همه مقاله‌ها", en: "Browse all articles" }} />
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </section>
          <Link className="blog-detail-services-link" href="/services">
            <span><Sparkles size={17} aria-hidden="true" />آشنایی با خدمات کلینیک</span>
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </main>
  );
}
