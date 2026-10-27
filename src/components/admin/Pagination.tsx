import { Pagination as SharedPagination } from "@/components/Pagination";

export function Pagination(props: React.ComponentProps<typeof SharedPagination>) {
  return <SharedPagination {...props} variant="admin" />;
}
