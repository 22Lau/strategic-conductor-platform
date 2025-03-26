
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, FileDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import our new component files
import InitiativeForm, { Initiative } from "@/components/strategy/initiatives/InitiativeForm";
import InitiativesList from "@/components/strategy/initiatives/InitiativesList";
import ObjectivesSidebar from "@/components/strategy/initiatives/ObjectivesSidebar";
import SidebarInfo from "@/components/strategy/initiatives/SidebarInfo";

// Mock data - this would come from the database in a real implementation
const mockObjectives = [
  {
    id: "obj1",
    title: "Improve customer satisfaction through enhanced self-service capabilities",
    kpis: [
      "Reduce support ticket volume by 25%",
      "Increase knowledge base utilization by 40%"
    ]
  },
  {
    id: "obj2",
    title: "Optimize operational efficiency in customer support processes",
    kpis: [
      "Decrease average response time by 30%",
      "Increase first-contact resolution rate to 80%"
    ]
  }
];

const StrategyInitiatives = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [objectives] = useState(mockObjectives);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [currentTab, setCurrentTab] = useState("create");
  
  const handleSaveInitiative = (newInitiative: Omit<Initiative, "id">) => {
    const initiative: Initiative = {
      id: Date.now().toString(), // In real app, this would be from the database
      ...newInitiative
    };
    
    setInitiatives([...initiatives, initiative]);
    
    toast({
      title: "Initiative created",
      description: "Your initiative has been added successfully"
    });
  };
  
  const handleExportStrategy = (format: "csv" | "pdf") => {
    // This would connect to a real export service in production
    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: "Your strategy export is being prepared"
    });
  };
  
  const switchToCreateTab = () => {
    setCurrentTab("create");
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="outline" onClick={() => navigate("/strategy/objectives")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Previous Step
          </Button>
          <h1 className="text-3xl font-bold">Step 3: Define Initiatives</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleExportStrategy("csv")}>
            <FileDown className="h-4 w-4 mr-2" /> Export CSV
          </Button>
          <Button onClick={() => handleExportStrategy("pdf")}>
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="create">Create Initiative</TabsTrigger>
              <TabsTrigger value="view">View Initiatives</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Initiative</CardTitle>
                  <CardDescription>
                    Define actionable initiatives to achieve your strategic objectives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InitiativeForm 
                    objectives={objectives} 
                    onSaveInitiative={handleSaveInitiative} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="view">
              <Card>
                <CardHeader>
                  <CardTitle>Your Initiatives</CardTitle>
                  <CardDescription>
                    Track and manage your strategic initiatives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InitiativesList 
                    initiatives={initiatives} 
                    objectives={objectives}
                    onCreateNewInitiative={switchToCreateTab}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => navigate("/strategy/objectives")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button onClick={() => navigate("/")}>
              Finish
            </Button>
          </div>
        </div>
        
        <div className="space-y-6">
          <ObjectivesSidebar objectives={objectives} />
          <SidebarInfo />
        </div>
      </div>
    </div>
  );
};

export default StrategyInitiatives;
