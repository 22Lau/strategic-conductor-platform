
import { StrategicArea } from "@/types/strategy";
import AreaForm from "./AreaForm";
import AreasList from "./AreasList";

interface StrategicAreasTabProps {
  areas: StrategicArea[];
  loading: boolean;
  setActiveTab: (tab: string) => void;
  onAreaCreated: (areaName: string) => void;
  selectedOrganization: string;
}

const StrategicAreasTab = ({ 
  areas, 
  loading, 
  setActiveTab, 
  onAreaCreated,
  selectedOrganization 
}: StrategicAreasTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <AreaForm
          loading={loading}
          setActiveTab={setActiveTab}
          onAreaCreated={onAreaCreated}
          selectedOrganization={selectedOrganization}
        />
      </div>
      
      <div>
        <AreasList
          areas={areas}
          setActiveTab={setActiveTab}
          onAreaSelected={onAreaCreated}
        />
      </div>
    </div>
  );
};

export default StrategicAreasTab;
