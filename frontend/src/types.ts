export type UsageItem = {
  message_id: number;
  timestamp: string;
  report_name?: string;
  credits_used: number;
};

export type UsageResponse = {
  usage: UsageItem[];
};

export enum SortOrder {
  Asc = "asc",
  Desc = "desc",
}

export enum SearchParams {
  ReportOrder = "report_order",
  CreditsOrder = "credits_order",
}
