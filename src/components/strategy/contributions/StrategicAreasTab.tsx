
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";

interface AreaFormValues {
  name: string;
  organization: string;
  description: string;
  responsibilities: string;
}

interface StrategicAreasTabProps {
  areas: any[];
  loading: boolean;
  setActiveTab: (tab: string) => void;
  onAreaCreated: (areaName: string) => void;
  selectedOrganization: string;
}

const StrategicAreasTab = ({ 
  areas, 
  loading, 
  setActiveTab, 
  onAreaCreated,
  selectedOrganization 
}: StrategicAreasTabProps) => {
  const { toast } = useToast();
  
  const areaForm = useForm<AreaFormValues>({
    defaultValues: {
      name: "",
      organization: selectedOrganization || "",
      description: "",
      responsibilities: ""
    }
  });

  // Update form when selected organization changes
  useState(() => {
    if (selectedOrganization) {
      areaForm.setValue("organization", selectedOrganization);
    }
  });

  const handleCreateArea = async (values: AreaFormValues) => {
    try {
      // Parse responsibilities into an array
      const responsibilitiesArray = values.responsibilities
        .split('\n')
        .filter((line: string) => line.trim() !== '')
        .map((line: string) => line.trim());
      
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
      
      // Notify parent component
      onAreaCreated(values.name);
      
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
    }
  };

  return (
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
                        onAreaCreated(area.name);
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
  );
};

export default StrategicAreasTab;
