
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Settings, Trash } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const OrganizationsList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const { data, error } = await supabase
          .from('user_organizations')
          .select('organization_id, role, organizations(id, name)')
          .eq('user_id', user?.id);
        
        if (error) throw error;
        
        const orgs = data?.map(item => ({
          id: item.organizations.id,
          name: item.organizations.name,
          role: item.role
        })) || [];
        
        setOrganizations(orgs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching organizations:', error);
        toast({
          title: "Failed to load organizations",
          description: "Please try again later",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    fetchOrganizations();
  }, [user]);
  
  const handleCreateOrganization = () => {
    navigate('/organizations/new');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Organizations</h1>
        <Button onClick={handleCreateOrganization}>
          <Plus className="mr-2 h-4 w-4" /> New Organization
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.length > 0 ? (
            organizations.map(org => (
              <Card key={org.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    {org.name}
                  </CardTitle>
                  <CardDescription>
                    Your role: {org.role.charAt(0).toUpperCase() + org.role.slice(1)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Manage this organization's strategic areas, objectives, and team members.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => navigate(`/organizations/${org.id}`)}>
                    View
                  </Button>
                  {org.role === 'admin' && (
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => navigate(`/organizations/${org.id}/settings`)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center p-12 border rounded-lg">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-medium mb-2">No Organizations Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create an organization to start managing your strategic deployment
              </p>
              <Button onClick={handleCreateOrganization}>
                <Plus className="mr-2 h-4 w-4" /> Create Your First Organization
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrganizationsList;
