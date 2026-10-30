import Image from "next/image";
import Link from "next/link";
import { Types } from "mongoose";
import { ArrowLeft, GraduationCap, Sparkles, Stethoscope, UsersRound } from "lucide-react";
import { Localized } from "@/components/i18n/Localized";
import { connectDB } from "@/lib/db";
import { DoctorModel, MediaModel, ServiceModel } from "@/models";
import { DoctorFilters, DoctorPagination } from "./DoctorControls";

export const dynamic = "force-dynamic";

const pageSizes = [10, 20, 50, 100];
type SearchParams = Promise<{ page?: string; perPage?: string; search?: string; serviceId?: string }>;
type ServiceRecord = {
  _id: { toString(): string };
  slug: string;
  title?: { fa?: string; en?: string };
};

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function plainLocalized(value?: { fa?: string; en?: string } | null) {
  return {
    fa: typeof value?.fa === "string" ? value.fa : "",
    en: typeof value?.en === "string" ? value.en : "",
  };
}

function plainText(value?: { fa?: string; en?: string } | null) {
  const localized = plainLocalized(value);
  const strip = (text: string) => text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return { fa: strip(localized.fa), en: strip(localized.en) };
}

export default async function DoctorsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const requestedPage = positiveInteger(params.page, 1);
  const requestedPerPage = positiveInteger(params.perPage, 10);
  const perPage = pageSizes.includes(requestedPerPage) ? requestedPerPage : 10;
  const search = params.search?.trim().slice(0, 100) || "";
  const serviceId = params.serviceId || "";

  await connectDB();
  const filter: Record<string, unknown> = { status: "published" };
  if (serviceId && Types.ObjectId.isValid(serviceId)) filter.services = serviceId;
  if (search) {
    const matcher = { $regex: escapeRegex(search), $options: "i" };
    filter.$or = [
      { "name.fa": matcher },
      { "name.en": matcher },
      { "shortBio.fa": matcher },
      { "shortBio.en": matcher },
      { "university.fa": matcher },
      { "university.en": matcher },
      { slug: matcher },
    ];
  }

  const [totalItems, serviceRecords] = await Promise.all([
    DoctorModel.countDocuments(filter),
    ServiceModel.find({ status: "published" }).select("_id title slug").sort({ "title.fa": 1 }).lean(),
  ]);
  const services = serviceRecords as ServiceRecord[];
  const pageCount = Math.max(1, Math.ceil(totalItems / perPage));
  const page = Math.min(requestedPage, pageCount);
  const doctors = await DoctorModel.find(filter)
    .sort({ createdAt: 1, _id: 1 })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .lean();

  const mediaIds = doctors.flatMap((doctor) => doctor.photoMediaId ? [doctor.photoMediaId] : []);
  const media = mediaIds.length
    ? await MediaModel.find({ _id: { $in: mediaIds } }).select("url").lean()
    : [];
  const mediaById = new Map(media.map((item) => [String(item._id), item.url]));
  const serviceById = new Map<string, ServiceRecord>(
    services.map((service): [string, ServiceRecord] => [String(service._id), service]),
  );
  const serviceOptions = services.map((service) => ({
    id: String(service._id),
    label: service.title?.fa || service.title?.en || service.slug,
  }));
  const featuredDoctor = doctors[0];
  const featuredName = plainLocalized(featuredDoctor?.name);
  const featuredImage = featuredDoctor?.photoMediaId
    ? mediaById.get(String(featuredDoctor.photoMediaId))
    : undefined;

  return (
    <main className="services-page doctors-page">
      <header className="doctors-archive-hero">
        <div className="doctors-archive-copy">
          <span className="doctors-hero-kicker"><span className="doctors-hero-kicker-dot" /> تیم درمان کلینیک <span>— مراقبت با امضای انسانی</span></span>
          <h1>لبخند شما،<br /><em>داستانِ آدم‌هاست.</em></h1>
          <p>پشت هر درمان خوب، پزشکی هست که با دقت می‌شنود، با دانش تصمیم می‌گیرد و با شما همراه می‌ماند. با تیمی آشنا شوید که مراقبت را شخصی می‌کند.</p>
          <div className="doctors-hero-actions">
            <a className="doctors-hero-cta" href="#doctor-directory">آشنایی با تیم <ArrowLeft size={16} aria-hidden="true" /></a>
            <span className="doctors-hero-stat"><strong>{totalItems.toLocaleString("fa-IR")}</strong> پزشک همراه شما</span>
          </div>
        </div>
        <div className="doctors-archive-art">
          <span className="doctors-hero-orbit doctors-hero-orbit-one" aria-hidden="true" />
          <span className="doctors-hero-orbit doctors-hero-orbit-two" aria-hidden="true" />
          <span className="doctors-hero-vertical-label" aria-hidden="true">CARE · TRUST · SMILE</span>
          <div className="doctors-hero-portrait">
            {featuredImage ? (
              <Image src={featuredImage} alt={featuredName.fa || featuredName.en || "پزشک تیم درمان"} fill priority sizes="(max-width: 760px) 90vw, 42vw" unoptimized />
            ) : (
              <span className="doctors-hero-portrait-placeholder"><Stethoscope size={82} strokeWidth={1} aria-hidden="true" /></span>
            )}
            {featuredDoctor && (
              <Link className="doctors-hero-portrait-caption" href={`/doctors/${featuredDoctor.slug}`}>
                <span><small>از نزدیک آشنا شوید</small><strong><Localized value={featuredName} /></strong></span>
                <span className="doctors-hero-caption-arrow"><ArrowLeft size={17} aria-hidden="true" /></span>
              </Link>
            )}
          </div>
          <span className="doctors-hero-stamp" aria-hidden="true"><Sparkles size={15} /> همراهِ لبخند شما</span>
          <span className="doctors-hero-index" aria-hidden="true">01 / {String(Math.max(totalItems, 1)).padStart(2, "0")}</span>
        </div>
        <div className="doctors-hero-marquee" aria-hidden="true">
          <span>CARE THAT FEELS PERSONAL</span><i>✳</i><span>دانش، دقت، همراهی</span><i>✳</i><span>CARE THAT FEELS PERSONAL</span><i>✳</i>
        </div>
      </header>

      <section className="doctor-directory" id="doctor-directory">
        <div className="doctor-directory-heading">
          <div><span className="doctor-directory-kicker">PEOPLE BEHIND YOUR SMILE</span><h2>با تیم ما آشنا شوید<span>.</span></h2></div>
          <p>هر پزشک، تجربه و نگاهی منحصربه‌فرد دارد.<br />همراه مناسب خود را پیدا کنید.</p>
        </div>
        <DoctorFilters search={search} serviceId={serviceId} services={serviceOptions} perPage={perPage} />

      {doctors.length > 0 ? (
        <>
          <div className="doctors-grid">
            {doctors.map((doctor, index) => {
              const name = plainLocalized(doctor.name);
              const shortBio = plainText(doctor.shortBio);
              const imageUrl = doctor.photoMediaId ? mediaById.get(String(doctor.photoMediaId)) : undefined;
              const doctorServiceIds: unknown[] = Array.isArray(doctor.services) ? doctor.services : [];
              const doctorServices: ServiceRecord[] = doctorServiceIds.flatMap((id) => {
                const service = serviceById.get(String(id));
                return service ? [service] : [];
              });

              return (
                <article className="doctor-archive-card" key={String(doctor._id)} style={{ animationDelay: `${Math.min(index, 7) * 70}ms` }}>
                  <Link className="doctor-card-portrait" href={`/doctors/${doctor.slug}`} aria-label={`مشاهده پروفایل ${name.fa || name.en}`}>
                    {imageUrl ? (
                      <Image src={imageUrl} alt={name.fa || name.en || "پزشک کلینیک"} fill sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw" unoptimized />
                    ) : (
                      <span className="doctor-card-placeholder"><Stethoscope size={48} strokeWidth={1.1} aria-hidden="true" /></span>
                    )}
                    <span className="doctor-card-index">{String((page - 1) * perPage + index + 1).padStart(2, "0")}</span>
                    <span className="doctor-card-view">مشاهده پروفایل <ArrowLeft size={15} /></span>
                  </Link>
                  <div className="doctor-card-content">
                    <span className="doctor-card-kicker"><Sparkles size={13} aria-hidden="true" /> پزشک کلینیک</span>
                    <h2><Link href={`/doctors/${doctor.slug}`}><Localized value={name} /></Link></h2>
                    {(shortBio.fa || shortBio.en) && <p className="doctor-card-bio"><Localized value={shortBio} /></p>}
                    {doctor.university?.fa || doctor.university?.en ? (
                      <div className="doctor-card-university"><GraduationCap size={15} aria-hidden="true" /><Localized value={plainLocalized(doctor.university)} /></div>
                    ) : null}
                    {doctorServices.length > 0 && (
                      <div className="doctor-card-services">
                        {doctorServices.slice(0, 2).map((service) => (
                          <span key={String(service._id)}>{service.title?.fa || service.title?.en || service.slug}</span>
                        ))}
                        {doctorServices.length > 2 && <small>+{doctorServices.length - 2}</small>}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          <DoctorPagination page={page} perPage={perPage} totalItems={totalItems} search={search} serviceId={serviceId} />
        </>
      ) : (
        <div className="services-empty doctors-empty">
          <span className="services-empty-icon"><UsersRound size={28} aria-hidden="true" /></span>
          <h2>{search || serviceId ? "پزشکی با این مشخصات پیدا نشد" : "پزشکی برای نمایش موجود نیست"}</h2>
          <p>{search || serviceId ? "عبارت جست‌وجو یا فیلتر خدمت را تغییر دهید." : "پزشکان منتشرشدهٔ کلینیک در این بخش نمایش داده می‌شوند."}</p>
        </div>
      )}
      </section>

      <div className="doctors-archive-footer">
        <span>پرسشی درباره انتخاب خدمت دارید؟</span>
        <Link href="/services">مشاهده خدمات کلینیک <ArrowLeft size={15} aria-hidden="true" /></Link>
      </div>
    </main>
  );
}
