import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

import { COLORS } from "./colors";
import type { UsageItem } from "./types";

function groupCreditsByDate(data: UsageItem[]) {
  const map: Record<string, number> = {};
  data.forEach((item) => {
    const date = format(new Date(item.timestamp), "dd-MM-yyyy");
    map[date] = (map[date] || 0) + item.credits_used;
  });
  return Object.entries(map).map(([date, credits]) => ({
    date,
    Credits: credits.toFixed(2),
  }));
}

interface UsageBarChartProps {
  data: UsageItem[];
}

const UsageBarChart = ({ data }: UsageBarChartProps) => {
  const chartData = groupCreditsByDate(data);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="date" fontSize={12} stroke={COLORS.primary} />
          <YAxis fontSize={12} stroke={COLORS.primary} />
          <Tooltip
            contentStyle={{
              backgroundColor: COLORS.white,
              border: `2px solid ${COLORS.accent}`,
              borderRadius: "4px",
            }}
            labelStyle={{ color: COLORS.primary, fontWeight: 600 }}
            itemStyle={{ fontWeight: 600 }}
          />
          <Bar dataKey="Credits" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageBarChart;
