"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  type PaginationState,
  type Table,
} from "@tanstack/react-table";

export interface UseTableControlsOptions<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  initialPageSize?: number;
}

export interface UseTableControlsResult<TData> {
  table: Table<TData>;
  /** Current global search string — bind to your search input */
  globalFilter: string;
  /** Update search and reset to page 0 */
  setGlobalFilter: (value: string) => void;
}

/**
 * Wraps TanStack Table with managed state for search, sorting, and pagination.
 * Feed `data` (already domain-filtered) and `columns` from any feature.
 *
 * Usage:
 *   const { table, globalFilter, setGlobalFilter } = useTableControls({ data, columns });
 *   <BaseTable table={table} onRowClick={...} />
 */
export function useTableControls<TData>({
  data,
  columns,
  initialPageSize = 10,
}: UseTableControlsOptions<TData>): UseTableControlsResult<TData> {
  const [globalFilter, setGlobalFilterRaw] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const setGlobalFilter = (value: string) => {
    setGlobalFilterRaw(value);
    // Jump back to page 0 whenever the search changes
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, sorting, pagination },
    onGlobalFilterChange: setGlobalFilterRaw,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
    // Automatically resets page to 0 when data array reference changes
    autoResetPageIndex: true,
  });

  return { table, globalFilter, setGlobalFilter };
}
