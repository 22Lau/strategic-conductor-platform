
import { Users, Target, PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrganizationsTab from "./OrganizationsTab";
import StrategicAreasTab from "./StrategicAreasTab";
import ContributionsTab from "./ContributionsTab";
import { Organization, StrategicArea } from "@/types/strategy";

interface StrategyTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  organizations: Organization[];
  areas: StrategicArea[];
  loading: boolean;
  userId?: string;
  selectedOrganization: string;
  selectedArea: string;
  strategicLines: string[];
  onOrgCreated: (orgName: string) => void;
  onAreaCreated: (areaName: string) => void;
}

const StrategyTabs = ({
  activeTab,
  setActiveTab,
  organizations,
  areas,
  loading,
  userId,
  selectedOrganization,
  selectedArea,
  strategicLines,
  onOrgCreated,
  onAreaCreated
}: StrategyTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="organizations">
          <Users className="mr-2 h-4 w-4" /> Organizations
        </TabsTrigger>
        <TabsTrigger value="areas">
          <Target className="mr-2 h-4 w-4" /> Strategic Areas
        </TabsTrigger>
        <TabsTrigger value="contributions">
          <PlusCircle className="mr-2 h-4 w-4" /> Contributions
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="organizations">
        <OrganizationsTab 
          organizations={organizations}
          loading={loading}
          setActiveTab={setActiveTab}
          onOrgCreated={onOrgCreated}
          userId={userId}
        />
      </TabsContent>
      
      <TabsContent value="areas">
        <StrategicAreasTab 
          areas={areas}
          loading={loading}
          setActiveTab={setActiveTab}
          onAreaCreated={onAreaCreated}
          selectedOrganization={selectedOrganization}
        />
      </TabsContent>
      
      <TabsContent value="contributions">
        <ContributionsTab 
          areas={areas}
          loading={loading}
          selectedOrganization={selectedOrganization}
          selectedArea={selectedArea}
          strategicLines={strategicLines}
        />
      </TabsContent>
    </Tabs>
  );
};

export default StrategyTabs;
