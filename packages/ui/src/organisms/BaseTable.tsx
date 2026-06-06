"use client";

import React from "react";
import { flexRender, type Table, type Row } from "@tanstack/react-table";
import { useStyletron } from "baseui";
import { LabelSmall } from "baseui/typography";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface BaseTableProps<TData> {
  table: Table<TData>;
  onRowClick?: (row: Row<TData>) => void;
  emptyState?: React.ReactNode;
  /** Noun appended to the row count: "Mostrando 1–10 de 50 {rowsLabel}" */
  rowsLabel?: string;
}

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") return <ChevronUp size={12} />;
  if (sorted === "desc") return <ChevronDown size={12} />;
  return <ChevronsUpDown size={12} />;
}

function NavButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const [css, theme] = useStyletron();
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={css({
        width: "28px",
        height: "28px",
        border: `1px solid ${theme.colors.borderOpaque}`,
        borderRadius: "4px",
        backgroundColor: "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: theme.colors.contentSecondary,
        transition: "border-color 0.1s, color 0.1s",
        ":hover": disabled
          ? {}
          : {
              borderColor: theme.colors.borderSelected,
              color: theme.colors.contentPrimary,
            },
      })}
    >
      {children}
    </button>
  );
}

export function BaseTable<TData>({
  table,
  onRowClick,
  emptyState,
  rowsLabel = "resultados",
}: BaseTableProps<TData>) {
  const [css, theme] = useStyletron();
  const rows = table.getRowModel().rows;
  const { pageIndex, pageSize } = table.getState().pagination;
  const total = table.getFilteredRowModel().rows.length;
  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, total);

  // BaseUI's mono100 is white — fallback ensures zebra rows are white even if token moves
  const whiteRow = (theme.colors as Record<string, string>).mono100 ?? "#ffffff";

  return (
    <div className={css({ display: "flex", flexDirection: "column" })}>
      {/* ── Table ── */}
      <div
        className={css({
          overflowX: "auto",
          border: `1px solid ${theme.colors.borderOpaque}`,
          borderRadius: "8px",
          borderBottomLeftRadius: "0",
          borderBottomRightRadius: "0",
        })}
      >
        <table className={css({ width: "100%", borderCollapse: "collapse" })}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className={css({
                  borderBottom: `1px solid ${theme.colors.borderOpaque}`,
                })}
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      className={css({
                        padding: "10px 16px",
                        textAlign: "left",
                        backgroundColor: theme.colors.backgroundSecondary,
                        cursor: canSort ? "pointer" : "default",
                        userSelect: "none",
                        whiteSpace: "nowrap",
                        transition: "background-color 0.1s",
                        ":hover": canSort
                          ? { backgroundColor: theme.colors.backgroundTertiary }
                          : {},
                      })}
                    >
                      <div
                        className={css({
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        })}
                      >
                        <LabelSmall color={theme.colors.contentSecondary}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </LabelSmall>
                        {canSort && (
                          <span
                            className={css({
                              display: "flex",
                              color: sorted
                                ? theme.colors.buttonPrimaryFill
                                : theme.colors.contentTertiary,
                            })}
                          >
                            <SortIcon sorted={sorted} />
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className={css({ padding: "64px 24px", textAlign: "center" })}
                >
                  {emptyState ?? (
                    <LabelSmall color={theme.colors.contentSecondary}>
                      Sin resultados
                    </LabelSmall>
                  )}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={css({
                    cursor: onRowClick ? "pointer" : "default",
                    // Zebra striping: even = white, odd = surface-container-low
                    backgroundColor:
                      i % 2 === 0 ? whiteRow : theme.colors.backgroundSecondary,
                    borderBottom: `1px solid ${theme.colors.borderOpaque}`,
                    transition: "background-color 0.1s",
                    ":last-child": { borderBottom: "none" },
                    ":hover": onRowClick
                      ? { backgroundColor: `${theme.colors.buttonPrimaryFill}14` }
                      : {},
                  })}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={css({ padding: "12px 16px" })}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          border: `1px solid ${theme.colors.borderOpaque}`,
          borderTop: "none",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
          backgroundColor: theme.colors.backgroundSecondary,
          flexWrap: "wrap",
          gap: "8px",
        })}
      >
        {/* Left: count + rows-per-page */}
        <div
          className={css({ display: "flex", alignItems: "center", gap: "16px" })}
        >
          <LabelSmall color={theme.colors.contentSecondary}>
            {total === 0
              ? `Sin ${rowsLabel}`
              : `Mostrando ${from}–${to} de ${total} ${rowsLabel}`}
          </LabelSmall>

          <div
            className={css({ display: "flex", alignItems: "center", gap: "6px" })}
          >
            <LabelSmall color={theme.colors.contentTertiary}>Filas:</LabelSmall>
            <select
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className={css({
                border: `1px solid ${theme.colors.borderOpaque}`,
                borderRadius: "4px",
                padding: "2px 6px",
                backgroundColor: whiteRow,
                color: theme.colors.contentPrimary,
                fontSize: "12px",
                cursor: "pointer",
                outline: "none",
                ":focus": { borderColor: theme.colors.borderSelected },
              })}
            >
              {[10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: prev / page indicator / next */}
        <div
          className={css({ display: "flex", alignItems: "center", gap: "4px" })}
        >
          <NavButton
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={14} />
          </NavButton>

          <LabelSmall
            color={theme.colors.contentSecondary}
            $style={{ minWidth: "64px", textAlign: "center" }}
          >
            {table.getPageCount() > 0
              ? `${pageIndex + 1} / ${table.getPageCount()}`
              : "–"}
          </LabelSmall>

          <NavButton
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight size={14} />
          </NavButton>
        </div>
      </div>
    </div>
  );
}
