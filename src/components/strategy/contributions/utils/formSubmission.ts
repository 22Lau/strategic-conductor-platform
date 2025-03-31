
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ContributionSubmitValues {
  organizationId: string;
  organization: string;
  areaId: string;
  area: string;
  strategicLine: string;
  contribution: string;
  examples: string;
}

export const prepareExamplesForSubmission = (examples: string): string[] => {
  return examples
    .split('\n')
    .filter((line: string) => line.trim() !== '')
    .map((line: string) => line.trim());
};

export const findAreaId = (areas: any[], areaName: string): string => {
  const matchingArea = areas.find(a => a.name === areaName);
  return matchingArea ? matchingArea.id : "";
};

export const submitContribution = async (values: ContributionSubmitValues, areas: any[]) => {
  // Find the selected area to get its ID
  let areaId = values.areaId;
      
  // If no area ID but we have an area name, try to find a matching area
  if (!areaId && values.area) {
    areaId = findAreaId(areas, values.area);
  }
  
  // Parse examples into an array
  const examplesArray = prepareExamplesForSubmission(values.examples);
  
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
  
  return data;
};
