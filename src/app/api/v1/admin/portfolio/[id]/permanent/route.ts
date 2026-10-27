import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { CommentModel, ContentRevisionModel, PortfolioItemModel } from "@/models";
import { getAuth, can } from "@/lib/rbac";
import { fail, ok } from "@/lib/api";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuth(req);
  if (!auth || !can(String(auth.role), "content:write")) return fail("Forbidden", 403);

  try {
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return fail("Invalid portfolio item id", 422);

    await connectDB();
    const item = await PortfolioItemModel.findById(id).select("_id").lean();
    if (!item) return fail("Portfolio item not found", 404);

    await Promise.all([
      CommentModel.deleteMany({ targetType: "portfolio", targetId: item._id }),
      ContentRevisionModel.deleteMany({ contentType: "portfolio", contentId: item._id }),
    ]);

    const deleted = await PortfolioItemModel.findByIdAndDelete(item._id).lean();
    if (!deleted) return fail("Portfolio item not found", 404);

    return ok({ id, deleted: true });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Could not delete portfolio item", 500);
  }
}
