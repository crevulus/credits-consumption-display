import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
  type Header,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { type UsageItem } from "./types";

function formatTimestamp(ts: string) {
  return format(new Date(ts), "dd-MM-yyyy HH:mm");
}

type UsageTableProps = {
  usage: UsageItem[];
  sorting: SortingState;
  setSorting: (
    updater: SortingState | ((old: SortingState) => SortingState)
  ) => void;
};

export default function UsageTable({
  usage,
  sorting,
  setSorting,
}: UsageTableProps) {
  // columns
  const columns = [
    {
      accessorKey: "message_id",
      header: "Message ID",
      cell: (info: any) => info.getValue(),
      enableSorting: false,
    },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: (info: any) => formatTimestamp(info.getValue()),
      enableSorting: false,
    },
    {
      accessorKey: "report_name",
      header: "Report Name",
      cell: (info: any) => info.getValue() || "",
      enableSorting: true,
    },
    {
      accessorKey: "credits_used",
      header: "Credits Used",
      cell: (info: any) => Number(info.getValue()).toFixed(2),
      enableSorting: true,
    },
  ];

  const table = useReactTable({
    data: usage,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: false,
    enableMultiSort: true,
    enableSortingRemoval: true,
  });

  function renderSortIcon(header: Header<UsageItem, unknown>) {
    const sorted = header.column.getIsSorted();
    if (!sorted) return null;
    if (sorted === "asc") return <span>▲</span>;
    if (sorted === "desc") return <span>▼</span>;
    return null;
  }

  function handleSort(header: Header<UsageItem, unknown>) {
    if (!header.column.getCanSort()) return;
    header.column.toggleSorting(undefined, true);
  }

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                onClick={() => handleSort(header)}
                className={
                  header.column.getCanSort()
                    ? "table-header-sortable"
                    : "table-header-default"
                }
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
                {renderSortIcon(header)}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
