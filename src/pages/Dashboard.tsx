
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, TrendingUp, Users, Target, Calendar, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import DashboardChart from "@/components/dashboard/DashboardChart";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
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
  
  const handleCreateOrg = () => {
    navigate("/organizations/new");
  };
  
  const handleCreateArea = () => {
    navigate("/strategic-areas/new");
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          <DashboardMetrics 
            organizationCount={organizations.length} 
            strategicAreasCount={areas.length} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Strategic Progress
                </CardTitle>
                <CardDescription>
                  Progress on your strategic initiatives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardChart />
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => navigate("/strategy/progress")}>
                  View Details <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Upcoming Deadlines
                </CardTitle>
                <CardDescription>
                  Key milestones and deadlines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <div>
                    <p className="font-medium">Strategy Review</p>
                    <p className="text-sm text-muted-foreground">Due in 2 weeks</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <div>
                    <p className="font-medium">Q3 Objectives</p>
                    <p className="text-sm text-muted-foreground">Due in 3 weeks</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => navigate("/deadlines")}>
                  View All <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Organizations
                </CardTitle>
                <CardDescription>
                  Organizations you're a member of
                </CardDescription>
              </CardHeader>
              <CardContent>
                {organizations.length > 0 ? (
                  <div className="space-y-2">
                    {organizations.map(org => (
                      <div key={org.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                        <span>{org.name}</span>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/organizations/${org.id}`)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No organizations yet</p>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleCreateOrg}>Create Organization</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Strategic Areas
                </CardTitle>
                <CardDescription>
                  Areas with defined strategic goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                {areas.length > 0 ? (
                  <div className="space-y-2">
                    {areas.map(area => (
                      <div key={area.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                        <span>{area.name}</span>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/strategic-areas/${area.id}`)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No strategic areas defined</p>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleCreateArea}>Create Strategic Area</Button>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
