
import { ChevronRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface OrganizationsCardProps {
  organizations: Array<{ id: string; name: string; role: string }>;
}

const OrganizationsCard = ({ organizations }: OrganizationsCardProps) => {
  const navigate = useNavigate();
  
  const handleCreateOrg = () => {
    navigate("/organizations/new");
  };
  
  return (
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
  );
};

export default OrganizationsCard;
