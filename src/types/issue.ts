export type IssueStatus = "Draft" | "Submitted" | "In Progress" | "Completed" | "Closed";
export type SeverityLevel = "Low" | "Medium" | "High" | "Critical";
export type ImpactType = "Financial" | "Operational" | "Reputational" | "Regulatory";
export type ExtensionStatus = "Open" | "Closed";
export type ActionItemStatus = "Open" | "In Progress" | "Closed";

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
}

export interface Issue {
  id: number;
  title: string;
  summary: string;
  owner: User;
  affectedFunction: string;
  status: IssueStatus;
  dateOfOccurrence: Date;
  dateOfDiscovery: Date;
  dueDate: Date;
  issueSource: string;
  severityClassification: SeverityLevel;
  impactTypes: ImpactType[];
  riskLevel1: string;
  riskLevel2: string;
  riskLevel3: string;
  observers: User[];
  linkedIncidents?: number[];
  extensionStatus?: ExtensionStatus;
  extendedDueDate?: Date;
  extensionJustification?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: number;
  text: string;
  author: User;
  createdAt: Date;
}

export interface ActionItem {
  id: number;
  title: string;
  owner: User;
  dueDate: Date;
  status: ActionItemStatus;
  description?: string;
  comments: Comment[];
  linkedIssue: number;
  justificationForClosure?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MetricCard {
  title: string;
  count: number;
  status: IssueStatus;
}
