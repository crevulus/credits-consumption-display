import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
  type Header,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  SearchParams,
  SortOrder,
  type UsageItem,
  type UsageResponse,
} from "./types";

import "./App.css";

function formatTimestamp(ts: string) {
  return format(new Date(ts), "MM-dd-yyyy HH:mm");
}

function getOrderParam(param: string): SortOrder | undefined {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(param);
  if (value === SortOrder.Asc || value === SortOrder.Desc)
    return value as SortOrder;
  return undefined;
}

function setOrderParam(param: string, value: SortOrder | undefined) {
  const params = new URLSearchParams(window.location.search);
  if (value) {
    params.set(param, value);
  } else {
    params.delete(param);
  }
  window.history.replaceState(
    {},
    "",
    `${window.location.pathname}?${params.toString()}`
  );
}

function getSorting(): SortingState {
  const sorting: SortingState = [];
  const reportOrder = getOrderParam(SearchParams.ReportOrder);
  const creditsOrder = getOrderParam(SearchParams.CreditsOrder);
  if (reportOrder)
    sorting.push({ id: "report_name", desc: reportOrder === SortOrder.Desc });
  if (creditsOrder)
    sorting.push({ id: "credits_used", desc: creditsOrder === SortOrder.Desc });
  return sorting;
}

function App() {
  const [usage, setUsage] = useState<UsageItem[]>([]);
  const [sorting, setSorting] = useState<SortingState>(getSorting());

  useEffect(() => {
    fetch("http://127.0.0.1:8000/usage")
      .then((res) => res.json())
      .then((data: UsageResponse) => setUsage(data.usage));
  }, []);

  useEffect(() => {
    setSorting(getSorting());
  }, []);

  useEffect(() => {
    const reportSort = sorting.find((s) => s.id === "report_name");
    const creditsSort = sorting.find((s) => s.id === "credits_used");
    setOrderParam(
      SearchParams.ReportOrder,
      reportSort
        ? reportSort.desc
          ? SortOrder.Desc
          : SortOrder.Asc
        : undefined
    );
    setOrderParam(
      SearchParams.CreditsOrder,
      creditsSort
        ? creditsSort.desc
          ? SortOrder.Desc
          : SortOrder.Asc
        : undefined
    );
  }, [sorting]);

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
    <div style={{ marginTop: "2em" }}>
      <h2>Usage Table</h2>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={() => handleSort(header)}
                  style={{
                    cursor: header.column.getCanSort() ? "pointer" : "default",
                  }}
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
    </div>
  );
}

export default App;
