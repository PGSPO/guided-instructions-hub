import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { ArrowUpDown, Eye } from "lucide-react";
import { Incident, SeverityLevel, IncidentStatus } from "@/types/incident";
import { cn } from "@/lib/utils";

interface IncidentTableProps {
  incidents: Incident[];
}

type SortField = "id" | "title" | "status" | "severity" | "owner";
type SortDirection = "asc" | "desc";

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
  }
};

const getStatusColor = (status: IncidentStatus) => {
  switch (status) {
    case "Draft":
      return "bg-status-draft/10 text-status-draft border-status-draft/20";
    case "In Progress":
      return "bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20";
    case "Closed":
      return "bg-status-closed/10 text-status-closed border-status-closed/20";
    default:
      return "bg-status-open/10 text-status-open border-status-open/20";
  }
};

export const IncidentTable = ({ incidents }: IncidentTableProps) => {
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

  const sortedIncidents = [...incidents].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case "id":
        comparison = a.id - b.id;
        break;
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      case "severity":
        comparison = a.severityClassification.localeCompare(b.severityClassification);
        break;
      case "owner":
        comparison = a.owner.name.localeCompare(b.owner.name);
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
                onClick={() => handleSort("owner")}
                className="hover:bg-secondary"
              >
                Owner
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Observers</TableHead>
            <TableHead className="w-24"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedIncidents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No incidents found
              </TableCell>
            </TableRow>
          ) : (
            sortedIncidents.map((incident) => (
              <TableRow
                key={incident.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/incidents/${incident.id}`)}
              >
                <TableCell className="font-medium">#{incident.id}</TableCell>
                <TableCell className="font-medium">{incident.title}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("border", getStatusColor(incident.status))}>
                    {incident.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("border", getSeverityColor(incident.severityClassification))}>
                    {incident.severityClassification}
                  </Badge>
                </TableCell>
                <TableCell>{incident.owner.name}</TableCell>
                <TableCell>
                  {incident.observers.length > 0 ? (
                    <div className="flex -space-x-2">
                      {incident.observers.slice(0, 3).map((observer, idx) => (
                        <div
                          key={observer.id}
                          className="h-8 w-8 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center text-xs font-medium"
                          title={observer.name}
                        >
                          {observer.name.split(" ").map(n => n[0]).join("")}
                        </div>
                      ))}
                      {incident.observers.length > 3 && (
                        <div className="h-8 w-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium">
                          +{incident.observers.length - 3}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">None</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/incidents/${incident.id}`);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
