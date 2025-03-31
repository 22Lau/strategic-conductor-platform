
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Save } from "lucide-react";

interface ContributionFormValues {
  organizationId: string;
  organization: string;
  areaId: string;
  area: string;
  strategicLine: string;
  contribution: string;
  examples: string;
}

interface ContributionFormProps {
  areas: any[];
  loading: boolean;
  selectedOrganization: string;
  selectedArea: string;
  strategicLines: string[];
}

const ContributionForm = ({ 
  areas, 
  loading, 
  selectedOrganization, 
  selectedArea,
  strategicLines 
}: ContributionFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<ContributionFormValues>({
    defaultValues: {
      organizationId: "",
      organization: selectedOrganization || "", 
      areaId: "",
      area: selectedArea || "",
      strategicLine: "",
      contribution: "",
      examples: ""
    }
  });

  const onSubmit = async (values: ContributionFormValues) => {
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
    }
  };

  return (
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
  );
};

export default ContributionForm;
