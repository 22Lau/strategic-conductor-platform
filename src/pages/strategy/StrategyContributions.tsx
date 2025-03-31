
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useStrategyData } from "@/hooks/useStrategyData";
import StrategyHeader from "@/components/strategy/contributions/StrategyHeader";
import StrategyTabs from "@/components/strategy/contributions/StrategyTabs";

const StrategyContributions = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("contributions");
  
  const {
    loading,
    organizations,
    areas,
    selectedOrganization,
    selectedArea,
    strategicLines,
    handleOrganizationSelected,
    handleAreaSelected
  } = useStrategyData(user?.id);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <StrategyHeader title="Step 1: Identify Area Contributions" />
      
      <StrategyTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        organizations={organizations}
        areas={areas}
        loading={loading}
        userId={user?.id}
        selectedOrganization={selectedOrganization}
        selectedArea={selectedArea}
        strategicLines={strategicLines}
        onOrgCreated={handleOrganizationSelected}
        onAreaCreated={handleAreaSelected}
      />
    </div>
  );
};

export default StrategyContributions;
