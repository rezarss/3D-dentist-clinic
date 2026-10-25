import { ServiceModel, DoctorModel, BlogPostModel } from "@/models";
import { connectDB } from "@/lib/db";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeTechnology } from "@/components/home/HomeTechnology";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeDoctors } from "@/components/home/HomeDoctors";
import { HomePortfolio } from "@/components/home/HomePortfolio";
import { HomeJournal } from "@/components/home/HomeJournal";
import { HomeBookingWidget } from "@/components/home/HomeBookingWidget";
import { HomeFaq } from "@/components/home/HomeFaq";
import { ScrollProgressWaypoints } from "@/components/home/ScrollProgressWaypoints";

export const dynamic = "force-dynamic";

export default async function Home2Page() {
  let services: any[] = [];
  let doctors: any[] = [];
  let posts: any[] = [];

  try {
    await connectDB();
    [services, doctors, posts] = await Promise.all([
      ServiceModel.find({ status: "published" }).sort({ createdAt: 1 }).limit(9).lean().catch(() => []),
      DoctorModel.find({ status: "published" }).sort({ createdAt: 1 }).limit(6).lean().catch(() => []),
      BlogPostModel.find({ status: "published" }).sort({ publishedAt: -1, createdAt: -1 }).limit(3).lean().catch(() => []),
    ]);
  } catch {
    // MongoDB connected
  }

  // Format services if present in database
  const formattedServices = services?.map((s: any) => ({
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
    suitableFor: s.suitableFor?.fa || "",
  })) || [];

  // Format doctors if present in database
  const formattedDoctors = doctors?.map((d: any) => ({
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
    clinicDays: d.clinicDays || "روزهای حضور: هماهنگی با پذیرش",
    image: d.image || undefined,
  })) || [];

  // Format blog posts if present in database
  const formattedPosts = posts?.map((p: any) => ({
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
    category: p.category || "مقاله علمی",
    readTime: p.readTime || "۴ دقیقه مطالعه",
    date: p.date || "جدید",
    image: p.coverUrl || undefined,
  })) || [];

  return (
    <main className="min-h-screen bg-white text-[#302A21] selection:bg-[#404c34]/20 selection:text-[#625D45] relative">
      {/* ناوبری ظریف ستونی نقاط اسکرول */}
      <ScrollProgressWaypoints />

      {/* ۱. هیرو تمام‌صفحه با پس‌زمینه کلینیک و ویژوال انیمیشنی سفر لبخند */}
      <HomeHero />

      {/* ۲. بخش تکنولوژی و دقت میکرونی دیجیتال */}
      <HomeTechnology />

      {/* ۳. ویجت نوبت‌دهی آنلاین اختصاصی کلینیک */}
      <HomeBookingWidget services={formattedServices} />

      {/* ۴. بخش خدمات تخصصی با گرید آیکونی */}
      <HomeServices services={formattedServices} />

      {/* ۵. کادر دندانپزشکان مجرب و دلسوز */}
      <HomeDoctors doctors={formattedDoctors} />

      {/* ۶. گالری و اسلایدر مقایسه‌ای Before & After */}
      <HomePortfolio />

      {/* ۷. مجله و مقالات سلامت دهان و دندان */}
      <HomeJournal posts={formattedPosts} />

      {/* ۸. پاسخ به پرسش‌های متداول بالینی */}
      <HomeFaq />
    </main>
  );
}
