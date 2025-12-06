import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
  type Header,
  type CellContext,
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

const columns = [
  {
    accessorKey: "message_id",
    header: "Message ID",
    cell: (info: CellContext<UsageItem, unknown>) => info.getValue(),
    enableSorting: false,
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: (info: CellContext<UsageItem, unknown>) =>
      formatTimestamp(info.getValue() as string),
    enableSorting: false,
  },
  {
    accessorKey: "report_name",
    header: "Report Name",
    cell: (info: CellContext<UsageItem, unknown>) => info.getValue() || "",
    enableSorting: true,
  },
  {
    accessorKey: "credits_used",
    header: "Credits Used",
    cell: (info: CellContext<UsageItem, unknown>) =>
      Number(info.getValue()).toFixed(2),
    enableSorting: true,
  },
];

export default function UsageTable({
  usage,
  sorting,
  setSorting,
}: UsageTableProps) {
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
    if (sorted === "asc") return <span className="sort-icon">▲</span>;
    if (sorted === "desc") return <span className="sort-icon">▼</span>;
    return <span className="sort-icon sort-icon-hidden">▲</span>;
  }

  function handleSort(header: Header<UsageItem, unknown>) {
    if (!header.column.getCanSort()) return;
    header.column.toggleSorting(undefined, true);
  }

  return (
    <table className="usage-table">
      <thead className="table-head">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr className="table-row" key={headerGroup.id}>
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
      <tbody className="table-body">
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td className="table-cell" key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
