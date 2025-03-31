
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";

interface OrganizationFormValues {
  name: string;
  description: string;
}

interface OrganizationsTabProps {
  organizations: any[];
  loading: boolean;
  setActiveTab: (tab: string) => void;
  onOrgCreated: (orgName: string) => void;
  userId?: string;
}

const OrganizationsTab = ({ 
  organizations, 
  loading, 
  setActiveTab, 
  onOrgCreated,
  userId 
}: OrganizationsTabProps) => {
  const { toast } = useToast();
  
  const orgForm = useForm<OrganizationFormValues>({
    defaultValues: {
      name: "",
      description: ""
    }
  });

  const handleCreateOrganization = async (values: OrganizationFormValues) => {
    if (!userId) return;
    
    try {
      // Insert organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: values.name,
          description: values.description,
          created_by: userId
        })
        .select();
      
      if (orgError) throw orgError;
      
      // Add user as admin
      if (orgData && orgData[0]) {
        const { error: userOrgError } = await supabase
          .from('user_organizations')
          .insert({
            user_id: userId,
            organization_id: orgData[0].id,
            role: 'admin'
          });
        
        if (userOrgError) throw userOrgError;
        
        toast({
          title: "Organization created",
          description: "Your organization has been successfully created",
        });
        
        // Notify parent component
        onOrgCreated(values.name);
        
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
    }
  };

  return (
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
                        onOrgCreated(org.name);
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
  );
};

export default OrganizationsTab;
