"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { ArticleModal } from "./ArticleModal";

export type FormattedPost = {
  _id: string;
  slug: string;
  title: { fa: string; en?: string };
  excerpt: { fa: string; en?: string };
  category?: string;
  readTime?: string;
  date?: string;
  image?: string;
};

type SampleBlogProps = {
  posts: FormattedPost[];
};

const BLOG_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=850&q=80",
  "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=850&q=80",
  "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=850&q=80",
];

export function SampleBlog({ posts }: SampleBlogProps) {
  const displayPosts = posts.length > 0 ? posts.slice(0, 3) : [];
  const [selectedArticle, setSelectedArticle] = useState<{
    title: string;
    category?: string;
    excerpt?: string;
    date?: string;
    readTime?: string;
  } | null>(null);

  return (
    <section className="py-20 relative bg-[#F7F4EE]" id="journal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-16 mb-12">
          <div>
            <div className="sample-kicker">
              <span className="sample-kicker-line" />
              <span>آگاهی بیشتر</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-[#302A21] leading-[1.3]">
              دانستنی‌های کوچک،
              <br />
              <em className="not-italic text-[#404c34]">اثرهای بزرگ.</em>
            </h2>
          </div>

          <div className="max-w-md text-right">
            <p className="text-sm text-[#756F62] leading-relaxed">
              آموزش‌های کاربردی برای مراقبت روزانه و شناخت بهتر درمان‌های دندانپزشکی؛ مطالعه مطالب افزایش‌دهنده آگاهی عمومی است.
            </p>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {displayPosts.map((post, index) => {
            const imgSrc = post.image || BLOG_FALLBACK_IMAGES[index % BLOG_FALLBACK_IMAGES.length];
            return (
              <article 
                key={post._id}
                onClick={() => setSelectedArticle({
                  title: post.title.fa,
                  category: post.category,
                  excerpt: post.excerpt.fa,
                  date: post.date,
                  readTime: post.readTime,
                })}
                className="sample-glass-card rounded-[28px] overflow-hidden border border-white/90 shadow-md group cursor-pointer flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="p-3">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#d1cfbc]/30">
                    <Image
                      src={imgSrc}
                      alt={post.title.fa}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    
                    <span className="absolute top-3 right-3 text-[10px] font-bold text-[#625D45] bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-xs">
                      {post.category || "مقاله آموزشی"}
                    </span>
                  </div>
                </div>

                <div className="p-6 pt-2 text-right flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#302A21] mb-2 leading-snug line-clamp-2 group-hover:text-[#625D45] transition">
                      {post.title.fa}
                    </h3>
                    <p className="text-xs text-[#756F62] leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt.fa}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E8E2D5] flex items-center justify-between text-xs font-bold text-[#625D45]">
                    <span>پیش‌نمایش مقاله</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>

              </article>
            );
          })}
        </div>

      </div>

      <ArticleModal
        isOpen={Boolean(selectedArticle)}
        onClose={() => setSelectedArticle(null)}
        article={selectedArticle}
      />
    </section>
  );
}
