"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Pagination } from "@/components/Pagination";

type ServiceOption = { id: string; label: string };

export function DoctorFilters({
  search,
  serviceId,
  services,
  perPage,
}: {
  search: string;
  serviceId: string;
  services: ServiceOption[];
  perPage: number;
}) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(search);
  const [serviceValue, setServiceValue] = useState(serviceId);

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams({ page: "1", perPage: String(perPage) });
    if (searchValue.trim()) params.set("search", searchValue.trim());
    if (serviceValue) params.set("serviceId", serviceValue);
    router.push(`/doctors?${params.toString()}`, { scroll: false });
  }

  return (
    <form className="portfolio-filters doctor-filters" onSubmit={applyFilters}>
      <label className="portfolio-search">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="جست‌وجوی نام، معرفی یا دانشگاه…"
          aria-label="جست‌وجوی پزشکان"
        />
      </label>
      <label className="portfolio-category-filter">
        <span>خدمت</span>
        <select value={serviceValue} onChange={(event) => setServiceValue(event.target.value)}>
          <option value="">همه خدمات</option>
          {services.map((service) => <option key={service.id} value={service.id}>{service.label}</option>)}
        </select>
      </label>
      <button className="portfolio-filter-submit" type="submit">اعمال فیلتر</button>
    </form>
  );
}

export function DoctorPagination({
  page,
  perPage,
  totalItems,
  search,
  serviceId,
}: {
  page: number;
  perPage: number;
  totalItems: number;
  search: string;
  serviceId: string;
}) {
  const router = useRouter();

  function navigate(nextPage: number, nextPerPage: number) {
    const params = new URLSearchParams({ page: String(nextPage), perPage: String(nextPerPage) });
    if (search) params.set("search", search);
    if (serviceId) params.set("serviceId", serviceId);
    router.push(`/doctors?${params.toString()}`, { scroll: false });
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
