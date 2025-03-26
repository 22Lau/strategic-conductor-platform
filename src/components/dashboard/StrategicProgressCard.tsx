
import { ChevronRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardChart from "./DashboardChart";

const StrategicProgressCard = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          Strategic Progress
        </CardTitle>
        <CardDescription>
          Progress on your strategic initiatives
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DashboardChart />
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => navigate("/strategy/contributions")}>
          View Details <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StrategicProgressCard;
