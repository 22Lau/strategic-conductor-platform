
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AreaFormValues {
  name: string;
  organization: string;
  description: string;
  responsibilities: string;
}

interface AreaFormProps {
  loading: boolean;
  setActiveTab: (tab: string) => void;
  onAreaCreated: (areaName: string) => void;
  selectedOrganization: string;
}

const AreaForm = ({ 
  loading, 
  setActiveTab, 
  onAreaCreated, 
  selectedOrganization 
}: AreaFormProps) => {
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
  );
};

export default AreaForm;
