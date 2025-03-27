
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import StrategicProgressCard from "@/components/dashboard/StrategicProgressCard";
import UpcomingDeadlines from "@/components/dashboard/UpcomingDeadlines";
import StrategyWorkflow from "@/components/strategy/StrategyWorkflow";
import DashboardLoading from "@/components/dashboard/DashboardLoading";

const Dashboard = () => {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch organizations where the user is a member
        const { data: orgData, error: orgError } = await supabase
          .from('user_organizations')
          .select('organization_id, role, organizations(id, name)')
          .eq('user_id', user?.id);
        
        if (orgError) throw orgError;
        
        const orgs = orgData?.map(item => ({
          id: item.organizations.id,
          name: item.organizations.name,
          role: item.role
        })) || [];
        
        setOrganizations(orgs);
        
        // Fetch strategic areas if user has organizations
        if (orgs.length > 0) {
          const { data: areaData, error: areaError } = await supabase
            .from('strategic_areas')
            .select('*')
            .in('organization_id', orgs.map(org => org.id));
          
          if (areaError) throw areaError;
          setAreas(areaData || []);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Failed to load dashboard data",
          description: "Please try again later",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {loading ? (
        <DashboardLoading />
      ) : (
        <>
          <DashboardMetrics 
            organizationCount={organizations.length} 
            strategicAreasCount={areas.length} 
          />
          
          {/* Strategic Deployment Process */}
          <div className="mb-8">
            <StrategyWorkflow />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <StrategicProgressCard />
            <UpcomingDeadlines />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
