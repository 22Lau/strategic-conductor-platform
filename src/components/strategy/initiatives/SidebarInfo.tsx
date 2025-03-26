
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const BestPracticesCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Initiative Best Practices</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2 text-sm">
        <li>• Break initiatives into small, actionable steps</li>
        <li>• Assign clear responsibility for each initiative</li>
        <li>• Set realistic timelines with buffer for unexpected events</li>
        <li>• Ensure each initiative directly supports an objective</li>
        <li>• Consider resource constraints when planning</li>
        <li>• Focus on measurable outcomes for each action</li>
      </ul>
    </CardContent>
  </Card>
);

const CollaborationToolsCard = () => (
  <Card className="bg-blue-50 border-blue-200">
    <CardHeader>
      <CardTitle className="text-blue-800">Collaboration Tools</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-blue-800 mb-4">
        Share your strategy with stakeholders to enhance collaboration
      </p>
      <div className="space-y-2">
        <Button variant="outline" className="w-full justify-start" disabled>
          <PlusCircle className="mr-2 h-4 w-4" /> Share with Team
        </Button>
        <Button variant="outline" className="w-full justify-start" disabled>
          <PlusCircle className="mr-2 h-4 w-4" /> Set Up Notifications
        </Button>
        <Button variant="outline" className="w-full justify-start" disabled>
          <PlusCircle className="mr-2 h-4 w-4" /> Schedule Review Meeting
        </Button>
      </div>
    </CardContent>
  </Card>
);

const SidebarInfo = () => {
  return (
    <div className="space-y-6">
      <BestPracticesCard />
      <CollaborationToolsCard />
    </div>
  );
};

export default SidebarInfo;
