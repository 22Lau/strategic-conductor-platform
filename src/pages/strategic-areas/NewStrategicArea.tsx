
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Area name must be at least 2 characters.",
  }),
  organizationId: z.string({
    required_error: "Please select an organization.",
  }),
  responsibilities: z.array(z.string()).min(1, {
    message: "Add at least one responsibility.",
  }),
});

const NewStrategicArea = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [newResponsibility, setNewResponsibility] = useState("");
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      organizationId: "",
      responsibilities: [],
    },
  });
  
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const { data, error } = await supabase
          .from('user_organizations')
          .select('organization_id, organizations(id, name)')
          .eq('user_id', user?.id);
        
        if (error) throw error;
        
        const orgs = data?.map(item => ({
          id: item.organizations.id,
          name: item.organizations.name,
        })) || [];
        
        setOrganizations(orgs);
        setLoadingOrgs(false);
      } catch (error) {
        console.error('Error fetching organizations:', error);
        toast({
          title: "Failed to load organizations",
          description: "Please try again later",
          variant: "destructive",
        });
        setLoadingOrgs(false);
      }
    };
    
    fetchOrganizations();
  }, [user]);
  
  const handleAddResponsibility = () => {
    if (!newResponsibility.trim()) return;
    
    const currentResponsibilities = form.getValues().responsibilities;
    form.setValue('responsibilities', [...currentResponsibilities, newResponsibility.trim()]);
    setNewResponsibility("");
  };
  
  const handleRemoveResponsibility = (index: number) => {
    const currentResponsibilities = form.getValues().responsibilities;
    form.setValue('responsibilities', 
      currentResponsibilities.filter((_, i) => i !== index)
    );
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('strategic_areas')
        .insert([{
          name: values.name,
          organization_id: values.organizationId,
          responsibilities: values.responsibilities,
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Strategic area created",
        description: `${values.name} has been created successfully.`,
      });
      
      navigate(`/strategic-areas/${data.id}`);
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
    <div className="container max-w-md mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Strategic Area</CardTitle>
          <CardDescription>
            Define a strategic area with responsibilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingOrgs ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                            <SelectItem key={org.id} value={org.id}>
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Marketing, R&D, Sales" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="responsibilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsibilities</FormLabel>
                      <div className="space-y-2">
                        {field.value.map((responsibility, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="flex-1 p-2 bg-muted rounded-md">
                              {responsibility}
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveResponsibility(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="flex mt-2 gap-2">
                        <Input
                          placeholder="Add a responsibility"
                          value={newResponsibility}
                          onChange={(e) => setNewResponsibility(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddResponsibility();
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          onClick={handleAddResponsibility}
                        >
                          Add
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/strategic-areas')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Strategic Area'}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewStrategicArea;
