
import ContributionForm from "./ContributionForm";
import GuidanceCard from "./GuidanceCard";

interface ContributionsTabProps {
  areas: any[];
  loading: boolean;
  selectedOrganization: string;
  selectedArea: string;
  strategicLines: string[];
}

const ContributionsTab = ({ 
  areas, 
  loading, 
  selectedOrganization,
  selectedArea,
  strategicLines 
}: ContributionsTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <ContributionForm
          areas={areas}
          loading={loading}
          selectedOrganization={selectedOrganization}
          selectedArea={selectedArea}
          strategicLines={strategicLines}
        />
      </div>
      
      <div>
        <GuidanceCard />
      </div>
    </div>
  );
};

export default ContributionsTab;
