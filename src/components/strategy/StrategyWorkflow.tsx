
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Check, LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: "not-started" | "in-progress" | "completed";
  path: string;
}

const StrategyWorkflow = () => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      id: "step1",
      title: "Identify Area Contributions",
      description: "Define how your area contributes to each strategic line",
      status: "not-started",
      path: "/strategy/contributions"
    },
    {
      id: "step2",
      title: "Define Objectives & KPIs",
      description: "Set measurable objectives based on your contributions",
      status: "not-started",
      path: "/strategy/objectives"
    },
    {
      id: "step3",
      title: "Define Initiatives",
      description: "Create actionable initiatives for each objective",
      status: "not-started",
      path: "/strategy/initiatives"
    }
  ]);

  const handleStepClick = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (step) {
      navigate(step.path);
    }
  };
  
  const getStepStatusColor = (status: WorkflowStep["status"]) => {
    switch (status) {
      case "completed": 
        return "bg-green-100 border-green-500 text-green-800";
      case "in-progress": 
        return "bg-blue-100 border-blue-500 text-blue-800";
      default: 
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Strategic Deployment Process</h2>
        <p className="text-gray-600">Follow these steps to develop your strategic deployment plan</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step, index) => (
          <Card 
            key={step.id}
            className={`border-l-4 transition-all hover:shadow-md cursor-pointer ${getStepStatusColor(step.status)}`}
            onClick={() => handleStepClick(step.id)}
          >
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>{step.title}</CardTitle>
                <div className="rounded-full w-8 h-8 flex items-center justify-center font-bold bg-gray-200">
                  {index + 1}
                </div>
              </div>
              <CardDescription>{step.description}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-0 justify-between">
              <Button 
                variant="outline" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleStepClick(step.id);
                }}
              >
                {step.status === "not-started" ? "Start" : step.status === "in-progress" ? "Continue" : "View"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              {step.status === "completed" && (
                <span className="flex items-center text-sm text-green-600">
                  <Check className="mr-1 h-4 w-4" /> Complete
                </span>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StrategyWorkflow;
