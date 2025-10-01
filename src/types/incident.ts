export type IncidentStatus = "Draft" | "Submitted" | "In Progress" | "Closed";
export type SeverityLevel = "Low" | "Medium" | "High" | "Critical";
export type ImpactType = "Financial" | "Operational" | "Reputational" | "Regulatory";

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
}

export interface Incident {
  id: number;
  title: string;
  summary: string;
  owner: User;
  affectedFunction: string;
  status: IncidentStatus;
  dateOfOccurrence: Date;
  dateOfDiscovery: Date;
  incidentType: string;
  severityClassification: SeverityLevel;
  impactTypes: ImpactType[];
  actualFinancialImpact?: number;
  potentialFinancialImpact?: number;
  riskLevel1: string;
  riskLevel2: string;
  riskLevel3: string;
  observers: User[];
  linkedIssues?: number[];
  justificationForClosure?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MetricCard {
  title: string;
  count: number;
  status: IncidentStatus;
}
