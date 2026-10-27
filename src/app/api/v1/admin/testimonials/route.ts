import { connectDB } from "@/lib/db";
import { MediaModel, TestimonialModel } from "@/models";
import { getAuth, can } from "@/lib/rbac";
import { ok, fail } from "@/lib/api";
import { Types } from "mongoose";

function normalizeLocalized(value: unknown) {
  if (typeof value === "string") return { fa: value.trim(), en: "" };
  if (typeof value !== "object" || value === null) return { fa: "", en: "" };
  const item = value as Record<string, unknown>;
  return {
    fa: typeof item.fa === "string" ? item.fa.trim() : "",
    en: typeof item.en === "string" ? item.en.trim() : "",
  };
}

export async function GET(req: Request) {
  const auth = await getAuth(req as never);
  if (!auth || !can(String(auth.role), "content:read")) return fail("Forbidden", 403);

  try {
    await connectDB();
    const url = new URL(req.url);
    const requestedPage = Number(url.searchParams.get("page") || 1);
    const requestedLimit = Number(url.searchParams.get("limit") || 10);
    const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const limit = Number.isInteger(requestedLimit) ? Math.min(100, Math.max(1, requestedLimit)) : 10;
    const total = await TestimonialModel.countDocuments();
    const pageCount = Math.ceil(total / limit);
    const currentPage = pageCount ? Math.min(page, pageCount) : 1;
    const items = await TestimonialModel.find()
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip((currentPage - 1) * limit)
      .limit(limit)
      .lean();
    const mediaIds = items.flatMap(item => [item.videoMediaId, item.photoMediaId].filter(Boolean));
    const media = mediaIds.length ? await MediaModel.find({ _id: { $in: mediaIds } }).select("url").lean() : [];
    const mediaById = new Map(media.map(item => [String(item._id), item.url]));
    return ok({
      items: items.map(item => ({
        ...item,
        videoUrl: item.videoMediaId ? mediaById.get(String(item.videoMediaId)) || item.videoUrl : item.videoUrl,
        coverMediaId: item.photoMediaId,
        coverImageUrl: item.photoMediaId ? mediaById.get(String(item.photoMediaId)) || item.coverImageUrl : item.coverImageUrl,
      })),
      pagination: { page: currentPage, limit, total, pages: pageCount },
    });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Unable to load testimonials", 500);
  }
}

export async function POST(req: Request) {
  const auth = await getAuth(req as never);
  if (!auth || !can(String(auth.role), "content:write")) return fail("Forbidden", 403);

  try {
    const body = await req.json();
    const patientName = normalizeLocalized(body?.patientName);
    if (!patientName.fa && !patientName.en) {
      return fail("نام مراجعه‌کننده الزامی است", 422);
    }

    const treatment = normalizeLocalized(body?.treatment);
    const comment = normalizeLocalized(body?.comment);
    const videoUrl = typeof body?.videoUrl === "string" ? body.videoUrl.trim() : "";
    const coverImageUrl = typeof body?.coverImageUrl === "string" ? body.coverImageUrl.trim() : "";
    const videoMediaId = body?.videoMediaId ? String(body.videoMediaId) : null;
    const coverMediaId = body?.coverMediaId ? String(body.coverMediaId) : null;
    const rating = Math.min(5, Math.max(1, Number(body?.rating) || 5));
    const status = ["published", "draft", "archived"].includes(body?.status) ? body.status : "published";
    const sortOrder = Number(body?.sortOrder) || 0;
    const featured = Boolean(body?.featured);
    const showInReviews = Boolean(body?.showInReviews);

    await connectDB();
    const [videoMedia, coverMedia] = await Promise.all([
      videoMediaId && Types.ObjectId.isValid(videoMediaId) ? MediaModel.findById(videoMediaId).select("url mimeType").lean() : null,
      coverMediaId && Types.ObjectId.isValid(coverMediaId) ? MediaModel.findById(coverMediaId).select("url mimeType").lean() : null,
    ]);
    if (videoMediaId && (!videoMedia || !videoMedia.mimeType.startsWith("video/"))) return fail("فایل انتخاب‌شده ویدئو نیست.", 422);
    if (coverMediaId && (!coverMedia || !coverMedia.mimeType.startsWith("image/"))) return fail("فایل انتخاب‌شده تصویر نیست.", 422);
    const created = await TestimonialModel.create({
      patientName,
      treatment,
      comment,
      videoUrl: videoMedia?.url || videoUrl,
      coverImageUrl: coverMedia?.url || coverImageUrl,
      videoMediaId: videoMedia?._id || undefined,
      photoMediaId: coverMedia?._id || undefined,
      rating,
      status,
      sortOrder,
      featured,
      showInReviews,
    });

    return ok(created, 201);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Unable to create testimonial", 500);
  }
}
