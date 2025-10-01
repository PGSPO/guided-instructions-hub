import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Issue, IssueStatus, SeverityLevel } from "@/types/issue";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface IssueTableProps {
  issues: Issue[];
}

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

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Function</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Source</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => (
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
              <TableCell>{issue.affectedFunction}</TableCell>
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
              <TableCell>{issue.issueSource}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
