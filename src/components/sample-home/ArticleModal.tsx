"use client";

import { useEffect } from "react";
import { X, ArrowLeft } from "lucide-react";

type ArticleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  article: {
    title: string;
    category?: string;
    content?: string;
    excerpt?: string;
    date?: string;
    readTime?: string;
  } | null;
};

export function ArticleModal({ isOpen, onClose, article }: ArticleModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl overflow-hidden bg-white border border-[#E8E2D5] shadow-2xl flex flex-col text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D5] bg-[#FCFAF6]">
          <span className="text-xs font-bold text-[#404c34]">
            مجله دندانپزشکی · {article.category || "مقاله آموزشی"}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center text-gray-600"
            aria-label="بستن"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-[#302A21] leading-relaxed">
            {article.title}
          </h2>

          <div className="flex items-center gap-3 text-xs text-[#8A8476] pb-2 border-b border-[#E8E2D5]">
            <span>{article.date || "انتشار جدید"}</span>
            <span>·</span>
            <span>{article.readTime || "۴ دقیقه مطالعه"}</span>
          </div>

          <div className="text-sm text-[#463F32] leading-loose space-y-4 pt-2">
            <p className="font-semibold text-[#625D45] text-base leading-relaxed bg-[#F7F4EE] p-4 rounded-2xl border border-[#E8E2D5]">
              {article.excerpt}
            </p>

            <div className="space-y-3">
              <h3 className="font-bold text-base text-[#302A21]">
                اهمیت بررسی دوره‌ای و مراقبت پیشگیرانه
              </h3>
              <p>
                برخی مشکلات دهان و دندان در مراحل اولیه بدون درد محسوس پیش می‌روند. معاینه دوره‌ای به شناسایی زودتر پوسیدگی‌های مخفی، التهاب لثه و آسیب‌های ریشه کمک شایانی می‌کند.
              </p>
              <h3 className="font-bold text-base text-[#302A21] pt-2">
                توصیه‌های بالینی تیم پزشکی کلینیک
              </h3>
              <p>
                استفاده منظم از نخ دندان، مسواک زدن صحیح با زاویه ۴۵ درجه و مراجعات ۶ ماهه جهت بررسی وضعیت استخوان فک و لثه ضامن ماندگاری لبخند زیبای شما خواهد بود.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#d1cfbc]/30 border border-[#d1cfbc]/60 text-xs text-[#625D45] mt-4">
              این مطلب صرفاً جنبه آموزشی داشته و جایگزین معاینه و توصیه اختصاصی پزشک معالج نیست.
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-[#E8E2D5] bg-[#FCFAF6] flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-xs font-bold text-[#756F62] hover:bg-white"
          >
            بستن پنجره
          </button>
          
          <a
            href="#appointment"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#625D45] text-white text-xs font-bold hover:bg-[#343F2B] transition"
          >
            <span>درخواست مشاوره درباره این درمان</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
