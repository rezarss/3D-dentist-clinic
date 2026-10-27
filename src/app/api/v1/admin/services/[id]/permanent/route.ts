import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { AppointmentModel, CommentModel, ContentRevisionModel, DoctorModel, ServiceModel } from "@/models";
import { getAuth, can } from "@/lib/rbac";
import { fail, ok } from "@/lib/api";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuth(req);
  if (!auth || !can(String(auth.role), "content:write")) return fail("Forbidden", 403);

  try {
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return fail("Invalid service id", 422);

    await connectDB();
    const service = await ServiceModel.findById(id).select("_id").lean();
    if (!service) return fail("Service not found", 404);

    const appointmentCount = await AppointmentModel.countDocuments({ serviceId: service._id });
    if (appointmentCount > 0) {
      return fail(
        `This service has ${appointmentCount} appointment record(s). Reassign or retain those records before deleting the service.`,
        409,
      );
    }

    await Promise.all([
      DoctorModel.updateMany({ services: service._id }, { $pull: { services: service._id } }),
      CommentModel.deleteMany({ targetType: "service", targetId: service._id }),
      ContentRevisionModel.deleteMany({ contentType: "service", contentId: service._id }),
    ]);

    const deleted = await ServiceModel.findByIdAndDelete(service._id).lean();
    if (!deleted) return fail("Service not found", 404);

    return ok({ id, deleted: true });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Could not delete service", 500);
  }
}
