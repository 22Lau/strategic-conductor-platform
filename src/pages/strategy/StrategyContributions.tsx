
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, ArrowRight, PlusCircle, Save } from "lucide-react";

const StrategyContributions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [strategicLines, setStrategicLines] = useState([
    "Customer Success", 
    "Operational Excellence", 
    "Innovation", 
    "Financial Growth"
  ]);
  
  const form = useForm({
    defaultValues: {
      organizationId: "",
      areaId: "",
      strategicLine: "",
      contribution: "",
      examples: ""
    }
  });
  
  useEffect(() => {
    const fetchOrganizations = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_organizations')
          .select('organization_id, role, organizations(id, name)')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        const orgs = data?.map(item => ({
          id: item.organizations.id,
          name: item.organizations.name,
          role: item.role
        })) || [];
        
        setOrganizations(orgs);
      } catch (error) {
        console.error('Error fetching organizations:', error);
        toast({
          title: "Failed to load organizations",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };
    
    fetchOrganizations();
  }, [user]);
  
  // Watch for organization changes to fetch areas
  const watchedOrgId = form.watch("organizationId");
  
  useEffect(() => {
    const fetchAreas = async () => {
      if (!watchedOrgId) {
        setAreas([]);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('strategic_areas')
          .select('*')
          .eq('organization_id', watchedOrgId);
          
        if (error) throw error;
        
        setAreas(data || []);
      } catch (error) {
        console.error('Error fetching areas:', error);
        toast({
          title: "Failed to load strategic areas",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };
    
    fetchAreas();
  }, [watchedOrgId]);
  
  const onSubmit = async (values: any) => {
    setLoading(true);
    
    try {
      // Parse examples into an array
      const examplesArray = values.examples
        .split('\n')
        .filter((line: string) => line.trim() !== '')
        .map((line: string) => line.trim());
      
      const { data, error } = await supabase
        .from('strategic_contributions')
        .insert({
          area_id: values.areaId,
          strategic_line: values.strategicLine,
          contribution: values.contribution,
          examples: examplesArray
        });
      
      if (error) throw error;
      
      toast({
        title: "Strategic contribution saved",
        description: "Your contribution has been successfully recorded",
      });
      
      // Reset form fields
      form.reset({
        ...form.getValues(),
        strategicLine: "",
        contribution: "",
        examples: ""
      });
      
    } catch (error) {
      console.error('Error saving contribution:', error);
      toast({
        title: "Failed to save contribution",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => navigate("/")} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Step 1: Identify Area Contributions</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Define Strategic Contributions</CardTitle>
              <CardDescription>
                Explain how your area contributes to each company strategic line with concrete examples
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="organizationId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an organization" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {organizations.map(org => (
                                <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="areaId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Strategic Area</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={!watchedOrgId || areas.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an area" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {areas.map(area => (
                                <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {areas.length === 0 && watchedOrgId && (
                            <div className="mt-2">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => navigate("/strategic-areas/new")}
                              >
                                <PlusCircle className="h-4 w-4 mr-2" /> Create Area
                              </Button>
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="strategicLine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Strategic Line</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a strategic line" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {strategicLines.map(line => (
                              <SelectItem key={line} value={line}>{line}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Area's Contribution</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe how your area contributes to this strategic line..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Be specific about how your area's activities directly impact this strategic line
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="examples"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Concrete Examples</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide concrete examples, one per line..." 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Add one example per line to illustrate your contribution with real cases
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => navigate("/")}>
                      Cancel
                    </Button>
                    <div className="space-x-2">
                      <Button type="submit" disabled={loading}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Contribution
                      </Button>
                      <Button 
                        type="button"
                        onClick={() => navigate("/strategy/objectives")}
                      >
                        Next Step
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Guidance</CardTitle>
              <CardDescription>Tips for defining strong strategic contributions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-gray-500 uppercase">What Makes a Good Contribution?</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  <li>• Focus on measurable impact rather than activities</li>
                  <li>• Link directly to the strategic line's objectives</li>
                  <li>• Be specific and actionable</li>
                  <li>• Consider both short and long-term effects</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-gray-500 uppercase">Example</h3>
                <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                  <strong>Strategic Line:</strong> Customer Success<br />
                  <strong>Contribution:</strong> Develop self-service knowledge base to reduce support tickets and improve customer satisfaction<br />
                  <strong>Examples:</strong><br />
                  - Create searchable FAQ section based on common tickets<br />
                  - Implement video tutorials for complex features<br />
                  - Build customer feedback loop to continuously improve resources
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StrategyContributions;
