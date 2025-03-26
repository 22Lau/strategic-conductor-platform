
import { Calendar, CheckCircle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const UpcomingDeadlines = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Upcoming Deadlines
        </CardTitle>
        <CardDescription>
          Key milestones and deadlines
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-2 bg-muted rounded-md">
          <div>
            <p className="font-medium">Strategy Review</p>
            <p className="text-sm text-muted-foreground">Due in 2 weeks</p>
          </div>
          <CheckCircle className="h-5 w-5 text-orange-500" />
        </div>
        <div className="flex items-center justify-between p-2 bg-muted rounded-md">
          <div>
            <p className="font-medium">Q3 Objectives</p>
            <p className="text-sm text-muted-foreground">Due in 3 weeks</p>
          </div>
          <CheckCircle className="h-5 w-5 text-green-500" />
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => navigate("/strategy/objectives")}>
          View All <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingDeadlines;
