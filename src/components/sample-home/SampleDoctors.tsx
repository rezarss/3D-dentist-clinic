"use client";

import Image from "next/image";

export type FormattedDoctor = {
  _id: string;
  slug: string;
  name: { fa: string; en?: string };
  shortBio: { fa: string; en?: string };
  specialty?: string;
  medicalCode?: string;
  university?: string;
  image?: string;
};

type SampleDoctorsProps = {
  doctors: FormattedDoctor[];
};

const DOCTOR_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1594824388853-d0c1e2ff5210?auto=format&fit=crop&w=800&q=80",
];

export function SampleDoctors({ doctors }: SampleDoctorsProps) {
  const displayDoctors = doctors.length > 0 ? doctors.slice(0, 3) : [];

  return (
    <section className="py-20 relative bg-[#F7F4EE]" id="doctors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-16 mb-12">
          <div>
            <div className="sample-kicker">
              <span className="sample-kicker-line" />
              <span>تیم درمان</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-[#302A21] leading-[1.3]">
              تخصص،
              <br />
              <em className="not-italic text-[#404c34]">با چهره‌ای آشنا.</em>
            </h2>
          </div>

          <div className="max-w-md text-right">
            <p className="text-sm text-[#756F62] leading-relaxed">
              پیش از مراجعه با پزشکان، حوزه تخصص و رویکرد درمانی آن‌ها آشنا شوید. تیم پزشکی کلینیک با سابقه درخشان بالینی و بهره‌گیری از تجهیزات دیجیتال در کنار شماست.
            </p>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {displayDoctors.map((doc, index) => {
            const imgSrc = doc.image || DOCTOR_FALLBACK_IMAGES[index % DOCTOR_FALLBACK_IMAGES.length];
            return (
              <article 
                key={doc._id}
                className="sample-glass-card rounded-[28px] overflow-hidden border border-white/90 shadow-md group flex flex-col justify-between"
              >
                {/* Photo container */}
                <div className="relative aspect-[4/4.5] overflow-hidden bg-[#d1cfbc]/30">
                  <Image
                    src={imgSrc}
                    alt={doc.name.fa}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#24221b]/60 via-transparent to-transparent" />
                  
                  <span className="absolute top-4 right-4 text-[10px] font-bold text-[#302A21] bg-white/85 backdrop-blur-md px-3 py-1 rounded-full shadow-xs">
                    {doc.specialty || "متخصص دندانپزشکی"}
                  </span>
                </div>

                {/* Details */}
                <div className="p-6 text-right flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[11px] font-bold text-[#404c34] block mb-1">
                      {doc.medicalCode || "کادر تخصصی کلینیک"}
                    </span>
                    <h3 className="text-xl font-black text-[#302A21] mb-2">
                      {doc.name.fa}
                    </h3>
                    <p className="text-xs text-[#756F62] leading-relaxed mb-4 line-clamp-3">
                      {doc.shortBio?.fa || doc.university || "دارای مدارک بین‌المللی و بورد تخصصی در درمان‌های پیشرفته دهان و فک."}
                    </p>
                  </div>

                </div>

              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
