
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ContributionSubmitValues } from "./utils/formSubmission";

interface ContributionFormFieldsProps {
  form: UseFormReturn<ContributionSubmitValues>;
  strategicLines: string[];
}

const ContributionFormFields = ({ form, strategicLines }: ContributionFormFieldsProps) => {
  return (
    <>
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
    </>
  );
};

export default ContributionFormFields;
