import { Model } from "mongoose";
import { connectDB } from "@/lib/db";
import { MediaModel } from "@/models";
import { getAuth, can } from "@/lib/rbac";
import { ok, fail } from "@/lib/api";

export async function listContent(req: Request, Model: Model<any>, options: { permission?: string; categoryField?: string; coverMediaField?: string; mediaArrayFields?: string[] } = {}) {
  const auth = await getAuth(req);
  if (!auth || !can(String(auth.role), options.permission || "content:read")) return fail("Forbidden", 403);
  try {
    await connectDB();
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || 20)));
    const search = url.searchParams.get("search")?.trim();
    const status = url.searchParams.get("status");
    const categoryId = url.searchParams.get("categoryId");
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (categoryId && options.categoryField) filter[options.categoryField] = categoryId;
    if (search) filter.$or = [
      { "title.fa": { $regex: search, $options: "i" } },
      { "title.en": { $regex: search, $options: "i" } },
      { "name.fa": { $regex: search, $options: "i" } },
      { "name.en": { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
    ];
    const skip = (page - 1) * limit;
    const [items,total] = await Promise.all([
      Model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Model.countDocuments(filter),
    ]);
    if (options.coverMediaField) {
      const mediaIds = items.flatMap(item => item[options.coverMediaField!] ? [item[options.coverMediaField!]] : []);
      const media = mediaIds.length ? await MediaModel.find({ _id: { $in: mediaIds } }).select("url").lean() : [];
      const mediaById = new Map(media.map(item => [String(item._id), item.url]));
      const itemsWithCover = items.map(item => ({
        ...item,
        coverMediaUrl: item[options.coverMediaField!]
          ? mediaById.get(String(item[options.coverMediaField!])) || ""
          : "",
      }));
      return ok({ items: itemsWithCover, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    }
    if (options.mediaArrayFields?.length) {
      const mediaIds = [...new Set(items.flatMap(item => options.mediaArrayFields!.flatMap(field => item[field] || []).map(String)))];
      const media = mediaIds.length ? await MediaModel.find({ _id: { $in: mediaIds } }).select("url").lean() : [];
      const mediaById = new Map(media.map(item => [String(item._id), item.url]));
      const itemsWithMedia = items.map(item => ({
        ...item,
        ...Object.fromEntries(options.mediaArrayFields!.map(field => [
          `${field.replace(/Ids$/, "")}Urls`,
          (item[field] || []).map((id: unknown) => mediaById.get(String(id)) || ""),
        ])),
      }));
      return ok({ items: itemsWithMedia, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    }
    return ok({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (e) { return fail(e instanceof Error ? e.message : "Unable to load content", 500); }
}