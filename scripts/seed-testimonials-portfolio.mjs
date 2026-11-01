import mongoose from "mongoose";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dentist_clinic";
await mongoose.connect(uri);

const db = mongoose.connection.db;

// 1. Seed Testimonials (ویدئویی و متنی)
const testimonialsCol = db.collection("testimonials");
await testimonialsCol.deleteMany({});

const sampleTestimonials = [
  {
    patientName: { fa: "مریم ابراهیمی", en: "Maryam Ebrahimi" },
    treatment: { fa: "طراحی لبخند و لمینت سرامیکی E-Max", en: "Smile Design & E-Max Laminate" },
    comment: {
      fa: "پس از دریافت مشاوره دقیق و اسکن دیجیتال سه‌بعدی، دقیقاً همان لبخندی که آرزویش را داشتم بدون درد پیاده‌سازی شد. احساس آرامش در تمام جلسات بی‌نظیر بود.",
      en: "The 3D digital smile design turned my dream into reality without any pain."
    },
    rating: 5,
    videoUrl: "https://roshanadental.com/wp-content/uploads/2025/08/%D8%B1%D8%B6%D8%A7%DB%8C%D8%AA-%D8%A8%DB%8C%D9%85%D8%A7%D8%B1.mp4",
    coverImageUrl: "/assets/temp/photo_5996743599535624109_y.jpg",
    status: "published",
    sortOrder: 1,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    patientName: { fa: "علی رضا کاظمی", en: "Alireza Kazemi" },
    treatment: { fa: "ایمپلنت دیجیتال فوری با گاید جراحی", en: "Immediate Guided Implant" },
    comment: {
      fa: "کاشت دندان در کمتر از یک روز با تکنولوژی جراحی هدایت‌شده انجام شد. هیچ خونریزی و تورمی احساس نکردم و توانستم روز بعد به کارم بازگردم.",
      en: "Guided surgery made the implant completely painless and fast."
    },
    rating: 5,
    videoUrl: "https://roshanadental.com/wp-content/uploads/2025/08/%D8%B1%D8%B6%D8%A7%DB%8C%D8%AA-%D8%A8%DB%8C%D9%85%D8%A7%D8%B1-1.mp4",
    coverImageUrl: "/assets/temp/photo_5996743599535624110_y.jpg",
    status: "published",
    sortOrder: 2,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    patientName: { fa: "سارا نیکنام", en: "Sara Niknam" },
    treatment: { fa: "ارتودنسی نامرئی و اصلاح ناهنجاری فک", en: "Clear Aligners & Orthodontics" },
    comment: {
      fa: "برخورد فوق‌العاده صبورانه کادر درمان و برنامه‌ریزی دیجیتال باعث شد طول دوره درمانم به نصف کاهش پیدا کند. بسیار سپاسگزارم.",
      en: "The digital aligners reduced my treatment duration by half."
    },
    rating: 5,
    videoUrl: "https://roshanadental.com/wp-content/uploads/2025/08/video_web_optimized_3mb.mp4",
    coverImageUrl: "/assets/temp/photo_5996743599535624111_y.jpg",
    status: "published",
    sortOrder: 3,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    patientName: { fa: "نگین محمدی", en: "Negin Mohammadi" },
    treatment: { fa: "کامپوزیت ونیر نانوسرامیک", en: "Nano-Ceramic Composite Veneers" },
    comment: {
      fa: "رنگ و فرم دندان‌ها فوق‌العاده طبیعی از آب درآمد. دقت و ظرافت دست دندانپزشک در فرم‌دهی لایه‌ها ستودنی بود.",
      en: "The natural tooth aesthetics and shade matching were exceptional."
    },
    rating: 5,
    videoUrl: "https://roshanadental.com/wp-content/uploads/2025/08/%D8%B1%D8%B6%D8%A7%DB%8C%D8%AA-%D8%AF%D8%AE%D8%AA%D8%B1-%D8%A8%DB%8C%D9%85%D8%A7%D8%B1.mp4",
    coverImageUrl: "/assets/temp/photo_5996743599535624112_y.jpg",
    status: "published",
    sortOrder: 4,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    patientName: { fa: "حسین فیاضی", en: "Hossein Fayyazi" },
    treatment: { fa: "بازسازی کامل فک با پروتز زیرکونیا", en: "Full Mouth Zirconia Restoration" },
    comment: {
      fa: "سال‌ها به دلیل ترس از دندانپزشکی مراجعه نمی‌کردم. سیستم بی‌حسی کامپیوتری و محیط آرام کلینیک ترسم را کاملاً از بین برد.",
      en: "Computerized anesthesia and the calm environment eliminated my dental anxiety."
    },
    rating: 5,
    videoUrl: "https://roshanadental.com/wp-content/uploads/2023/09/%D8%B1%D8%B6%D8%A7%DB%8C%D8%AA-%D8%A8%DB%8C%D9%85%D8%A7%D8%B1-2.mp4",
    coverImageUrl: "/assets/temp/photo_5996743599535624113_y.jpg",
    status: "published",
    sortOrder: 5,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // نمونه‌های تصویری (بدون ویدئو - عکس محور)
  {
    patientName: { fa: "دکتر فرزاد شایگان", en: "Dr. Farzad Shayegan" },
    treatment: { fa: "پروتز ثابت سرامیکی و لمینت", en: "Ceramic Fixed Prosthesis" },
    comment: {
      fa: "دیدن فضای آرام و تخصصی کلینیک و توضیحات علمی پزشک پیش از شروع، اعتماد کاملی در من ایجاد کرد. نتیجه فراتر از انتظار بود.",
      en: "The calm atmosphere and scientific explanation established total trust."
    },
    rating: 5,
    videoUrl: "",
    coverImageUrl: "/assets/temp/photo_5996743599535624114_y.jpg",
    status: "published",
    sortOrder: 6,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    patientName: { fa: "مهندس پارسا معتمدی", en: "Parsa Motamedi" },
    treatment: { fa: "ایمپلنت تک‌دندان قدامی", en: "Anterior Single Implant" },
    comment: {
      fa: "دقت در شبیه‌سازی رنگ دندان مجاور و تناسب بافت لثه شگفت‌انگیز بود. هیچ‌کس متوجه وجود ایمپلنت نمی‌شود.",
      en: "The gingival tissue matching and color simulation are seamless."
    },
    rating: 5,
    videoUrl: "",
    coverImageUrl: "/assets/temp/photo_5996743599535624115_y.jpg",
    status: "published",
    sortOrder: 7,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

await testimonialsCol.insertMany(sampleTestimonials);
console.log(`Inserted ${sampleTestimonials.length} testimonials into MongoDB.`);

// 2. Seed Portfolio Categories & Items
const portCategoriesCol = db.collection("portfoliocategories");
const portItemsCol = db.collection("portfolioitems");
await portCategoriesCol.deleteMany({});
await portItemsCol.deleteMany({});

const categories = [
  {
    slug: "smile",
    name: { fa: "زیبایی لبخند", en: "Smile Aesthetics" },
    description: { fa: "طراحی لبخند، لمینت سرامیکی و کامپوزیت ونیر", en: "Smile Design & Veneers" },
    sortOrder: 1
  },
  {
    slug: "implant",
    name: { fa: "ایمپلنت و پروتز", en: "Implants & Prosthetics" },
    description: { fa: "کاشت دندان دیجیتال، روکش‌های زیرکونیا و بازسازی فک", en: "Digital Implants & Full Restorations" },
    sortOrder: 2
  },
  {
    slug: "align",
    name: { fa: "ارتودنسی", en: "Orthodontics" },
    description: { fa: "ردیف‌کردن دندان‌ها با الاینرهای شفاف و ارتودنسی ثابت", en: "Clear Aligners & Orthodontics" },
    sortOrder: 3
  },
  {
    slug: "care",
    name: { fa: "مراقبت و ترمیم", en: "Care & Restorative" },
    description: { fa: "درمان ریشه با میکروسکوپ، بلیچینگ و ترمیم‌های همرنگ", en: "Endodontics, Whitening & Restorations" },
    sortOrder: 4
  }
];

const insertedCats = await portCategoriesCol.insertMany(categories);
console.log(`Inserted ${Object.keys(insertedCats.insertedIds).length} portfolio categories.`);

const catMap = {};
categories.forEach((c, idx) => {
  catMap[c.slug] = insertedCats.insertedIds[idx];
});

const portfolioItems = [
  // Smile
  {
    slug: "smile-design-case-1",
    title: { fa: "جزئیات در طراحی لبخند طبیعی", en: "Natural Smile Design Details" },
    description: { fa: "اصلاح خط لبخند با ۱۰ واحد لمینت سرامیکی E-Max فوق‌نازک با حفظ کامل مینای دندان.", en: "10-unit ultra-thin E-Max veneers preserving enamel." },
    treatment: { fa: "لمینت سرامیکی E-Max", en: "E-Max Ceramic Veneers" },
    categoryIds: [catMap["smile"]],
    images: [
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=84",
      "https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1612277795421-9bc7706a4a41?auto=format&fit=crop&w=800&q=80"
    ],
    status: "published",
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Implant
  {
    slug: "digital-implant-restoration-case-2",
    title: { fa: "بازسازی عملکرد و زیبایی با ایمپلنت دیجیتال", en: "Full Arch Digital Implant Restoration" },
    description: { fa: "کاشت ۶ واحد ایمپلنت اشترومن با پروتز تمام‌سرامیک زیرکونیا و بارگذاری فوری.", en: "6 Straumann implants with immediate-load zirconia prosthesis." },
    treatment: { fa: "ایمپلنت فوری و پروتز زیرکونیا", en: "Immediate Implant & Zirconia" },
    categoryIds: [catMap["implant"]],
    images: [
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1200&q=84",
      "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80"
    ],
    status: "published",
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Align
  {
    slug: "clear-aligner-case-3",
    title: { fa: "یک قدم به لبخندی منظم و هماهنگ‌تر", en: "Orthodontic Realignment with Clear Aligners" },
    description: { fa: "درمان کرودینگ دندان‌های قدامی با الاینر شفاف در مدت ۹ ماه بدون براکت فلزی.", en: "Anterior crowding resolved in 9 months using clear aligners." },
    treatment: { fa: "الاینر شفاف نامرئی", en: "Clear Aligners" },
    categoryIds: [catMap["align"]],
    images: [
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=84",
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80"
    ],
    status: "published",
    sortOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Care
  {
    slug: "microscopic-restorative-case-4",
    title: { fa: "حفظ و نجات دندان طبیعی با درمان میکروسکوپی", en: "Microscopic Endodontic & Conservative Restoration" },
    description: { fa: "درمان ریشه مجدد تحت بزرگنمایی ۲۵ برابری میکروسکوپ زایس و روکش تمام‌سرامیک.", en: "Retreatment under 25x Zeiss magnification with ceramic crown." },
    treatment: { fa: "اندودنتیکس و ترمیم میکروسکوپی", en: "Microscopic Endodontics" },
    categoryIds: [catMap["care"]],
    images: [
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=84",
      "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=800&q=80"
    ],
    status: "published",
    sortOrder: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

await portItemsCol.insertMany(portfolioItems);
console.log(`Inserted ${portfolioItems.length} portfolio items into MongoDB.`);

await mongoose.disconnect();
console.log("Database seeded successfully.");
