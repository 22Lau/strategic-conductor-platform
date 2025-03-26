
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Types
interface ChartData {
  name: string;
  planned: number;
  completed: number;
  inProgress: number;
}

// Mock data for the chart
const getChartData = (period: string): ChartData[] => {
  if (period === "weekly") {
    return [
      { name: "Week 1", planned: 4, completed: 3, inProgress: 1 },
      { name: "Week 2", planned: 6, completed: 4, inProgress: 2 },
      { name: "Week 3", planned: 5, completed: 2, inProgress: 3 },
      { name: "Week 4", planned: 8, completed: 3, inProgress: 3 },
    ];
  } else if (period === "monthly") {
    return [
      { name: "Jan", planned: 10, completed: 8, inProgress: 2 },
      { name: "Feb", planned: 12, completed: 9, inProgress: 3 },
      { name: "Mar", planned: 15, completed: 10, inProgress: 4 },
      { name: "Apr", planned: 14, completed: 8, inProgress: 4 },
      { name: "May", planned: 18, completed: 12, inProgress: 5 },
      { name: "Jun", planned: 16, completed: 10, inProgress: 4 },
    ];
  } else {
    return [
      { name: "Q1", planned: 35, completed: 25, inProgress: 8 },
      { name: "Q2", planned: 45, completed: 30, inProgress: 12 },
      { name: "Q3", planned: 40, completed: 20, inProgress: 15 },
      { name: "Q4", planned: 50, completed: 18, inProgress: 22 },
    ];
  }
};

const DashboardChart = () => {
  const [period, setPeriod] = useState<string>("monthly");
  const [data, setData] = useState<ChartData[]>([]);
  
  useEffect(() => {
    setData(getChartData(period));
  }, [period]);
  
  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Strategic Progress</CardTitle>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardDescription>Tracking initiative progress over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${value} initiatives`, '']}
                labelFormatter={(label) => `Period: ${label}`}
              />
              <Legend />
              <Bar dataKey="planned" name="Planned" fill="#9b87f5" />
              <Bar dataKey="completed" name="Completed" fill="#22c55e" />
              <Bar dataKey="inProgress" name="In Progress" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardChart;
