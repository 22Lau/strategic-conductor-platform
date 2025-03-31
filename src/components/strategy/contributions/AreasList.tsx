
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StrategicArea } from "@/types/strategy";

interface AreasListProps {
  areas: StrategicArea[];
  setActiveTab: (tab: string) => void;
  onAreaSelected: (areaName: string) => void;
}

const AreasList = ({ areas, setActiveTab, onAreaSelected }: AreasListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Strategic Areas</CardTitle>
        <CardDescription>Areas with defined strategic goals</CardDescription>
      </CardHeader>
      <CardContent>
        {areas.length > 0 ? (
          <div className="space-y-2">
            {areas.map(area => (
              <div key={area.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                <span>{area.name}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    onAreaSelected(area.name);
                    setActiveTab("contributions");
                  }}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No strategic areas defined</p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setActiveTab("contributions")}
        >
          Next: Define Contributions
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AreasList;
