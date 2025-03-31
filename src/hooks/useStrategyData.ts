
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Organization, StrategicArea } from "@/types/strategy";

// Type for database responses
interface UserOrganizationResponse {
  organization_id: string;
  role: string;
  organizations: {
    id: string;
    name: string;
  };
}

// Define database response type for strategic areas
interface StrategicAreaRow {
  id: string;
  name: string;
  organization_id?: string;
  responsibilities?: string[];
  created_at?: string;
  updated_at?: string;
}

export const useStrategyData = (userId?: string) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [areas, setAreas] = useState<StrategicArea[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [strategicLines] = useState([
    "Customer Success", 
    "Operational Excellence", 
    "Innovation", 
    "Financial Growth"
  ]);
  
  useEffect(() => {
    const fetchOrganizations = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_organizations')
          .select('organization_id, role, organizations(id, name)')
          .eq('user_id', userId);
          
        if (error) throw error;
        
        // Safer type assertion with explicit mapping
        const orgs: Organization[] = [];
        if (data) {
          for (const item of data) {
            if (item && item.organizations) {
              orgs.push({
                id: item.organizations.id,
                name: item.organizations.name,
                role: item.role
              });
            }
          }
        }
        
        setOrganizations(orgs);
      } catch (error) {
        console.error('Error fetching organizations:', error);
        toast({
          title: "Failed to load organizations",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrganizations();
  }, [userId, toast]);
  
  useEffect(() => {
    const fetchAreas = async () => {
      if (!selectedOrganization) {
        setAreas([]);
        return;
      }
      
      try {
        setLoading(true);
        // Using organization name directly to fetch strategic areas
        // Fix: Change the query to use a join or use organization_id instead
        const { data, error } = await supabase
          .from('strategic_areas')
          .select('*')
          .eq('organization_id', selectedOrganization);
          
        if (error) throw error;
        
        // Explicitly map data to our StrategicArea type to avoid deep type instantiation
        const areasData: StrategicArea[] = data ? data.map((item: StrategicAreaRow) => ({
          id: item.id,
          name: item.name,
          organization_id: item.organization_id,
          organization_name: selectedOrganization,
          responsibilities: item.responsibilities || [],
          created_at: item.created_at,
          updated_at: item.updated_at
        })) : [];
        
        setAreas(areasData);
      } catch (error) {
        console.error('Error fetching areas:', error);
        toast({
          title: "Failed to load strategic areas",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAreas();
  }, [selectedOrganization, toast]);
  
  const handleOrganizationSelected = (orgId: string) => {
    setSelectedOrganization(orgId);
  };
  
  const handleAreaSelected = (areaName: string) => {
    setSelectedArea(areaName);
  };
  
  return {
    loading,
    organizations,
    areas,
    selectedOrganization,
    selectedArea,
    strategicLines,
    handleOrganizationSelected,
    handleAreaSelected
  };
};
