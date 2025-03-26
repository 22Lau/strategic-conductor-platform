
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }).max(100, {
    message: "Company name must be less than 100 characters.",
  }),
  areaName: z.string().min(2, {
    message: "Area name must be at least 2 characters.",
  }).max(100, {
    message: "Area name must be less than 100 characters.",
  }),
  areaResponsibilities: z.string().min(10, {
    message: "Please provide detailed area responsibilities.",
  }),
  strategicLine1: z.string().min(5, {
    message: "Strategic line must be at least 5 characters.",
  }),
  strategicLine2: z.string().optional(),
});

const NewOrganization = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      areaName: "Digital Sustainability Product Team",
      areaResponsibilities: "Strategic development of sustainable financial products\nRegulatory compliance and standards alignment\nStakeholder collaboration and cross-functional integration\nMarket research and customer-centric innovation\nESG risk management and due diligence\nCustomer education and transparency initiatives\nPerformance monitoring and impact measurement",
      strategicLine1: "Develop investment products with sustainability criteria",
      strategicLine2: "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Store the data in localStorage instead of the database
      localStorage.setItem('strategicPlanningData', JSON.stringify({
        companyName: values.companyName,
        areaName: values.areaName,
        areaResponsibilities: values.areaResponsibilities.split('\n').filter(r => r.trim() !== ''),
        strategicLines: [
          values.strategicLine1, 
          ...(values.strategicLine2 ? [values.strategicLine2] : [])
        ]
      }));
      
      toast({
        title: "Strategy data saved",
        description: `Strategic planning data for ${values.areaName} has been saved.`,
      });
      
      navigate('/strategy/contributions');
    } catch (error) {
      console.error('Error saving strategy data:', error);
      toast({
        title: "Failed to save strategy data",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Strategic Planning Setup</CardTitle>
          <CardDescription>
            Enter your company and area information to start the strategic deployment process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name or Sector</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name or sector" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="areaName"
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
                control={form.control}
                name="areaResponsibilities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area Responsibilities</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter area responsibilities (one per line)" 
                        className="min-h-[150px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="strategicLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strategic Line 1</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter primary strategic line" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="strategicLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strategic Line 2 (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter secondary strategic line (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="pt-4 flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/organizations')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save and Continue'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="border-t p-6">
          <div className="w-full space-y-4">
            <h3 className="text-lg font-medium">Example: Strategic Planning Implementation</h3>
            <div className="bg-muted p-4 rounded-md text-sm">
              <p className="font-semibold mb-2">Contribution of the Digital Sustainability Product Team to the Strategy of Bank X</p>
              <p className="font-semibold">Strategic Line: Develop investment products with sustainability criteria</p>
              
              <div className="mt-3">
                <p className="font-medium">Direct Contribution:</p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Strategic development of sustainable financial products → Design and launch investment products aligned with ESG standards.
                    <ul className="list-disc pl-6 italic">
                      <li>Example: Creation of an investment fund based on renewable energy.</li>
                    </ul>
                  </li>
                  <li>Regulatory compliance and alignment with standards → Ensures that products comply with ESG regulations and certifications.
                    <ul className="list-disc pl-6 italic">
                      <li>Example: Adaptation of the investment offering to the EU regulation on sustainable finance (SFDR).</li>
                    </ul>
                  </li>
                </ul>
              </div>
              
              <div className="mt-3">
                <p className="font-medium">Indirect Contribution:</p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Stakeholder collaboration and cross-functional integration → Facilitates alliances with regulatory bodies and strategic partners.
                    <ul className="list-disc pl-6 italic">
                      <li>Example: Participation in working groups with the financial regulator to define sustainable investment standards.</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NewOrganization;
