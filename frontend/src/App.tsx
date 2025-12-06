import { useState, useEffect } from "react";
import { type SortingState } from "@tanstack/react-table";
import { SearchParams, SortOrder, type UsageResponse } from "./types";
import { useFetch } from "./useFetch";
import UsageBarChart from "./UsageBarChart";
import UsageTable from "./UsageTable";
import "./App.css";

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
  const [sorting, setSorting] = useState<SortingState>(() => getSorting());
  const { data, isLoading, isError } = useFetch<UsageResponse>(
    "http://127.0.0.1:8000/usage"
  );

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

  if (isLoading) return <div className="loading-message">Loading...</div>;

  if (isError || !data)
    return <div className="error-message">Error loading usage data.</div>;

  return (
    <div className="app-container">
      <h2>Usage Bar Chart</h2>
      <UsageBarChart data={data.usage} />
      <h2>Usage Table</h2>
      <UsageTable
        usage={data.usage}
        sorting={sorting}
        setSorting={setSorting}
      />
    </div>
  );
}

export default App;
