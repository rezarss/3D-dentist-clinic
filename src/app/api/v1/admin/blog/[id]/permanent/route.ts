import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { BlogPostModel, CommentModel, ContentRevisionModel } from "@/models";
import { getAuth, can } from "@/lib/rbac";
import { fail, ok } from "@/lib/api";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuth(req);
  if (!auth || !can(String(auth.role), "content:write")) return fail("Forbidden", 403);

  try {
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return fail("Invalid blog post id", 422);

    await connectDB();
    const post = await BlogPostModel.findById(id).select("_id").lean();
    if (!post) return fail("Blog post not found", 404);

    await Promise.all([
      CommentModel.deleteMany({ targetType: "blog", targetId: post._id }),
      ContentRevisionModel.deleteMany({ contentType: "blog", contentId: post._id }),
    ]);

    const deleted = await BlogPostModel.findByIdAndDelete(post._id).lean();
    if (!deleted) return fail("Blog post not found", 404);

    return ok({ id, deleted: true });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Could not delete blog post", 500);
  }
}
