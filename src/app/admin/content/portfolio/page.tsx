import { ContentList } from "../ContentList";

export default function PortfolioAdmin(){
  return <ContentList
    title="نمونه‌کارها"
    endpoint="/api/v1/admin/portfolio"
    createHref="/admin/content/portfolio/new"
    editBase="/admin/content/portfolio"
    categoriesEndpoint="/api/v1/admin/portfolio-categories"
    categoriesHref="/admin/content/portfolio/categories"
    showPortfolioImages
    showCategoryColumn
    deleteEndpoint="/api/v1/admin/portfolio"
    deleteConfirmTitle="حذف دائمی نمونه‌کار"
    deleteDescription="رکورد نمونه‌کار، دیدگاه‌ها و تاریخچهٔ ویرایش آن برای همیشه حذف می‌شوند. دسته‌بندی‌ها، اطلاعات پزشک و فایل‌های رسانه‌ای مرتبط در کتابخانه باقی می‌مانند."
    deleteSuccessMessage="نمونه‌کار و اطلاعات وابسته حذف شدند."
  />;
}
