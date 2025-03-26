
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, Download, FileDown, PlusCircle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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

interface Initiative {
  id: string;
  objectiveId: string;
  title: string;
  description: string;
  responsiblePerson: string;
  startDate: Date;
  endDate: Date;
  status: "planning" | "in-progress" | "completed";
  actions: string[];
}

const StrategyInitiatives = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [objectives] = useState(mockObjectives);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [newInitiative, setNewInitiative] = useState<Partial<Initiative>>({
    objectiveId: "",
    title: "",
    description: "",
    responsiblePerson: "",
    status: "planning",
    actions: []
  });
  const [newAction, setNewAction] = useState("");
  
  const handleAddAction = () => {
    if (newAction.trim()) {
      setNewInitiative({
        ...newInitiative,
        actions: [...(newInitiative.actions || []), newAction.trim()]
      });
      setNewAction("");
    }
  };
  
  const handleRemoveAction = (index: number) => {
    setNewInitiative({
      ...newInitiative,
      actions: (newInitiative.actions || []).filter((_, i) => i !== index)
    });
  };
  
  const handleSaveInitiative = () => {
    // Validate form
    if (!newInitiative.objectiveId || !newInitiative.title || !newInitiative.startDate || !newInitiative.endDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const initiative: Initiative = {
      id: Date.now().toString(), // In real app, this would be from the database
      objectiveId: newInitiative.objectiveId!,
      title: newInitiative.title!,
      description: newInitiative.description || "",
      responsiblePerson: newInitiative.responsiblePerson || "",
      startDate: newInitiative.startDate!,
      endDate: newInitiative.endDate!,
      status: newInitiative.status as "planning" | "in-progress" | "completed",
      actions: newInitiative.actions || []
    };
    
    setInitiatives([...initiatives, initiative]);
    
    // Reset form
    setNewInitiative({
      objectiveId: "",
      title: "",
      description: "",
      responsiblePerson: "",
      status: "planning",
      actions: []
    });
    
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
          <Tabs defaultValue="create">
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
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="objective">Related Objective</Label>
                      <Select 
                        value={newInitiative.objectiveId} 
                        onValueChange={(value) => setNewInitiative({...newInitiative, objectiveId: value})}
                      >
                        <SelectTrigger id="objective">
                          <SelectValue placeholder="Select an objective" />
                        </SelectTrigger>
                        <SelectContent>
                          {objectives.map(objective => (
                            <SelectItem key={objective.id} value={objective.id}>
                              {objective.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="initiative-title">Initiative Title</Label>
                      <Input
                        id="initiative-title"
                        placeholder="e.g., Implement customer knowledge base"
                        value={newInitiative.title || ""}
                        onChange={(e) => setNewInitiative({...newInitiative, title: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="initiative-description">Description</Label>
                      <Textarea
                        id="initiative-description"
                        placeholder="Describe the initiative in detail..."
                        value={newInitiative.description || ""}
                        onChange={(e) => setNewInitiative({...newInitiative, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="responsible">Responsible Person</Label>
                        <Input
                          id="responsible"
                          placeholder="Name of person responsible"
                          value={newInitiative.responsiblePerson || ""}
                          onChange={(e) => setNewInitiative({...newInitiative, responsiblePerson: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select 
                          value={newInitiative.status} 
                          onValueChange={(value: "planning" | "in-progress" | "completed") => 
                            setNewInitiative({...newInitiative, status: value})}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planning">Planning</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !newInitiative.startDate && "text-muted-foreground"
                              )}
                            >
                              {newInitiative.startDate ? (
                                format(newInitiative.startDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={newInitiative.startDate}
                              onSelect={(date) => setNewInitiative({...newInitiative, startDate: date!})}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div>
                        <Label>End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !newInitiative.endDate && "text-muted-foreground"
                              )}
                            >
                              {newInitiative.endDate ? (
                                format(newInitiative.endDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={newInitiative.endDate}
                              onSelect={(date) => setNewInitiative({...newInitiative, endDate: date!})}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Key Actions</Label>
                      <div className="flex space-x-2 mt-1">
                        <Input
                          placeholder="Add a specific action item"
                          value={newAction}
                          onChange={(e) => setNewAction(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddAction()}
                        />
                        <Button type="button" onClick={handleAddAction}>Add</Button>
                      </div>
                      
                      {(newInitiative.actions?.length || 0) > 0 && (
                        <div className="mt-4 space-y-2">
                          <Label>Actions List</Label>
                          <div className="space-y-2">
                            {newInitiative.actions?.map((action, index) => (
                              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                                <span>{action}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleRemoveAction(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Button className="w-full" onClick={handleSaveInitiative}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Save Initiative
                    </Button>
                  </div>
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
                        onClick={() => document.querySelector('[data-value="create"]')?.click()}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Initiative
                      </Button>
                    </div>
                  )}
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
        </div>
      </div>
    </div>
  );
};

export default StrategyInitiatives;
