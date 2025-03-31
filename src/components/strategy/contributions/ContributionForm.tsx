
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ContributionFormFields from "./ContributionFormFields";
import ContributionFormActions from "./ContributionFormActions";
import { ContributionSubmitValues, submitContribution } from "./utils/formSubmission";

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
  
  const form = useForm<ContributionSubmitValues>({
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

  const onSubmit = async (values: ContributionSubmitValues) => {
    try {
      await submitContribution(values, areas);
      
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
            <ContributionFormFields 
              form={form} 
              strategicLines={strategicLines}
            />
            
            <ContributionFormActions loading={loading} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContributionForm;
