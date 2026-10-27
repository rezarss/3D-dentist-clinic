"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Pagination } from "@/components/Pagination";

type CategoryOption = { id: string; label: string };

export function PortfolioFilters({
  search,
  categoryId,
  categories,
  perPage,
}: {
  search: string;
  categoryId: string;
  categories: CategoryOption[];
  perPage: number;
}) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(search);
  const [categoryValue, setCategoryValue] = useState(categoryId);

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams({ page: "1", perPage: String(perPage) });
    if (searchValue.trim()) params.set("search", searchValue.trim());
    if (categoryValue) params.set("categoryId", categoryValue);
    router.push(`/portfolio?${params.toString()}`, { scroll: false });
  }

  return (
    <>
      <form className="portfolio-filters" onSubmit={applyFilters}>
        <label className="portfolio-search">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="جست‌وجوی عنوان یا شرح درمان…"
            aria-label="جست‌وجوی نمونه‌کارها"
          />
        </label>
        <label className="portfolio-category-filter">
          <span>دسته‌بندی</span>
          <select value={categoryValue} onChange={(event) => setCategoryValue(event.target.value)}>
            <option value="">همه دسته‌بندی‌ها</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
          </select>
        </label>
        <button className="portfolio-filter-submit" type="submit">اعمال فیلتر</button>
      </form>
    </>
  );
}

export function PortfolioPagination({
  page,
  perPage,
  totalItems,
  search,
  categoryId,
}: {
  page: number;
  perPage: number;
  totalItems: number;
  search: string;
  categoryId: string;
}) {
  const router = useRouter();

  function navigate(nextPage: number, nextPerPage: number) {
    const params = new URLSearchParams({ page: String(nextPage), perPage: String(nextPerPage) });
    if (search) params.set("search", search);
    if (categoryId) params.set("categoryId", categoryId);
    router.push(`/portfolio?${params.toString()}`, { scroll: false });
  }

  if (totalItems <= perPage) return null;
  return (
    <Pagination
      page={page}
      perPage={perPage}
      totalItems={totalItems}
      onPageChange={(nextPage) => navigate(nextPage, perPage)}
      onPerPageChange={(nextPerPage) => navigate(1, nextPerPage)}
    />
  );
}
