
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, File, BarChart } from "lucide-react";

interface DashboardMetricsProps {
  organizationCount: number;
  strategicAreasCount: number;
}

const DashboardMetrics = ({ organizationCount, strategicAreasCount }: DashboardMetricsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="flex items-center p-6">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Organizations</p>
            <h3 className="text-2xl font-bold">{organizationCount}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center p-6">
          <div className="bg-blue-500/10 p-3 rounded-full mr-4">
            <Target className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Strategic Areas</p>
            <h3 className="text-2xl font-bold">{strategicAreasCount}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center p-6">
          <div className="bg-green-500/10 p-3 rounded-full mr-4">
            <File className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Strategic Plans</p>
            <h3 className="text-2xl font-bold">3</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center p-6">
          <div className="bg-purple-500/10 p-3 rounded-full mr-4">
            <BarChart className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Initiatives</p>
            <h3 className="text-2xl font-bold">12</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMetrics;
