
import { BarChart, CheckCircle, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  progressValue?: number;
  progressColor?: string;
}

const MetricCard = ({ title, value, icon, trend, progressValue, progressColor = "bg-primary" }: MetricCardProps) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Animate progress bar on load
    const timer = setTimeout(() => {
      setProgress(progressValue || 0);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [progressValue]);
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h2 className="text-3xl font-bold">{value}</h2>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
        
        {progressValue !== undefined && (
          <div className="mt-4">
            <Progress value={progress} className={progressColor} />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
          </div>
        )}
        
        {trend && (
          <div className="mt-4 flex items-center text-xs">
            <span className={trend.value >= 0 ? "text-green-500" : "text-red-500"}>
              {trend.value >= 0 ? "+" : ""}{trend.value}%
            </span>
            <span className="ml-1 text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface DashboardMetricsProps {
  organizationCount: number;
  strategicAreasCount: number;
}

const DashboardMetrics = ({ organizationCount, strategicAreasCount }: DashboardMetricsProps) => {
  // Calculate completion percentages based on the 4-step process
  const calculateCompletionPercentage = () => {
    // This would ideally be calculated based on actual data
    // For now, we'll use a placeholder value
    return 75;
  };
  
  // Calculate initiative completion
  const calculateInitiativeProgress = () => {
    // This would ideally be calculated based on actual data
    // For now, we'll use a placeholder value
    return 42;
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <MetricCard
        title="Organizations"
        value={organizationCount}
        icon={<Users className="h-6 w-6" />}
        progressValue={organizationCount > 0 ? 100 : 0}
        progressColor="bg-blue-500"
        trend={{ value: 100, label: "since last month" }}
      />
      
      <MetricCard
        title="Strategic Areas"
        value={strategicAreasCount}
        icon={<TrendingUp className="h-6 w-6" />}
        progressValue={strategicAreasCount > 0 ? 100 : 0}
        progressColor="bg-purple-500"
      />
      
      <MetricCard
        title="Process Completion"
        value={`${calculateCompletionPercentage()}%`}
        icon={<CheckCircle className="h-6 w-6" />}
        progressValue={calculateCompletionPercentage()}
        progressColor="bg-green-500"
        trend={{ value: 15, label: "increase" }}
      />
      
      <MetricCard
        title="Initiatives Progress"
        value={`${calculateInitiativeProgress()}%`}
        icon={<BarChart className="h-6 w-6" />}
        progressValue={calculateInitiativeProgress()}
        progressColor="bg-amber-500"
        trend={{ value: -5, label: "needs attention" }}
      />
    </div>
  );
};

export default DashboardMetrics;
