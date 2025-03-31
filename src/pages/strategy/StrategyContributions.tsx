
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Users, Target, PlusCircle } from "lucide-react";
import OrganizationsTab from "@/components/strategy/contributions/OrganizationsTab";
import StrategicAreasTab from "@/components/strategy/contributions/StrategicAreasTab";
import ContributionsTab from "@/components/strategy/contributions/ContributionsTab";
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

const StrategyContributions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [areas, setAreas] = useState<StrategicArea[]>([]);
  const [activeTab, setActiveTab] = useState("contributions");
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [strategicLines, setStrategicLines] = useState([
    "Customer Success", 
    "Operational Excellence", 
    "Innovation", 
    "Financial Growth"
  ]);
  
  useEffect(() => {
    const fetchOrganizations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_organizations')
          .select('organization_id, role, organizations(id, name)')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        // Explicitly type and transform the response data
        const orgs: Organization[] = (data as UserOrganizationResponse[] || []).map(item => ({
          id: item.organizations.id,
          name: item.organizations.name,
          role: item.role
        }));
        
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
  }, [user, toast]);
  
  useEffect(() => {
    const fetchAreas = async () => {
      if (!selectedOrganization) {
        setAreas([]);
        return;
      }
      
      try {
        setLoading(true);
        // Fetch areas by organization name
        const { data: rawData, error } = await supabase
          .from('strategic_areas')
          .select('*')
          .eq('organization_name', selectedOrganization);
          
        if (error) throw error;
        
        // Simplified approach: first cast to any array, then map to StrategicArea type
        const data = rawData as Array<Record<string, any>> || [];
        
        const areasData: StrategicArea[] = data.map(area => ({
          id: area.id,
          name: area.name,
          organization_id: area.organization_id,
          organization_name: area.organization_name,
          responsibilities: area.responsibilities,
          created_at: area.created_at,
          updated_at: area.updated_at
        }));
        
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
  
  const handleOrganizationSelected = (orgName: string) => {
    setSelectedOrganization(orgName);
  };
  
  const handleAreaSelected = (areaName: string) => {
    setSelectedArea(areaName);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => navigate("/")} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Step 1: Identify Area Contributions</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="organizations">
            <Users className="mr-2 h-4 w-4" /> Organizations
          </TabsTrigger>
          <TabsTrigger value="areas">
            <Target className="mr-2 h-4 w-4" /> Strategic Areas
          </TabsTrigger>
          <TabsTrigger value="contributions">
            <PlusCircle className="mr-2 h-4 w-4" /> Contributions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="organizations">
          <OrganizationsTab 
            organizations={organizations}
            loading={loading}
            setActiveTab={setActiveTab}
            onOrgCreated={handleOrganizationSelected}
            userId={user?.id}
          />
        </TabsContent>
        
        <TabsContent value="areas">
          <StrategicAreasTab 
            areas={areas}
            loading={loading}
            setActiveTab={setActiveTab}
            onAreaCreated={handleAreaSelected}
            selectedOrganization={selectedOrganization}
          />
        </TabsContent>
        
        <TabsContent value="contributions">
          <ContributionsTab 
            areas={areas}
            loading={loading}
            selectedOrganization={selectedOrganization}
            selectedArea={selectedArea}
            strategicLines={strategicLines}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrategyContributions;
