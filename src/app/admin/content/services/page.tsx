import { ContentList } from "../ContentList";

export default function ServicesAdminPage() {
  return <ContentList
    title="خدمات"
    endpoint="/api/v1/admin/services"
    createHref="/admin/content/services/new"
    editBase="/admin/content/services"
    showCoverImages
    deleteEndpoint="/api/v1/admin/services"
    deleteConfirmTitle="حذف دائمی خدمت"
    deleteDescription="این خدمت و دیدگاه‌ها و تاریخچهٔ ویرایش مرتبط حذف می‌شوند و ارجاع آن از پزشکان برداشته می‌شود. فایل کاور از کتابخانه رسانه حذف نمی‌شود. اگر برای این خدمت سابقهٔ نوبت وجود داشته باشد، حذف انجام نخواهد شد."
    deleteSuccessMessage="خدمت و اطلاعات وابسته حذف شدند."
  />;
}
