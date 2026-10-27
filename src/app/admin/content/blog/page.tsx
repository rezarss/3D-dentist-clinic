import { ContentList } from "../ContentList";
export default function BlogAdmin(){return <ContentList
  title="مقالات"
  endpoint="/api/v1/admin/blog"
  createHref="/admin/content/blog/new"
  editBase="/admin/content/blog"
  showCoverImages
  categoriesEndpoint="/api/v1/admin/blog-categories"
  categoriesHref="/admin/content/blog/categories"
  deleteEndpoint="/api/v1/admin/blog"
  deleteConfirmTitle="حذف دائمی مقاله"
  deleteDescription="رکورد مقاله، دیدگاه‌های ثبت‌شده برای آن و تاریخچهٔ ویرایشش برای همیشه حذف می‌شوند. دسته‌بندی مقاله، حساب نویسنده و فایل‌های رسانه‌ای (از جمله تصویر کاور) در کتابخانه باقی می‌مانند."
  deleteSuccessMessage="مقاله و دیدگاه‌ها و تاریخچهٔ ویرایش مرتبط حذف شدند."
/>;}
