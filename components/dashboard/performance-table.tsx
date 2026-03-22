"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { PerformanceRow } from "@/lib/types";

function currency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

const velocityTone = {
  stable: "bg-panel-muted",
  surging: "bg-accent-2",
  cooling: "bg-accent-4",
} as const;

const columns: ColumnDef<PerformanceRow>[] = [
  {
    accessorKey: "campaign",
    header: "Campaign",
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "spend",
    header: "Spend",
    cell: ({ getValue }) => currency(getValue<number>()),
  },
  {
    accessorKey: "roas",
    header: "ROAS",
    cell: ({ getValue }) => `${getValue<number>().toFixed(1)}x`,
  },
  {
    accessorKey: "conversions",
    header: "Conversions",
  },
  {
    accessorKey: "velocity",
    header: "Velocity",
    cell: ({ getValue }) => {
      const value = getValue<PerformanceRow["velocity"]>();
      return (
        <span className={`rounded-full border-2 border-line px-3 py-1 text-xs font-black uppercase ${velocityTone[value]}`}>
          {value}
        </span>
      );
    },
  },
];

export function PerformanceTable({ data }: { data: PerformanceRow[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="rounded-brutal border-4 border-line bg-panel p-5 text-ink shadow-brutal">
      <div className="mb-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-ink/60">Performance</p>
        <h2 className="mt-2 text-2xl font-black">Campaign list</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-b-4 border-line px-3 py-3 text-left text-xs font-black uppercase tracking-[0.15em]"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border-b-2 border-line/20 px-3 py-4 text-sm font-medium">
                    {cell.column.columnDef.cell
                      ? flexRender(cell.column.columnDef.cell, cell.getContext())
                      : String(cell.getValue() ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
