"use client";

import { useRouter } from "next/navigation";
import { Pagination } from "@/components/Pagination";

export function ServicesPagination({
  page,
  perPage,
  totalItems,
}: {
  page: number;
  perPage: number;
  totalItems: number;
}) {
  const router = useRouter();

  function updateQuery(nextPage: number, nextPerPage: number) {
    router.push(`/services?page=${nextPage}&perPage=${nextPerPage}`, { scroll: false });
  }

  return (
    <Pagination
      page={page}
      perPage={perPage}
      totalItems={totalItems}
      onPageChange={(nextPage) => updateQuery(nextPage, perPage)}
      onPerPageChange={(nextPerPage) => updateQuery(1, nextPerPage)}
    />
  );
}
