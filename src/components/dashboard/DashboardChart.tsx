
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { name: "Q1", complete: 80, inProgress: 20 },
  { name: "Q2", complete: 60, inProgress: 40 },
  { name: "Q3", complete: 30, inProgress: 30 },
  { name: "Q4", complete: 10, inProgress: 20 },
];

const chartConfig = {
  complete: {
    label: "Complete",
    theme: {
      light: "#22c55e",
      dark: "#22c55e",
    },
  },
  inProgress: {
    label: "In Progress",
    theme: {
      light: "#3b82f6",
      dark: "#60a5fa",
    },
  },
};

const DashboardChart = () => {
  return (
    <div className="w-full h-[240px]">
      <ChartContainer
        config={chartConfig}
        className="h-[240px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 5 }}
            stackOffset="expand"
            barSize={24}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false}
              tickMargin={8}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
              tickMargin={8}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent 
                  labelFormatter={(label) => `${label} Strategy Progress`}
                />
              }
            />
            <Bar dataKey="complete" stackId="a" fill="var(--color-complete)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="inProgress" stackId="a" fill="var(--color-inProgress)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default DashboardChart;
