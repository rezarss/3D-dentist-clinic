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

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await getAuth(req as never);
  if (!auth || !can(String(auth.role), "content:read")) return fail("Forbidden", 403);

  try {
    const { id } = await context.params;
    await connectDB();
    const item = await TestimonialModel.findById(id).lean();
    if (!item) return fail("Testimonial not found", 404);
    const mediaIds = [item.videoMediaId, item.photoMediaId].filter(Boolean);
    const media = mediaIds.length ? await MediaModel.find({ _id: { $in: mediaIds } }).select("url").lean() : [];
    const mediaById = new Map(media.map(entry => [String(entry._id), entry.url]));
    return ok({
      ...item,
      videoUrl: item.videoMediaId ? mediaById.get(String(item.videoMediaId)) || item.videoUrl : item.videoUrl,
      coverMediaId: item.photoMediaId,
      coverImageUrl: item.photoMediaId ? mediaById.get(String(item.photoMediaId)) || item.coverImageUrl : item.coverImageUrl,
    });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Unable to load testimonial", 500);
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await getAuth(req as never);
  if (!auth || !can(String(auth.role), "content:write")) return fail("Forbidden", 403);

  try {
    const { id } = await context.params;
    const body = await req.json();

    const updateData: Record<string, unknown> = {};
    if (body.patientName !== undefined) updateData.patientName = normalizeLocalized(body.patientName);
    if (body.treatment !== undefined) updateData.treatment = normalizeLocalized(body.treatment);
    if (body.comment !== undefined) updateData.comment = normalizeLocalized(body.comment);
    if (body.videoUrl !== undefined) updateData.videoUrl = String(body.videoUrl || "").trim();
    if (body.coverImageUrl !== undefined) updateData.coverImageUrl = String(body.coverImageUrl || "").trim();
    if (body.videoMediaId !== undefined) {
      if (body.videoMediaId === null || body.videoMediaId === "") {
        updateData.videoMediaId = null;
      } else {
        const mediaId = String(body.videoMediaId);
        if (!Types.ObjectId.isValid(mediaId)) return fail("شناسه ویدئو نامعتبر است.", 422);
        const media = await MediaModel.findById(mediaId).select("url mimeType").lean();
        if (!media || !media.mimeType.startsWith("video/")) return fail("فایل انتخاب‌شده ویدئو نیست.", 422);
        updateData.videoMediaId = media._id;
        updateData.videoUrl = media.url;
      }
    }
    if (body.coverMediaId !== undefined) {
      if (body.coverMediaId === null || body.coverMediaId === "") {
        updateData.photoMediaId = null;
      } else {
        const mediaId = String(body.coverMediaId);
        if (!Types.ObjectId.isValid(mediaId)) return fail("شناسه تصویر نامعتبر است.", 422);
        const media = await MediaModel.findById(mediaId).select("url mimeType").lean();
        if (!media || !media.mimeType.startsWith("image/")) return fail("فایل انتخاب‌شده تصویر نیست.", 422);
        updateData.photoMediaId = media._id;
        updateData.coverImageUrl = media.url;
      }
    }
    if (body.rating !== undefined) updateData.rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
    if (body.status !== undefined && ["published", "draft", "archived"].includes(body.status)) updateData.status = body.status;
    if (body.sortOrder !== undefined) updateData.sortOrder = Number(body.sortOrder) || 0;
    if (body.featured !== undefined) updateData.featured = Boolean(body.featured);
    if (body.showInReviews !== undefined) updateData.showInReviews = Boolean(body.showInReviews);

    await connectDB();
    const item = await TestimonialModel.findByIdAndUpdate(id, { $set: updateData }, {
      new: true,
      runValidators: true,
      strict: false,
    }).lean();
    if (!item) return fail("Testimonial not found", 404);
    return ok({ ...item, showInReviews: Boolean(item.showInReviews) });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Unable to update testimonial", 500);
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await getAuth(req as never);
  if (!auth || !can(String(auth.role), "content:delete")) return fail("Forbidden", 403);

  try {
    const { id } = await context.params;
    await connectDB();
    const item = await TestimonialModel.findByIdAndDelete(id).lean();
    if (!item) return fail("Testimonial not found", 404);
    return ok({ deleted: true });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Unable to delete testimonial", 500);
  }
}
