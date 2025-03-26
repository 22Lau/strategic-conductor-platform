
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const StrategicAreasList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStrategicAreas = async () => {
      try {
        // First get the organizations the user belongs to
        const { data: orgData, error: orgError } = await supabase
          .from('user_organizations')
          .select('organization_id')
          .eq('user_id', user?.id);
        
        if (orgError) throw orgError;
        
        const orgIds = orgData?.map(item => item.organization_id) || [];
        
        if (orgIds.length === 0) {
          setLoading(false);
          return;
        }
        
        // Then fetch strategic areas for those organizations
        const { data: areaData, error: areaError } = await supabase
          .from('strategic_areas')
          .select('*, organizations(name)')
          .in('organization_id', orgIds);
        
        if (areaError) throw areaError;
        
        setAreas(areaData || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching strategic areas:', error);
        toast({
          title: "Failed to load strategic areas",
          description: "Please try again later",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    fetchStrategicAreas();
  }, [user]);
  
  const handleCreateArea = () => {
    navigate('/strategic-areas/new');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Strategic Areas</h1>
        <Button onClick={handleCreateArea}>
          <Plus className="mr-2 h-4 w-4" /> New Strategic Area
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.length > 0 ? (
            areas.map(area => (
              <Card key={area.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    {area.name}
                  </CardTitle>
                  <CardDescription>
                    {area.organizations.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Responsibilities:</p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      {area.responsibilities.slice(0, 3).map((resp: string, i: number) => (
                        <li key={i}>{resp}</li>
                      ))}
                      {area.responsibilities.length > 3 && (
                        <li>+ {area.responsibilities.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate(`/strategic-areas/${area.id}`)}
                  >
                    View Details <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center p-12 border rounded-lg">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-medium mb-2">No Strategic Areas Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create strategic areas to define responsibilities and objectives
              </p>
              <Button onClick={handleCreateArea}>
                <Plus className="mr-2 h-4 w-4" /> Create Your First Strategic Area
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StrategicAreasList;
