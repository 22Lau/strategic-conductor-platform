
import { ChevronRight, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface StrategicAreasCardProps {
  areas: Array<{ id: string; name: string }>;
}

const StrategicAreasCard = ({ areas }: StrategicAreasCardProps) => {
  const navigate = useNavigate();
  
  const handleCreateArea = () => {
    navigate("/strategic-areas/new");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="mr-2 h-5 w-5" />
          Strategic Areas
        </CardTitle>
        <CardDescription>
          Areas with defined strategic goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        {areas.length > 0 ? (
          <div className="space-y-2">
            {areas.map(area => (
              <div key={area.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                <span>{area.name}</span>
                <Button variant="ghost" size="sm" onClick={() => navigate(`/strategic-areas/${area.id}`)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No strategic areas defined</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleCreateArea}>Create Strategic Area</Button>
      </CardFooter>
    </Card>
  );
};

export default StrategicAreasCard;
