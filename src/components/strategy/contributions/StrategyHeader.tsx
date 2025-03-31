
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StrategyHeaderProps {
  title: string;
}

const StrategyHeader = ({ title }: StrategyHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center mb-6">
      <Button variant="outline" onClick={() => navigate("/")} className="mr-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
      </Button>
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
};

export default StrategyHeader;
