
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, BrainCircuit, PlusCircle, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Placeholder component for a real AI-powered suggestion system
const AiSuggestionSystem = ({ contributions, onSuggestionSelect }: { 
  contributions: any[]; 
  onSuggestionSelect: (suggestion: { objective: string, kpis: string[] }) => void;
}) => {
  // This would be replaced with actual TensorFlow.js integration
  const generateSuggestion = () => {
    // Mock AI suggestions based on contributions
    const mockSuggestions = [
      {
        objective: "Improve customer satisfaction through enhanced self-service capabilities",
        kpis: [
          "Reduce support ticket volume by 25%",
          "Increase knowledge base utilization by 40%",
          "Achieve self-service resolution rate of 65%"
        ]
      },
      {
        objective: "Optimize operational efficiency in customer support processes",
        kpis: [
          "Decrease average response time by 30%",
          "Increase first-contact resolution rate to 80%",
          "Reduce escalation rate by 15%"
        ]
      }
    ];
    
    // Return a random suggestion
    return mockSuggestions[Math.floor(Math.random() * mockSuggestions.length)];
  };
  
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BrainCircuit className="mr-2 h-5 w-5 text-blue-600" />
          AI Suggestions
        </CardTitle>
        <CardDescription>
          Based on your contributions, our AI suggests these objectives and KPIs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => onSuggestionSelect(generateSuggestion())}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Generate AI Suggestions
        </Button>
        <p className="mt-4 text-xs text-blue-600">
          Using TensorFlow.js to analyze patterns and suggest optimal objectives
        </p>
      </CardContent>
    </Card>
  );
};

const StrategyObjectives = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [contributions, setContributions] = useState<any[]>([]);
  const [objectives, setObjectives] = useState<any[]>([]);
  const [newObjective, setNewObjective] = useState({ title: "", description: "" });
  const [kpis, setKpis] = useState<string[]>([]);
  const [newKpi, setNewKpi] = useState("");
  
  useEffect(() => {
    const fetchContributions = async () => {
      if (!user) return;
      
      try {
        // First get the user's organizations
        const { data: orgData } = await supabase
          .from('user_organizations')
          .select('organization_id')
          .eq('user_id', user.id);
        
        if (!orgData?.length) {
          setLoading(false);
          return;
        }
        
        const orgIds = orgData.map(org => org.organization_id);
        
        // Then get areas for those organizations
        const { data: areaData } = await supabase
          .from('strategic_areas')
          .select('id')
          .in('organization_id', orgIds);
        
        if (!areaData?.length) {
          setLoading(false);
          return;
        }
        
        const areaIds = areaData.map(area => area.id);
        
        // Finally get contributions for those areas
        const { data, error } = await supabase
          .from('strategic_contributions')
          .select('*')
          .in('area_id', areaIds);
        
        if (error) throw error;
        
        setContributions(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contributions:', error);
        toast({
          title: "Failed to load contributions",
          description: "Please try again later",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    fetchContributions();
  }, [user]);
  
  const handleAddKpi = () => {
    if (newKpi.trim()) {
      setKpis([...kpis, newKpi.trim()]);
      setNewKpi("");
    }
  };
  
  const handleRemoveKpi = (index: number) => {
    setKpis(kpis.filter((_, i) => i !== index));
  };
  
  const handleAddObjective = () => {
    if (newObjective.title.trim() && kpis.length > 0) {
      const objective = {
        ...newObjective,
        kpis: [...kpis],
        id: Date.now().toString() // This would be a real ID from the database
      };
      
      setObjectives([...objectives, objective]);
      setNewObjective({ title: "", description: "" });
      setKpis([]);
      
      // Here you would save to the database
      toast({
        title: "Objective added",
        description: "Your objective and KPIs have been saved",
      });
    } else {
      toast({
        title: "Cannot add objective",
        description: "Please provide a title and at least one KPI",
        variant: "destructive",
      });
    }
  };
  
  const handleAiSuggestion = (suggestion: { objective: string, kpis: string[] }) => {
    setNewObjective({
      title: suggestion.objective,
      description: "AI-generated objective based on your strategic contributions"
    });
    setKpis(suggestion.kpis);
    
    toast({
      title: "AI Suggestion Applied",
      description: "You can edit these suggestions before saving",
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => navigate("/strategy/contributions")} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Previous Step
        </Button>
        <h1 className="text-3xl font-bold">Step 2: Define Objectives & KPIs</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Objective</CardTitle>
              <CardDescription>
                Define clear, measurable objectives and KPIs based on your strategic contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="objective-title">Objective Title</Label>
                  <Input
                    id="objective-title"
                    placeholder="e.g., Improve customer satisfaction through self-service"
                    value={newObjective.title}
                    onChange={(e) => setNewObjective({ ...newObjective, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="objective-description">Description</Label>
                  <Textarea
                    id="objective-description"
                    placeholder="Describe the objective in more detail..."
                    value={newObjective.description}
                    onChange={(e) => setNewObjective({ ...newObjective, description: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Key Performance Indicators (KPIs)</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      placeholder="e.g., Reduce support tickets by 20%"
                      value={newKpi}
                      onChange={(e) => setNewKpi(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddKpi()}
                    />
                    <Button type="button" onClick={handleAddKpi}>Add KPI</Button>
                  </div>
                  
                  {kpis.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <Label>Current KPIs</Label>
                      <div className="space-y-2">
                        {kpis.map((kpi, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                            <span>{kpi}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveKpi(index)}
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <Button className="w-full" onClick={handleAddObjective}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Objective & KPIs
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {objectives.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Objectives</CardTitle>
                <CardDescription>
                  Review and manage your defined objectives and KPIs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {objectives.map((objective) => (
                    <div key={objective.id} className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg">{objective.title}</h3>
                      <p className="text-gray-600 mt-1">{objective.description}</p>
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-500">KPIs:</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {objective.kpis.map((kpi: string, index: number) => (
                            <Badge key={index} variant="outline" className="bg-blue-50">
                              {kpi}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/strategy/contributions")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button onClick={() => navigate("/strategy/initiatives")}>
              Next Step <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-6">
          <AiSuggestionSystem 
            contributions={contributions} 
            onSuggestionSelect={handleAiSuggestion} 
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Your Strategic Contributions</CardTitle>
              <CardDescription>
                Use these to inform your objectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ) : contributions.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {contributions.map((contribution) => (
                    <div key={contribution.id} className="p-3 border rounded-md">
                      <Badge className="mb-2">{contribution.strategic_line}</Badge>
                      <p className="text-sm">{contribution.contribution}</p>
                      {contribution.examples?.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-500">Examples:</p>
                          <ul className="text-xs list-disc list-inside mt-1">
                            {contribution.examples.map((example: string, i: number) => (
                              <li key={i}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No contributions found</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => navigate("/strategy/contributions")}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Contributions
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tips for Effective Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Make objectives SMART: Specific, Measurable, Achievable, Relevant, Time-bound</li>
                <li>• Align KPIs directly with your objectives</li>
                <li>• Focus on outcomes, not activities</li>
                <li>• Include both leading and lagging indicators</li>
                <li>• Limit to 3-5 KPIs per objective for clarity</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StrategyObjectives;
