import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  BookOpenCheck,
  FileBadge2,
  GraduationCap,
  HeartPulse,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { DoctorModel, MediaModel, ServiceModel } from "@/models";
import { sanitizeLocalizedHtml } from "@/lib/sanitize";
import { Localized } from "@/components/i18n/Localized";
import { connectDB } from "@/lib/db";
import { ContentFeedback } from "@/components/ContentFeedback";

type Props = { params: Promise<{ slug: string }> };
type LocalizedValue = { fa: string; en: string };
type DoctorRecord = {
  _id: { toString(): string };
  slug: string;
  name?: LocalizedValue;
  shortBio?: LocalizedValue;
  bio?: LocalizedValue;
  cv?: LocalizedValue;
  university?: LocalizedValue;
  photoMediaId?: { toString(): string } | string | null;
  certificates?: {
    title?: LocalizedValue;
    issuer?: LocalizedValue;
    year?: number;
    mediaId?: { toString(): string } | string | null;
  }[];
  courses?: { title?: LocalizedValue; provider?: LocalizedValue; year?: number }[];
  credentials?: { title?: LocalizedValue; description?: LocalizedValue }[];
  services?: ({ toString(): string } | string)[];
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
type MediaRecord = { _id: { toString(): string }; url: string; mimeType?: string; alt?: LocalizedValue };

function localized(value?: LocalizedValue | null): LocalizedValue {
  return {
    fa: typeof value?.fa === "string" ? value.fa : "",
    en: typeof value?.en === "string" ? value.en : "",
  };
}

function hasContent(value: LocalizedValue) {
  return Boolean(value.fa || value.en);
}

async function getDoctor(slug: string) {
  await connectDB();
  const doctor = await DoctorModel.findOne({ slug, status: "published" }).lean() as DoctorRecord | null;
  if (!doctor) return null;

  const mediaIds = [
    ...(doctor.photoMediaId ? [doctor.photoMediaId] : []),
    ...(doctor.certificates || []).flatMap((certificate) => certificate.mediaId ? [certificate.mediaId] : []),
  ];
  const [media, services] = await Promise.all([
    mediaIds.length ? MediaModel.find({ _id: { $in: mediaIds } }).select("url mimeType alt").lean() : [],
    doctor.services?.length
      ? ServiceModel.find({ _id: { $in: doctor.services }, status: "published" }).select("slug title excerpt").lean()
      : [],
  ]);
  const mediaById = new Map<string, MediaRecord>(
    (media as MediaRecord[]).map((entry) => [String(entry._id), entry]),
  );
  return {
    doctor,
    photo: doctor.photoMediaId ? mediaById.get(String(doctor.photoMediaId)) : undefined,
    mediaById,
    services,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getDoctor(slug);
  if (!result) return { title: "پزشک پیدا نشد" };
  const { doctor } = result;
  const title = doctor.seo?.title?.fa || doctor.name?.fa || doctor.name?.en || "پزشک کلینیک";
  const description = doctor.seo?.description?.fa || doctor.shortBio?.fa || "";
  const canonical = doctor.seo?.canonical?.fa || undefined;
  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: doctor.seo?.robots ? { index: doctor.seo.robots.index, follow: doctor.seo.robots.follow } : undefined,
    openGraph: {
      title: doctor.seo?.ogTitle?.fa || title,
      description: doctor.seo?.ogDescription?.fa || description,
      type: "profile",
      url: canonical,
      images: result.photo?.url ? [result.photo.url] : undefined,
    },
  };
}

export default async function DoctorDetailPage({ params }: Props) {
  const { slug } = await params;
  const result = await getDoctor(slug);
  if (!result) notFound();

  const { doctor, photo, mediaById, services } = result;
  const name = localized(doctor.name);
  const shortBio = sanitizeLocalizedHtml(localized(doctor.shortBio));
  const biography = sanitizeLocalizedHtml(localized(doctor.bio));
  const cv = sanitizeLocalizedHtml(localized(doctor.cv));
  const university = localized(doctor.university);
  const certificates = (doctor.certificates || []).filter((item) => hasContent(localized(item.title)));
  const courses = (doctor.courses || []).filter((item) => hasContent(localized(item.title)));
  const credentials = (doctor.credentials || []).filter((item) => hasContent(localized(item.title)));
  const sections = [
    { id: "doctor-biography", label: { fa: "درباره پزشک", en: "Biography" }, visible: hasContent(biography) || hasContent(shortBio) },
    { id: "doctor-services", label: { fa: "خدمات", en: "Services" }, visible: services.length > 0 },
    { id: "doctor-credentials", label: { fa: "سوابق و مدارک", en: "Credentials" }, visible: certificates.length + courses.length + credentials.length > 0 },
    { id: "doctor-cv", label: { fa: "رزومه", en: "CV" }, visible: hasContent(cv) },
    { id: "doctor-feedback", label: { fa: "دیدگاه و امتیاز", en: "Reviews & rating" }, visible: doctor.commentSettings?.enabled === true },
  ].filter((section) => section.visible);

  return (
    <main className="service-detail-page doctor-detail-page">
      <nav className="service-detail-breadcrumb" aria-label="مسیر صفحه">
        <Link href="/"><Localized value={{ fa: "صفحه اصلی", en: "Home" }} /></Link>
        <span aria-hidden="true">/</span>
        <Link href="/doctors"><Localized value={{ fa: "پزشکان", en: "Doctors" }} /></Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page"><Localized value={name} /></span>
      </nav>

      <header className="doctor-profile-hero">
        <div className="doctor-profile-copy">
          <span className="service-detail-eyebrow"><Stethoscope size={16} aria-hidden="true" /> پزشک تیم درمان</span>
          <h1><Localized value={name} /></h1>
          {hasContent(shortBio) && <div className="doctor-profile-summary"><Localized value={shortBio} html /></div>}
          {hasContent(university) && (
            <div className="doctor-profile-university"><GraduationCap size={18} aria-hidden="true" /><Localized value={university} /></div>
          )}
          <div className="doctor-profile-trust"><HeartPulse size={17} aria-hidden="true" /> همراه شما در مسیر سلامت دهان و لبخند</div>
          {services.length > 0 && (
            <a className="service-detail-primary-cta" href="#doctor-services">
              <Sparkles size={17} aria-hidden="true" />
              مشاهده خدمات پزشک
              <ArrowLeft size={16} aria-hidden="true" />
            </a>
          )}
        </div>
        <div className="doctor-profile-portrait">
          {photo?.url ? (
            <Image src={photo.url} alt={photo.alt?.fa || name.fa || name.en || "پزشک کلینیک"} fill priority unoptimized sizes="(max-width: 760px) 100vw, 45vw" />
          ) : (
            <div className="doctor-profile-placeholder"><Stethoscope size={86} strokeWidth={1} aria-hidden="true" /></div>
          )}
          <span className="doctor-profile-portrait-label"><Award size={16} aria-hidden="true" /> معرفی پزشک کلینیک</span>
          <span className="doctor-profile-decoration" aria-hidden="true"><Sparkles size={25} /></span>
        </div>
      </header>

      {sections.length > 1 && (
        <nav className="service-detail-toc doctor-detail-toc" aria-label="بخش‌های پروفایل پزشک">
          {sections.map((section) => <a key={section.id} href={`#${section.id}`}><Localized value={section.label} /></a>)}
        </nav>
      )}

      <div className={`service-detail-layout${sections.length <= 1 ? " service-detail-layout-without-toc" : ""} doctor-detail-layout`}>
        <div className="service-detail-content">
          {(hasContent(biography) || hasContent(shortBio)) && (
            <section className="service-detail-section doctor-biography-section" id="doctor-biography">
              <div className="service-detail-section-heading">
                <span className="service-detail-section-icon"><HeartPulse size={20} aria-hidden="true" /></span>
                <div><span className="service-detail-kicker">آشنایی با پزشک</span><h2>بیوگرافی</h2></div>
              </div>
              {hasContent(biography)
                ? <Localized value={biography} html />
                : <Localized value={shortBio} html />}
            </section>
          )}

          {services.length > 0 && (
            <section className="service-detail-section doctor-services-section" id="doctor-services">
              <div className="service-detail-section-heading">
                <span className="service-detail-section-icon"><Stethoscope size={20} aria-hidden="true" /></span>
                <div><span className="service-detail-kicker">حوزه‌های فعالیت</span><h2>خدمات مرتبط با پزشک</h2></div>
              </div>
              <div className="doctor-services-grid">
                {services.map((service) => (
                  <Link className="doctor-service-card" href={`/services/${service.slug}`} key={String(service._id)}>
                    <span className="doctor-service-icon"><Sparkles size={18} aria-hidden="true" /></span>
                    <span className="doctor-service-copy">
                      <strong><Localized value={localized(service.title)} /></strong>
                      {(service.excerpt?.fa || service.excerpt?.en) && <small><Localized value={localized(service.excerpt)} /></small>}
                    </span>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(certificates.length + courses.length + credentials.length > 0) && (
            <section className="service-detail-section doctor-credentials-section" id="doctor-credentials">
              <div className="service-detail-section-heading">
                <span className="service-detail-section-icon"><Award size={20} aria-hidden="true" /></span>
                <div><span className="service-detail-kicker">مسیر حرفه‌ای</span><h2>سوابق، مدارک و دوره‌ها</h2></div>
              </div>
              <div className="doctor-timeline">
                {certificates.map((certificate, index) => {
                  const attachedMedia = certificate.mediaId ? mediaById.get(String(certificate.mediaId)) : undefined;
                  return (
                    <article className="doctor-timeline-item" key={`certificate-${index}`}>
                      <span className="doctor-timeline-marker"><FileBadge2 size={17} aria-hidden="true" /></span>
                      <div className="doctor-timeline-content">
                        <span className="doctor-timeline-type">گواهی و مدرک</span>
                        <h3><Localized value={localized(certificate.title)} /></h3>
                        {(certificate.issuer?.fa || certificate.issuer?.en || certificate.year) && (
                          <p>{certificate.issuer?.fa || certificate.issuer?.en}{certificate.year ? ` · ${certificate.year}` : ""}</p>
                        )}
                        {attachedMedia && (
                          <a className="doctor-certificate-link" href={attachedMedia.url} target="_blank" rel="noreferrer">
                            {attachedMedia.mimeType?.startsWith("image/") ? (
                              <Image src={attachedMedia.url} alt="" width={100} height={72} unoptimized />
                            ) : <FileBadge2 size={18} aria-hidden="true" />}
                            مشاهده فایل مدرک
                            <ArrowUpRight size={14} aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })}
                {courses.map((course, index) => (
                  <article className="doctor-timeline-item" key={`course-${index}`}>
                    <span className="doctor-timeline-marker is-course"><BookOpenCheck size={17} aria-hidden="true" /></span>
                    <div className="doctor-timeline-content">
                      <span className="doctor-timeline-type">دوره آموزشی</span>
                      <h3><Localized value={localized(course.title)} /></h3>
                      {(course.provider?.fa || course.provider?.en || course.year) && (
                        <p>{course.provider?.fa || course.provider?.en}{course.year ? ` · ${course.year}` : ""}</p>
                      )}
                    </div>
                  </article>
                ))}
                {credentials.map((credential, index) => {
                  const description = sanitizeLocalizedHtml(localized(credential.description));
                  return (
                    <article className="doctor-timeline-item" key={`credential-${index}`}>
                      <span className="doctor-timeline-marker is-credential"><Award size={17} aria-hidden="true" /></span>
                      <div className="doctor-timeline-content">
                        <span className="doctor-timeline-type">صلاحیت حرفه‌ای</span>
                        <h3><Localized value={localized(credential.title)} /></h3>
                        {hasContent(description) && <div className="doctor-credential-description"><Localized value={description} html /></div>}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {hasContent(cv) && (
            <section className="service-detail-section doctor-cv-section" id="doctor-cv">
              <div className="service-detail-section-heading">
                <span className="service-detail-section-icon"><BookOpenCheck size={20} aria-hidden="true" /></span>
                <div><span className="service-detail-kicker">اطلاعات تکمیلی</span><h2>رزومه</h2></div>
              </div>
              <div className="doctor-rich-content"><Localized value={cv} html /></div>
            </section>
          )}

          <ContentFeedback
            targetId={String(doctor._id)}
            targetType="doctor"
            contentLabel="پزشک"
            commentsEnabled={doctor.commentSettings?.enabled === true}
            ratingEnabled={doctor.commentSettings?.allowRating === true}
          />
        </div>

        <aside className="service-detail-aside doctor-detail-aside">
          <section className="service-detail-booking-card doctor-aside-card">
            <span className="service-detail-aside-icon"><Stethoscope size={21} aria-hidden="true" /></span>
            <span className="service-detail-kicker">تیم درمان کلینیک</span>
            <h2><Localized value={name} /></h2>
            <p>برای آشنایی با زمینه‌های فعالیت این پزشک، خدمات مرتبط را بررسی کنید.</p>
            {hasContent(university) && (
              <div className="doctor-aside-university">
                <GraduationCap size={17} aria-hidden="true" />
                <span><Localized value={university} /></span>
              </div>
            )}
            <Link className="service-detail-back-link" href="/doctors">
              مشاهده همه پزشکان
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </section>
          <Link className="doctor-aside-services-link" href="/services">
            <span><Sparkles size={16} aria-hidden="true" />مشاهده همه خدمات</span>
            <ArrowLeft size={15} aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </main>
  );
}
