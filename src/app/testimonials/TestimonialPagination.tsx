"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Pagination as SharedPagination } from "@/components/Pagination";

type TestimonialPaginationProps = {
  page: number;
  perPage: number;
  totalItems: number;
};

export function TestimonialPagination(props: TestimonialPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateQuery(key: "page" | "perPage", value: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, String(value));
    if (key === "perPage") params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <SharedPagination
      {...props}
      onPageChange={(page) => updateQuery("page", page)}
      onPerPageChange={(perPage) => updateQuery("perPage", perPage)}
    />
  );
}
