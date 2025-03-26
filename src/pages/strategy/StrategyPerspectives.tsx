
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, FileDown, PlusCircle, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// Mock data - this would come from the database in a real implementation
const mockInitiatives = [
  {
    id: "init1",
    title: "Integration of ESG metrics into digital banking",
    description: "Create interactive dashboards within the bank's app and website"
  },
  {
    id: "init2",
    title: "Fast-track innovation for ESG products",
    description: "Implement agile design, testing, and launch process based on lean methodologies"
  },
  {
    id: "init3",
    title: "ESG Academy",
    description: "Online courses, certifications, and events in partnership with universities"
  }
];

const experts = [
  { id: "exp1", name: "Technology", color: "bg-blue-100 text-blue-800" },
  { id: "exp2", name: "Talent and Culture", color: "bg-purple-100 text-purple-800" },
  { id: "exp3", name: "Risks", color: "bg-orange-100 text-orange-800" }
];

interface Perspective {
  initiativeId: string;
  expertId: string;
  argument: string;
}

const StrategyPerspectives = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [perspectives, setPerspectives] = useState<Perspective[]>([]);
  const [newPerspective, setNewPerspective] = useState<Partial<Perspective>>({});
  const [alternativeStrategies, setAlternativeStrategies] = useState<string[]>([]);
  const [newStrategy, setNewStrategy] = useState("");
  const [devilsAdvocate, setDevilsAdvocate] = useState<string[]>([]);
  const [newDevilPoint, setNewDevilPoint] = useState("");

  const handleAddPerspective = () => {
    if (!newPerspective.initiativeId || !newPerspective.expertId || !newPerspective.argument) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setPerspectives([...perspectives, newPerspective as Perspective]);
    setNewPerspective({});
    
    toast({
      title: "Perspective added",
      description: "The expert perspective has been added successfully"
    });
  };

  const handleAddStrategy = () => {
    if (newStrategy.trim()) {
      setAlternativeStrategies([...alternativeStrategies, newStrategy.trim()]);
      setNewStrategy("");
      
      toast({
        title: "Alternative strategy added",
        description: "Your alternative strategy has been added"
      });
    }
  };

  const handleAddDevilsPoint = () => {
    if (newDevilPoint.trim()) {
      setDevilsAdvocate([...devilsAdvocate, newDevilPoint.trim()]);
      setNewDevilPoint("");
      
      toast({
        title: "Devil's advocate point added",
        description: "Counter-argument has been added"
      });
    }
  };
  
  const handleExportStrategy = (format: "csv" | "pdf") => {
    // This would connect to a real export service in production
    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: "Your strategy export is being prepared"
    });
  };

  const getExpertColor = (expertId: string) => {
    const expert = experts.find(e => e.id === expertId);
    return expert?.color || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="outline" onClick={() => navigate("/strategy/initiatives")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Previous Step
          </Button>
          <h1 className="text-3xl font-bold">Step 4: Expert Perspectives</h1>
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
          <Tabs defaultValue="experts">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="experts">Expert Panel</TabsTrigger>
              <TabsTrigger value="devil">Devil's Advocate</TabsTrigger>
              <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
            </TabsList>
            
            <TabsContent value="experts">
              <Card>
                <CardHeader>
                  <CardTitle>Expert Panel Perspectives</CardTitle>
                  <CardDescription>
                    Gather insights from different departments on your strategic initiatives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="initiative">Initiative</Label>
                        <Select 
                          value={newPerspective.initiativeId} 
                          onValueChange={(value) => setNewPerspective({...newPerspective, initiativeId: value})}
                        >
                          <SelectTrigger id="initiative">
                            <SelectValue placeholder="Select an initiative" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockInitiatives.map(initiative => (
                              <SelectItem key={initiative.id} value={initiative.id}>
                                {initiative.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="expert">Expert Area</Label>
                        <Select 
                          value={newPerspective.expertId} 
                          onValueChange={(value) => setNewPerspective({...newPerspective, expertId: value})}
                        >
                          <SelectTrigger id="expert">
                            <SelectValue placeholder="Select an expert area" />
                          </SelectTrigger>
                          <SelectContent>
                            {experts.map(expert => (
                              <SelectItem key={expert.id} value={expert.id}>
                                {expert.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="argument">Expert Argument</Label>
                      <Textarea
                        id="argument"
                        placeholder="Enter the expert's perspective on this initiative..."
                        value={newPerspective.argument || ""}
                        onChange={(e) => setNewPerspective({...newPerspective, argument: e.target.value})}
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <Button className="w-full" onClick={handleAddPerspective}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Expert Perspective
                    </Button>
                    
                    {perspectives.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-medium text-lg mb-4">Perspective Matrix</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border p-2 text-left">Initiative</th>
                                {experts.map(expert => (
                                  <th key={expert.id} className="border p-2 text-left">
                                    {expert.name}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {mockInitiatives.map(initiative => (
                                <tr key={initiative.id}>
                                  <td className="border p-2 font-medium">{initiative.title}</td>
                                  {experts.map(expert => {
                                    const perspective = perspectives.find(
                                      p => p.initiativeId === initiative.id && p.expertId === expert.id
                                    );
                                    return (
                                      <td key={expert.id} className="border p-2">
                                        {perspective ? (
                                          <div>
                                            <Badge className={getExpertColor(expert.id)}>
                                              {expert.name}
                                            </Badge>
                                            <p className="mt-1 text-sm">{perspective.argument}</p>
                                          </div>
                                        ) : (
                                          <span className="text-gray-400 text-sm">No perspective yet</span>
                                        )}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="devil">
              <Card>
                <CardHeader>
                  <CardTitle>Devil's Advocate</CardTitle>
                  <CardDescription>
                    Challenge your strategy by identifying potential flaws and weaknesses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="devils-point">Counter-Argument</Label>
                      <Textarea
                        id="devils-point"
                        placeholder="Enter a critical perspective on your strategy..."
                        value={newDevilPoint}
                        onChange={(e) => setNewDevilPoint(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <Button className="w-full" onClick={handleAddDevilsPoint}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Counter-Argument
                    </Button>
                    
                    {devilsAdvocate.length > 0 && (
                      <div className="mt-6 space-y-4">
                        <h3 className="font-medium text-lg mb-2">Devil's Advocate Arguments</h3>
                        {devilsAdvocate.map((point, index) => (
                          <div key={index} className="p-4 border rounded-lg bg-red-50 border-red-100">
                            <div className="flex gap-2">
                              <Badge className="bg-red-100 text-red-800">Challenge {index + 1}</Badge>
                            </div>
                            <p className="mt-2">{point}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="alternatives">
              <Card>
                <CardHeader>
                  <CardTitle>Alternative Strategies</CardTitle>
                  <CardDescription>
                    Explore different approaches if your current strategy cannot be implemented
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="alternative">Alternative Strategy</Label>
                      <Textarea
                        id="alternative"
                        placeholder="If we couldn't implement this strategy, what other options would we have?"
                        value={newStrategy}
                        onChange={(e) => setNewStrategy(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <Button className="w-full" onClick={handleAddStrategy}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Alternative Strategy
                    </Button>
                    
                    {alternativeStrategies.length > 0 && (
                      <div className="mt-6 space-y-4">
                        <h3 className="font-medium text-lg mb-2">Alternative Approaches</h3>
                        {alternativeStrategies.map((strategy, index) => (
                          <div key={index} className="p-4 border rounded-lg bg-purple-50 border-purple-100">
                            <div className="flex gap-2">
                              <Badge className="bg-purple-100 text-purple-800">Option {index + 1}</Badge>
                            </div>
                            <p className="mt-2">{strategy}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => navigate("/strategy/initiatives")}>
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
              <CardTitle>Your Initiatives</CardTitle>
              <CardDescription>
                The initiatives being evaluated by experts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInitiatives.map((initiative) => (
                  <div key={initiative.id} className="p-3 border rounded-md">
                    <h3 className="font-medium">{initiative.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{initiative.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Expert Panel Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                  Consider different departmental perspectives
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                  Encourage constructive debate between experts
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                  Evaluate feasibility from multiple angles
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                  Identify cross-functional dependencies
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                  Focus on practical implementation concerns
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-800 mb-4">
                Our AI can help you analyze expert perspectives and identify the best path forward
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Generate AI Insights
              </Button>
              <p className="mt-4 text-xs text-blue-600">
                Using TensorFlow.js to analyze patterns and recommend optimal initiatives
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StrategyPerspectives;
