import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, ArrowRight, PlusCircle, Save, Users, Target } from "lucide-react";

const StrategyContributions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("contributions");
  const [strategicLines, setStrategicLines] = useState([
    "Customer Success", 
    "Operational Excellence", 
    "Innovation", 
    "Financial Growth"
  ]);
  
  const form = useForm({
    defaultValues: {
      organizationId: "",
      organization: "", // New field for organization text input
      areaId: "",
      area: "", // New field for area text input
      strategicLine: "",
      contribution: "",
      examples: ""
    }
  });
  
  const orgForm = useForm({
    defaultValues: {
      name: "",
      description: ""
    }
  });
  
  const areaForm = useForm({
    defaultValues: {
      name: "",
      organizationId: "",
      organization: "", // New field for organization text input
      description: "",
      responsibilities: ""
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
  const watchedAreaOrgId = areaForm.watch("organizationId");
  
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
  }, [watchedOrgId, watchedAreaOrgId]);
  
  const onSubmit = async (values: any) => {
    setLoading(true);
    
    try {
      // Parse examples into an array
      const examplesArray = values.examples
        .split('\n')
        .filter((line: string) => line.trim() !== '')
        .map((line: string) => line.trim());
      
      // Find the selected area to get its ID
      let areaId = values.areaId;
      
      // If no area ID but we have an area name, try to find a matching area
      if (!areaId && values.area) {
        const matchingArea = areas.find(a => a.name === values.area);
        if (matchingArea) {
          areaId = matchingArea.id;
        }
      }
      
      // Submit with the area_id instead of area_name
      const { data, error } = await supabase
        .from('strategic_contributions')
        .insert({
          area_id: areaId,
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
  
  const handleCreateOrganization = async (values: any) => {
    setLoading(true);
    
    try {
      // Insert organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: values.name,
          description: values.description,
          created_by: user?.id
        })
        .select();
      
      if (orgError) throw orgError;
      
      // Add user as admin
      if (orgData && orgData[0]) {
        const { error: userOrgError } = await supabase
          .from('user_organizations')
          .insert({
            user_id: user?.id,
            organization_id: orgData[0].id,
            role: 'admin'
          });
        
        if (userOrgError) throw userOrgError;
        
        toast({
          title: "Organization created",
          description: "Your organization has been successfully created",
        });
        
        // Refresh organizations
        const { data: newOrgs, error: fetchError } = await supabase
          .from('user_organizations')
          .select('organization_id, role, organizations(id, name)')
          .eq('user_id', user?.id);
          
        if (fetchError) throw fetchError;
        
        const orgs = newOrgs?.map(item => ({
          id: item.organizations.id,
          name: item.organizations.name,
          role: item.role
        })) || [];
        
        setOrganizations(orgs);
        
        // Populate the organization field in the form with the new organization name
        form.setValue("organization", values.name);
        areaForm.setValue("organization", values.name);
        
        // Reset form
        orgForm.reset();
        
        // Switch to areas tab
        setActiveTab("areas");
      }
    } catch (error) {
      console.error('Error creating organization:', error);
      toast({
        title: "Failed to create organization",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateArea = async (values: any) => {
    setLoading(true);
    
    try {
      // Parse responsibilities into an array
      const responsibilitiesArray = values.responsibilities
        .split('\n')
        .filter((line: string) => line.trim() !== '')
        .map((line: string) => line.trim());
      
      // We'll now use the organization name instead of ID
      const { data, error } = await supabase
        .from('strategic_areas')
        .insert({
          name: values.name,
          organization_name: values.organization,
          description: values.description,
          responsibilities: responsibilitiesArray
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Strategic area created",
        description: "Your strategic area has been successfully created",
      });
      
      // Update the form with the new area name
      form.setValue("area", values.name);
      
      // Reset form
      areaForm.reset({
        ...areaForm.getValues(),
        name: "",
        description: "",
        responsibilities: ""
      });
      
      // Switch to contributions tab
      setActiveTab("contributions");
    } catch (error) {
      console.error('Error creating strategic area:', error);
      toast({
        title: "Failed to create strategic area",
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="organizations">
            <Users className="mr-2 h-4 w-4" /> Organizations
          </TabsTrigger>
          <TabsTrigger value="areas">
            <Target className="mr-2 h-4 w-4" /> Strategic Areas
          </TabsTrigger>
          <TabsTrigger value="contributions">
            <PlusCircle className="mr-2 h-4 w-4" /> Contributions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="organizations">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Organization</CardTitle>
                  <CardDescription>
                    Start by creating an organization to group your strategic areas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...orgForm}>
                    <form onSubmit={orgForm.handleSubmit(handleCreateOrganization)} className="space-y-6">
                      <FormField
                        control={orgForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter organization name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={orgForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Describe your organization" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => setActiveTab("areas")}>
                          Skip to Areas
                        </Button>
                        <Button type="submit" disabled={loading}>
                          Create Organization
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Your Organizations</CardTitle>
                  <CardDescription>Organizations you belong to</CardDescription>
                </CardHeader>
                <CardContent>
                  {organizations.length > 0 ? (
                    <div className="space-y-2">
                      {organizations.map(org => (
                        <div key={org.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                          <span>{org.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              form.setValue("organization", org.name);
                              areaForm.setValue("organization", org.name);
                              setActiveTab("areas");
                            }}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No organizations yet</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab("areas")}
                  >
                    Next: Define Strategic Areas
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="areas">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Create Strategic Area</CardTitle>
                  <CardDescription>
                    Define the strategic areas within your organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...areaForm}>
                    <form onSubmit={areaForm.handleSubmit(handleCreateArea)} className="space-y-6">
                      <FormField
                        control={areaForm.control}
                        name="organization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter organization name" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Enter the name of your organization
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={areaForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Area Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter area name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={areaForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Describe this strategic area" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={areaForm.control}
                        name="responsibilities"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Key Responsibilities</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List key responsibilities, one per line" 
                                className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Enter each responsibility on a new line
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => setActiveTab("contributions")}>
                          Skip to Contributions
                        </Button>
                        <Button type="submit" disabled={loading}>
                          Create Strategic Area
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Your Strategic Areas</CardTitle>
                  <CardDescription>Areas with defined strategic goals</CardDescription>
                </CardHeader>
                <CardContent>
                  {areas.length > 0 ? (
                    <div className="space-y-2">
                      {areas.map(area => (
                        <div key={area.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                          <span>{area.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              form.setValue("area", area.name);
                              setActiveTab("contributions");
                            }}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No strategic areas defined</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab("contributions")}
                  >
                    Next: Define Contributions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="contributions">
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
                          name="organization"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Organization</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter organization name" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Enter the name of your organization
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="area"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Strategic Area</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter strategic area name" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Enter the name of the strategic area
                              </FormDescription>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrategyContributions;
