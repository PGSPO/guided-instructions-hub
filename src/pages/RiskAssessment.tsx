import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockIncidents } from "@/lib/mockData";
import { mockIssues, mockActionItems } from "@/lib/issuesMockData";
import { CheckCircle2, AlertCircle, FileText, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const RiskAssessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Simulating current user - in a real app, this would come from auth
  const currentUserId = "1"; // John Smith
  
  // Filter data for current user
  const myIncidents = mockIncidents.filter(inc => inc.owner.id === currentUserId);
  const myIssues = mockIssues.filter(issue => issue.owner.id === currentUserId);
  const myActionItems = mockActionItems.filter(item => item.owner.id === currentUserId);
  
  // Attestation state - track each item individually
  const [attestedIncidents, setAttestedIncidents] = useState<Set<string>>(new Set());
  const [attestedIssues, setAttestedIssues] = useState<Set<string>>(new Set());
  const [attestedActionItems, setAttestedActionItems] = useState<Set<string>>(new Set());
  
  const allItemsAttested = 
    attestedIncidents.size === myIncidents.length &&
    attestedIssues.size === myIssues.length &&
    attestedActionItems.size === myActionItems.length;
  
  const toggleIncidentAttestation = (id: string) => {
    setAttestedIncidents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  
  const toggleIssueAttestation = (id: string) => {
    setAttestedIssues(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  
  const toggleActionItemAttestation = (id: string) => {
    setAttestedActionItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  
  const handleSubmitAttestation = () => {
    if (!allItemsAttested) {
      toast({
        title: "Incomplete Attestation",
        description: "Please attest to all individual items before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Attestation Submitted",
      description: "Your risk assessment attestation has been recorded.",
    });
  };

  const getSeverityColor = (severity: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-status-draft/10 text-status-draft border-status-draft/20";
      case "Submitted":
      case "Open":
        return "bg-status-open/10 text-status-open border-status-open/20";
      case "In Progress":
        return "bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20";
      case "Completed":
      case "Closed":
        return "bg-status-closed/10 text-status-closed border-status-closed/20";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Risk Assessment Attestation
        </h1>
        <p className="text-muted-foreground">
          Review your assigned items and attest to the accuracy of the data
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Incidents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myIncidents.length}</div>
            <p className="text-xs text-muted-foreground">
              {myIncidents.filter(i => i.status === "In Progress").length} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myIssues.length}</div>
            <p className="text-xs text-muted-foreground">
              {myIssues.filter(i => i.status === "In Progress").length} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Action Items</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myActionItems.length}</div>
            <p className="text-xs text-muted-foreground">
              {myActionItems.filter(i => i.status === "Open").length} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Incidents Section */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>My Incidents ({myIncidents.length})</CardTitle>
            <CardDescription>
              Review and attest to each incident individually - {attestedIncidents.size} of {myIncidents.length} attested
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {myIncidents.length > 0 ? (
            <div className="rounded-lg border bg-card shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Attest</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Date of Occurrence</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myIncidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell>
                        <Checkbox 
                          checked={attestedIncidents.has(incident.id.toString())}
                          onCheckedChange={() => toggleIncidentAttestation(incident.id.toString())}
                        />
                      </TableCell>
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
                      <TableCell>{format(incident.dateOfOccurrence, "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/incidents/${incident.id}`)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No incidents assigned to you
            </div>
          )}
        </CardContent>
      </Card>

      {/* Issues Section */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>My Issues ({myIssues.length})</CardTitle>
            <CardDescription>
              Review and attest to each issue individually - {attestedIssues.size} of {myIssues.length} attested
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {myIssues.length > 0 ? (
            <div className="rounded-lg border bg-card shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Attest</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell>
                        <Checkbox 
                          checked={attestedIssues.has(issue.id.toString())}
                          onCheckedChange={() => toggleIssueAttestation(issue.id.toString())}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{issue.id}</TableCell>
                      <TableCell className="font-medium">{issue.title}</TableCell>
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
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/issues/${issue.id}`)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No issues assigned to you
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Items Section */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>My Action Items ({myActionItems.length})</CardTitle>
            <CardDescription>
              Review and attest to each action item individually - {attestedActionItems.size} of {myActionItems.length} attested
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {myActionItems.length > 0 ? (
            <div className="rounded-lg border bg-card shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Attest</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Linked Issue</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myActionItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox 
                          checked={attestedActionItems.has(item.id.toString())}
                          onCheckedChange={() => toggleActionItemAttestation(item.id.toString())}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("border", getStatusColor(item.status))}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(item.dueDate, "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        {item.linkedIssue && (
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto"
                            onClick={() => navigate(`/issues/${item.linkedIssue}`)}
                          >
                            Issue #{item.linkedIssue}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">View in issue</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No action items assigned to you
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Submit Attestation */}
      <Card>
        <CardHeader>
          <CardTitle>Submit Attestation</CardTitle>
          <CardDescription>
            By submitting, you confirm that you have reviewed all assigned items and the data is accurate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {attestedIncidents.size === myIncidents.length ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-warning" />
                )}
                <span className="text-sm">Incidents: {attestedIncidents.size}/{myIncidents.length} attested</span>
              </div>
              <div className="flex items-center gap-2">
                {attestedIssues.size === myIssues.length ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-warning" />
                )}
                <span className="text-sm">Issues: {attestedIssues.size}/{myIssues.length} attested</span>
              </div>
              <div className="flex items-center gap-2">
                {attestedActionItems.size === myActionItems.length ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-warning" />
                )}
                <span className="text-sm">Action Items: {attestedActionItems.size}/{myActionItems.length} attested</span>
              </div>
            </div>
            
            <Button 
              onClick={handleSubmitAttestation}
              disabled={!allItemsAttested}
              className="w-full"
            >
              Submit Attestation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessment;
