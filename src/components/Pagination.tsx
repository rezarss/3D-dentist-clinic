"use client";

import { FormEvent, useEffect, useState } from "react";

const pageSizes = [10, 20, 50, 100];

type PaginationProps = {
  page: number;
  perPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  variant?: "default" | "admin";
};

export function Pagination({
  page,
  perPage,
  totalItems,
  onPageChange,
  onPerPageChange,
  variant = "default",
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(totalItems / perPage));
  const [jumpTo, setJumpTo] = useState(String(page));

  useEffect(() => setJumpTo(String(page)), [page]);

  function jump(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = Number(jumpTo);
    if (!Number.isInteger(target) || target < 1 || target > pageCount) return;
    onPageChange(target);
  }

  const start = totalItems === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, totalItems);
  const classPrefix = variant === "admin" ? "admin-pagination" : "pagination";

  return (
    <nav className={classPrefix} aria-label="صفحه‌بندی فهرست">
      <div className={`${classPrefix}-summary`}>
        <span>نمایش <strong>{start}–{end}</strong> از <strong>{totalItems}</strong></span>
        <label>تعداد در صفحه
          <select value={perPage} onChange={(event) => onPerPageChange(Number(event.target.value))}>
            {pageSizes.map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
      </div>
      <div className={`${classPrefix}-controls`}>
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="صفحه قبل">قبلی</button>
        <span className={`${classPrefix}-current`}>صفحه <strong>{page}</strong> از {pageCount}</span>
        <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= pageCount} aria-label="صفحه بعد">بعدی</button>
      </div>
      <form className={`${classPrefix}-jump`} onSubmit={jump}>
        <label htmlFor={`${classPrefix}-page-jump`}>رفتن به صفحه</label>
        <input id={`${classPrefix}-page-jump`} type="number" min={1} max={pageCount} value={jumpTo} onChange={(event) => setJumpTo(event.target.value)} />
        <button type="submit">برو</button>
      </form>
    </nav>
  );
}
