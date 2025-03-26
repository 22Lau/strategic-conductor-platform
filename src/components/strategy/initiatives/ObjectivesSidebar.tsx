
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Objective {
  id: string;
  title: string;
  kpis: string[];
}

interface ObjectivesSidebarProps {
  objectives: Objective[];
}

const ObjectivesSidebar = ({ objectives }: ObjectivesSidebarProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Objectives</CardTitle>
        <CardDescription>
          Link initiatives to these objectives
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {objectives.map((objective) => (
            <div key={objective.id} className="p-3 border rounded-md">
              <h3 className="font-medium">{objective.title}</h3>
              <div className="mt-2">
                <p className="text-xs font-medium text-gray-500">KPIs:</p>
                <ul className="text-xs list-disc list-inside mt-1">
                  {objective.kpis.map((kpi, i) => (
                    <li key={i}>{kpi}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ObjectivesSidebar;
