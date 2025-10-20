import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Issue, IssueStatus, SeverityLevel } from "@/types/issue";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { mockActionItems } from "@/lib/issuesMockData";
import { ArrowUpDown } from "lucide-react";

interface IssueTableProps {
  issues: Issue[];
}

type SortField = "id" | "title" | "owner" | "status" | "severity" | "dueDate";
type SortDirection = "asc" | "desc";

const getStatusColor = (status: IssueStatus) => {
  switch (status) {
    case "Draft":
      return "bg-status-draft/10 text-status-draft border-status-draft/20";
    case "Submitted":
      return "bg-status-open/10 text-status-open border-status-open/20";
    case "In Progress":
      return "bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20";
    case "Completed":
      return "bg-status-closed/10 text-status-closed border-status-closed/20";
    case "Closed":
      return "bg-status-closed/10 text-status-closed border-status-closed/20";
    default:
      return "";
  }
};

const getSeverityColor = (severity: SeverityLevel) => {
  switch (severity) {
    case "Critical":
      return "bg-severity-critical/10 text-severity-critical border-severity-critical/20";
    case "High":
      return "bg-severity-high/10 text-severity-high border-severity-high/20";
    case "Medium":
      return "bg-severity-medium/10 text-severity-medium border-severity-medium/20";
    case "Low":
      return "bg-severity-low/10 text-severity-low border-severity-low/20";
    default:
      return "";
  }
};

export const IssueTable = ({ issues }: IssueTableProps) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getActionItemsForIssue = (issueId: number) => {
    return mockActionItems.filter(item => item.linkedIssue === issueId);
  };

  const getActionItemProgress = (issueId: number) => {
    const items = getActionItemsForIssue(issueId);
    if (items.length === 0) return { total: 0, pending: 0, percentage: 0 };
    const pending = items.filter(item => item.status === "Open").length;
    const percentage = ((items.length - pending) / items.length) * 100;
    return { total: items.length, pending, percentage };
  };

  const sortedIssues = [...issues].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case "id":
        comparison = a.id - b.id;
        break;
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "owner":
        comparison = a.owner.name.localeCompare(b.owner.name);
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      case "severity":
        comparison = a.severityClassification.localeCompare(b.severityClassification);
        break;
      case "dueDate":
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("id")}
                className="hover:bg-secondary"
              >
                ID
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("title")}
                className="hover:bg-secondary"
              >
                Title
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("owner")}
                className="hover:bg-secondary"
              >
                Owner
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("status")}
                className="hover:bg-secondary"
              >
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("severity")}
                className="hover:bg-secondary"
              >
                Severity
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("dueDate")}
                className="hover:bg-secondary"
              >
                Due Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Action Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedIssues.map((issue) => {
            const progress = getActionItemProgress(issue.id);
            return (
              <TableRow
                key={issue.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/issues/${issue.id}`)}
              >
                <TableCell className="font-medium">{issue.id}</TableCell>
                <TableCell className="max-w-md">
                  <div className="font-medium">{issue.title}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {issue.summary}
                  </div>
                </TableCell>
                <TableCell>{issue.owner.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("border", getStatusColor(issue.status))}>
                    {issue.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("border", getSeverityColor(issue.severityClassification))}>
                    {issue.severityClassification}
                  </Badge>
                </TableCell>
                <TableCell>{format(issue.dueDate, "MMM dd, yyyy")}</TableCell>
                <TableCell>
                  <div className="space-y-1 min-w-[120px]">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{progress.pending} pending</span>
                      <span>{progress.total} total</span>
                    </div>
                    <Progress value={progress.percentage} className="h-2" />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
