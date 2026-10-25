import { 
  ServiceModel, 
  DoctorModel, 
  BlogPostModel, 
  PortfolioItemModel, 
  PortfolioCategoryModel, 
  TestimonialModel 
} from "@/models";
import { connectDB } from "@/lib/db";
import { SampleHero } from "@/components/sample-home/SampleHero";
import { SampleServices } from "@/components/sample-home/SampleServices";
import { SampleAboutRefined } from "@/components/sample-home/SampleAboutRefined";
import { SamplePortfolio } from "@/components/sample-home/SamplePortfolio";
import { SamplePromoBannerOptions } from "@/components/sample-home/SamplePromoBannerOptions";
import { SampleVideoDeck } from "@/components/sample-home/SampleVideoDeck";
import { SampleReviewsMarquee } from "@/components/sample-home/SampleReviewsMarquee";
import { SampleDoctors } from "@/components/sample-home/SampleDoctors";
import { HomeBookingWidget } from "@/components/home/HomeBookingWidget";
import { SampleBlog } from "@/components/sample-home/SampleBlog";
import { SampleCollapsibleGuideFaq } from "@/components/sample-home/SampleCollapsibleGuideFaq";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let services: any[] = [];
  let doctors: any[] = [];
  let posts: any[] = [];
  let portfolioItems: any[] = [];
  let portfolioCategories: any[] = [];
  let testimonials: any[] = [];

  try {
    await connectDB();
    const [
      rawServices,
      rawDoctors,
      rawPosts,
      rawPortfolioItems,
      rawPortfolioCategories,
      rawTestimonials,
    ] = await Promise.all([
      ServiceModel.find({ status: "published" }).sort({ createdAt: 1 }).limit(12).lean().catch(() => []),
      DoctorModel.find({ status: "published" }).sort({ createdAt: 1 }).limit(6).lean().catch(() => []),
      BlogPostModel.find({ status: "published" }).sort({ publishedAt: -1, createdAt: -1 }).limit(6).lean().catch(() => []),
      PortfolioItemModel.find({ status: "published" }).populate("categoryIds").sort({ createdAt: -1 }).limit(10).lean().catch(() => []),
      PortfolioCategoryModel.find().sort({ createdAt: 1 }).limit(10).lean().catch(() => []),
      TestimonialModel.find({ status: "published" }).sort({ sortOrder: 1, createdAt: -1 }).limit(20).lean().catch(() => []),
    ]);

    services = rawServices;
    doctors = rawDoctors.length > 0 ? rawDoctors : await DoctorModel.find().limit(6).lean().catch(() => []);
    posts = rawPosts;
    portfolioItems = rawPortfolioItems;
    portfolioCategories = rawPortfolioCategories;
    testimonials = rawTestimonials;
  } catch (err) {
    console.error("Database loading error in HomePage:", err);
  }

  // Format services from database
  const formattedServices = services.map((s: any) => ({
    _id: String(s._id),
    slug: s.slug,
    title: {
      fa: s.title?.fa || s.slug,
      en: s.title?.en || "",
    },
    excerpt: {
      fa: s.excerpt?.fa || "",
      en: s.excerpt?.en || "",
    },
    category: s.category || "cosmetic",
    duration: s.duration || "۱ جلسه",
    warranty: s.warranty || "گارانتی اصالت",
    image: s.image || undefined,
  }));

  // Format doctors from database
  const formattedDoctors = doctors.map((d: any) => ({
    _id: String(d._id),
    slug: d.slug,
    name: {
      fa: d.name?.fa || "",
      en: d.name?.en || "",
    },
    shortBio: {
      fa: d.shortBio?.fa || "",
      en: d.shortBio?.en || "",
    },
    specialty: d.specialty || "متخصص دندانپزشکی",
    medicalCode: d.medicalCode || "کد نظام پزشکی",
    university: d.university?.fa || "دانشگاه علوم پزشکی",
    clinicDays: d.clinicDays || "روزهای حضور: شنبه تا چهارشنبه",
    image: d.image || undefined,
  }));

  // Format blog posts from database
  const formattedPosts = posts.map((p: any) => ({
    _id: String(p._id),
    slug: p.slug,
    title: {
      fa: p.title?.fa || "",
      en: p.title?.en || "",
    },
    excerpt: {
      fa: p.excerpt?.fa || "",
      en: p.excerpt?.en || "",
    },
    category: p.category || "مقاله آموزشی",
    readTime: p.readTime || "۴ دقیقه مطالعه",
    date: p.date || "جدید",
    image: p.coverUrl || undefined,
  }));

  // Format portfolio categories from database
  const formattedPortfolioCats = portfolioCategories.map((c: any) => ({
    slug: c.slug,
    name: {
      fa: c.name?.fa || c.slug,
      en: c.name?.en || "",
    },
  }));

  // Format portfolio items from database
  const formattedPortfolio = portfolioItems.map((p: any) => {
    const firstCat = Array.isArray(p.categoryIds) && p.categoryIds[0] ? p.categoryIds[0] : null;
    return {
      _id: String(p._id),
      slug: p.slug,
      title: {
        fa: p.title?.fa || "",
        en: p.title?.en || "",
      },
      description: {
        fa: p.description?.fa || "",
        en: p.description?.en || "",
      },
      treatment: {
        fa: p.treatment?.fa || "",
        en: p.treatment?.en || "",
      },
      categorySlug: firstCat?.slug || "smile",
      categoryName: firstCat?.name?.fa || "زیبایی لبخند",
      images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [],
      beforeImage: p.beforeImage || (Array.isArray(p.images) && p.images[1]) || "",
      afterImage: p.afterImage || (Array.isArray(p.images) && p.images[0]) || "",
      featureTitle: p.featureTitle || p.title?.fa || "",
      featureSubtitle: p.featureSubtitle || p.description?.fa || "",
    };
  });

  // Format testimonials from database
  const formattedTestimonials = testimonials.map((t: any) => ({
    _id: String(t._id),
    patientName: {
      fa: typeof t.patientName === "string" ? t.patientName : t.patientName?.fa || "مراجعه‌کننده",
      en: t.patientName?.en || "",
    },
    treatment: {
      fa: typeof t.treatment === "string" ? t.treatment : t.treatment?.fa || "درمان دندانپزشکی",
      en: t.treatment?.en || "",
    },
    comment: {
      fa: typeof t.comment === "string" ? t.comment : t.comment?.fa || "",
      en: t.comment?.en || "",
    },
    rating: Number(t.rating) || 5,
    videoUrl: t.videoUrl || "",
    coverImageUrl: t.coverImageUrl || "",
    featured: Boolean(t.featured),
  }));

  return (
    <main className="home-page min-h-screen text-[#302A21] selection:bg-[#404c34]/20 selection:text-[#625D45] relative">
      {/* ۱. هیرو (Hero) */}
      <SampleHero />

      <div className="service-about-group">
        {/* ۲. خدمات (Services) */}
        <SampleServices services={formattedServices} />

        <SampleAboutRefined />
      </div>

      {/* ۴. نمونه‌کارها تب‌بندی (Portfolio with tabs) */}
      <SamplePortfolio 
        items={formattedPortfolio} 
        categories={formattedPortfolioCats} 
      />

      <SamplePromoBannerOptions />

      {/* ۵. رضایت مشتریان ویدئویی به صورت کارت‌های ورق‌خور (Video Deck) */}
      <SampleVideoDeck testimonials={formattedTestimonials} />

      {/* ۶. رضایت مشتریان متنی متحرک (Moving text reviews marquee) */}
      <SampleReviewsMarquee testimonials={formattedTestimonials} />

      {/* ۷. معرفی پزشکان (Doctors) */}
      <SampleDoctors doctors={formattedDoctors} />

      {/* ۸. رزرو نوبت آنلاین دقیقاً مانند کانتینر /home2 متصل به پایگاه داده */}
      <HomeBookingWidget services={formattedServices} />

      {/* ۹. وبلاگ (Blog Journal) */}
      <SampleBlog posts={formattedPosts} />

      {/* ۱۰. سکشن تاشو توضیحات + سوالات متداول (Collapsible ~300px preview with gradient and button) */}
      <SampleCollapsibleGuideFaq />
    </main>
  );
}
