
import { format } from "date-fns";
import { Check, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Initiative } from "./InitiativeForm";

interface InitiativesListProps {
  initiatives: Initiative[];
  objectives: { id: string; title: string; kpis: string[] }[];
  onCreateNewInitiative: () => void;
}

const InitiativesList = ({ initiatives, objectives, onCreateNewInitiative }: InitiativesListProps) => {
  return (
    <div>
      {initiatives.length > 0 ? (
        <div className="space-y-6">
          {initiatives.map((initiative) => {
            const objective = objectives.find(o => o.id === initiative.objectiveId);
            return (
              <div key={initiative.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{initiative.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{initiative.description}</p>
                  </div>
                  <Badge 
                    className={cn(
                      "ml-2",
                      initiative.status === "planning" ? "bg-gray-200 text-gray-800" :
                      initiative.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                      "bg-green-100 text-green-800"
                    )}
                  >
                    {initiative.status === "planning" ? "Planning" :
                     initiative.status === "in-progress" ? "In Progress" : "Completed"}
                  </Badge>
                </div>
                
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Related Objective:</span>
                    <p>{objective?.title || "Unknown objective"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Responsible:</span>
                    <p>{initiative.responsiblePerson || "Not assigned"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Timeline:</span>
                    <p>{format(initiative.startDate, "MMM d, yyyy")} - {format(initiative.endDate, "MMM d, yyyy")}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium text-sm text-gray-500">Key Actions:</h4>
                  <ul className="mt-2 space-y-1">
                    {initiative.actions.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No initiatives created yet</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={onCreateNewInitiative}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Initiative
          </Button>
        </div>
      )}
    </div>
  );
};

export default InitiativesList;
