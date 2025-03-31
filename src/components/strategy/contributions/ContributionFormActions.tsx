
import { Button } from "@/components/ui/button";
import { ArrowRight, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ContributionFormActionsProps {
  loading: boolean;
}

const ContributionFormActions = ({ loading }: ContributionFormActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between">
      <Button type="button" variant="outline" onClick={() => navigate("/")}>
        Cancel
      </Button>
      <div className="space-x-2">
        <Button type="submit" disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          Save Contribution
        </Button>
        <Button 
          type="button"
          onClick={() => navigate("/strategy/objectives")}
        >
          Next Step
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ContributionFormActions;
