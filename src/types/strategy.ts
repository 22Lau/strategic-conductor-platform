
export interface Organization {
  id: string;
  name: string;
  role?: string;
}

export interface StrategicArea {
  id: string;
  name: string;
  organization_id?: string;
  organization_name?: string;
  responsibilities?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface StrategicContribution {
  id?: string;
  area_id: string;
  strategic_line: string;
  contribution: string;
  examples: string[];
  created_at?: string;
  updated_at?: string;
}
