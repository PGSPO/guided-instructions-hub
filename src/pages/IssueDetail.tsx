import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Save, Send, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { mockIssues, issueSources, businessFunctions, riskCategories, mockUsers, mockActionItems } from "@/lib/issuesMockData";
import { mockIncidents } from "@/lib/mockData";
import { ImpactType, SeverityLevel, ActionItemStatus } from "@/types/issue";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isNew = id === "new";
  
  const issue = isNew ? null : mockIssues.find(i => i.id === parseInt(id!));
  
  const [formData, setFormData] = useState({
    title: issue?.title || "",
    summary: issue?.summary || "",
    owner: issue?.owner.id || mockUsers[0].id,
    affectedFunction: issue?.affectedFunction || "",
    status: issue?.status || "Draft",
    dateOfOccurrence: issue?.dateOfOccurrence.toISOString().split('T')[0] || "",
    dateOfDiscovery: issue?.dateOfDiscovery.toISOString().split('T')[0] || "",
    dueDate: issue?.dueDate.toISOString().split('T')[0] || "",
    issueSource: issue?.issueSource || "",
    severityClassification: issue?.severityClassification || "Low",
    impactTypes: issue?.impactTypes || [] as ImpactType[],
    riskLevel1: issue?.riskLevel1 || "",
    riskLevel2: issue?.riskLevel2 || "",
    riskLevel3: issue?.riskLevel3 || "",
    extensionJustification: issue?.extensionJustification || "",
    extendedDueDate: issue?.extendedDueDate?.toISOString().split('T')[0] || "",
    linkedIncidentId: issue?.linkedIncidents?.[0]?.toString() || "",
  });

  // Get linked incident from navigation state (when creating issue from incident page)
  const linkedIncidentFromState = (location.state as any)?.linkedIncidentId;

  useEffect(() => {
    if (linkedIncidentFromState) {
      setFormData(prev => ({ ...prev, linkedIncidentId: linkedIncidentFromState.toString() }));
    }
  }, [linkedIncidentFromState]);

  const [actionItems, setActionItems] = useState(
    issue ? mockActionItems.filter(item => item.linkedIssue === issue.id) : []
  );

  const [newActionItem, setNewActionItem] = useState({
    title: "",
    owner: mockUsers[0].id,
    dueDate: "",
    description: "",
    comments: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showClosureDialog, setShowClosureDialog] = useState(false);
  const [closingActionItem, setClosingActionItem] = useState<{ id: number; justification: string } | null>(null);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!formData.title) {
      errors.title = "Title is required";
    } else if (formData.title.length > 255) {
      errors.title = "Title must be 255 characters or less";
    }
    
    if (!formData.summary) {
      errors.summary = "Summary is required";
    } else if (formData.summary.length > 2000) {
      errors.summary = "Summary must be 2000 characters or less";
    }
    
    if (!formData.dateOfOccurrence) {
      errors.dateOfOccurrence = "Date of occurrence is required";
    }
    
    if (!formData.dateOfDiscovery) {
      errors.dateOfDiscovery = "Date of discovery is required";
    }
    
    if (formData.dateOfOccurrence && formData.dateOfDiscovery) {
      const occurrence = new Date(formData.dateOfOccurrence);
      const discovery = new Date(formData.dateOfDiscovery);
      if (occurrence > discovery) {
        errors.dateOfOccurrence = "Date of occurrence must be on or before date of discovery";
      }
    }
    
    if (!formData.dueDate) {
      errors.dueDate = "Due date is required";
    } else {
      const dueDate = new Date(formData.dueDate);
      if (dueDate <= today) {
        errors.dueDate = "Due date must be after today";
      }
    }

    if (!formData.affectedFunction) {
      errors.affectedFunction = "Affected function is required";
    }

    if (!formData.issueSource) {
      errors.issueSource = "Issue source is required";
    }

    if (!formData.riskLevel1) {
      errors.riskLevel1 = "Risk Level 1 is required";
    }

    if (!formData.riskLevel2) {
      errors.riskLevel2 = "Risk Level 2 is required";
    }

    if (!formData.riskLevel3) {
      errors.riskLevel3 = "Risk Level 3 is required";
    }

    if (formData.impactTypes.length === 0) {
      errors.impactTypes = "At least one impact type is required";
    }

    return errors;
  };

  const handleSave = () => {
    toast.success("Issue saved as draft");
  };

  const handleSubmit = () => {
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    if (isNew && actionItems.length === 0) {
      toast.error("At least one action item is required before submitting");
      return;
    }

    if (isNew) {
      toast.success("Issue created and submitted for review");
    } else {
      toast.success("Issue submitted for review");
    }
    navigate("/issues");
  };

  const handleRequestExtension = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!formData.extendedDueDate) {
      toast.error("Extended due date is required");
      return;
    }
    const extendedDate = new Date(formData.extendedDueDate);
    if (extendedDate <= today) {
      toast.error("Extended due date must be after today");
      return;
    }
    if (!formData.extensionJustification) {
      toast.error("Justification is required");
      return;
    }
    toast.success("Extension request submitted");
  };

  const handleAddActionItem = () => {
    if (!newActionItem.title || !newActionItem.dueDate) {
      toast.error("Title and due date are required");
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const actionDueDate = new Date(newActionItem.dueDate);
    if (actionDueDate <= today) {
      toast.error("Action item due date must be after today");
      return;
    }

    const newItem = {
      id: Math.max(...actionItems.map(a => a.id), 3000) + 1,
      ...newActionItem,
      owner: mockUsers.find(u => u.id === newActionItem.owner)!,
      dueDate: new Date(newActionItem.dueDate),
      status: "Open" as ActionItemStatus,
      linkedIssue: issue?.id || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setActionItems([...actionItems, newItem]);
    setNewActionItem({
      title: "",
      owner: mockUsers[0].id,
      dueDate: "",
      description: "",
      comments: "",
    });
    toast.success("Action item added");
  };

  const handleUpdateActionItemStatus = (itemId: number, status: ActionItemStatus) => {
    if (status === "Closed") {
      setClosingActionItem({ id: itemId, justification: "" });
      setShowClosureDialog(true);
    } else {
      setActionItems(actionItems.map(item => 
        item.id === itemId ? { ...item, status, updatedAt: new Date() } : item
      ));
      toast.success("Action item status updated");
    }
  };

  const handleConfirmClosure = () => {
    if (!closingActionItem?.justification) {
      toast.error("Justification for closure is required");
      return;
    }

    setActionItems(actionItems.map(item => 
      item.id === closingActionItem.id 
        ? { ...item, status: "Closed" as ActionItemStatus, justificationForClosure: closingActionItem.justification, updatedAt: new Date() } 
        : item
    ));
    toast.success("Action item closed");
    setShowClosureDialog(false);
    setClosingActionItem(null);
  };

  const handleUpdateActionItemComments = (itemId: number, comments: string) => {
    setActionItems(actionItems.map(item => 
      item.id === itemId ? { ...item, comments, updatedAt: new Date() } : item
    ));
  };

  const handleDeleteActionItem = (itemId: number) => {
    setActionItems(actionItems.filter(item => item.id !== itemId));
    toast.success("Action item deleted");
  };

  const toggleImpactType = (type: ImpactType) => {
    setFormData(prev => ({
      ...prev,
      impactTypes: prev.impactTypes.includes(type)
        ? prev.impactTypes.filter(t => t !== type)
        : [...prev.impactTypes, type]
    }));
  };

  const getActionStatusColor = (status: ActionItemStatus) => {
    switch (status) {
      case "Open":
        return "bg-status-open/10 text-status-open border-status-open/20";
      case "In Progress":
        return "bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20";
      case "Closed":
        return "bg-status-closed/10 text-status-closed border-status-closed/20";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/issues")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {isNew ? "Create New Issue" : `Issue #${issue?.id}`}
            </h2>
            <p className="text-muted-foreground mt-1">
              {isNew ? "Fill in the details to create a new issue" : "View and edit issue details"}
            </p>
          </div>
        </div>
        {!isNew && issue && (
          <Badge variant="outline" className={cn(
            "text-base px-4 py-2",
            issue.status === "Draft" && "bg-status-draft/10 text-status-draft border-status-draft/20",
            issue.status === "Submitted" && "bg-status-open/10 text-status-open border-status-open/20",
            issue.status === "In Progress" && "bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20",
            issue.status === "Completed" && "bg-status-closed/10 text-status-closed border-status-closed/20",
            issue.status === "Closed" && "bg-status-closed/10 text-status-closed border-status-closed/20"
          )}>
            {issue.status}
          </Badge>
        )}
      </div>

      {/* Form Tabs */}
      <Tabs defaultValue="form" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="form">Issue Form</TabsTrigger>
          <TabsTrigger value="extension">Extension Request</TabsTrigger>
          <TabsTrigger value="actions">Action Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-6">
          {/* Guidance Alert */}
          {isNew && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> After creating an issue, you must add at least one action item in the Action Plan tab before submitting.
              </AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential details about the issue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className={cn(formErrors.title && "text-destructive")}>
                  Title * (max 255 characters)
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (formErrors.title) setFormErrors({ ...formErrors, title: "" });
                  }}
                  placeholder="Brief description of the issue"
                  maxLength={255}
                  className={cn(formErrors.title && "border-destructive focus-visible:ring-destructive")}
                />
                {formErrors.title && (
                  <p className="text-xs text-destructive">{formErrors.title}</p>
                )}
                <p className="text-xs text-muted-foreground text-right">
                  {formData.title.length}/255
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary" className={cn(formErrors.summary && "text-destructive")}>
                  Summary * (max 2000 characters)
                </Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => {
                    setFormData({ ...formData, summary: e.target.value });
                    if (formErrors.summary) setFormErrors({ ...formErrors, summary: "" });
                  }}
                  placeholder="Detailed description of the issue"
                  rows={4}
                  maxLength={2000}
                  className={cn(formErrors.summary && "border-destructive focus-visible:ring-destructive")}
                />
                {formErrors.summary && (
                  <p className="text-xs text-destructive">{formErrors.summary}</p>
                )}
                <p className="text-xs text-muted-foreground text-right">
                  {formData.summary.length}/2000
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="owner">Owner *</Label>
                  <Select value={formData.owner} onValueChange={(value) => setFormData({ ...formData, owner: value })}>
                    <SelectTrigger id="owner">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockUsers.map(user => (
                        <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="function" className={cn(formErrors.affectedFunction && "text-destructive")}>
                    Affected Function *
                  </Label>
                  <Select 
                    value={formData.affectedFunction} 
                    onValueChange={(value) => {
                      setFormData({ ...formData, affectedFunction: value });
                      if (formErrors.affectedFunction) setFormErrors({ ...formErrors, affectedFunction: "" });
                    }}
                  >
                    <SelectTrigger id="function" className={cn(formErrors.affectedFunction && "border-destructive")}>
                      <SelectValue placeholder="Select function" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessFunctions.map(func => (
                        <SelectItem key={func} value={func}>{func}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.affectedFunction && (
                    <p className="text-xs text-destructive">{formErrors.affectedFunction}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occurrence" className={cn(formErrors.dateOfOccurrence && "text-destructive")}>
                    Date of Occurrence *
                  </Label>
                  <Input
                    id="occurrence"
                    type="date"
                    value={formData.dateOfOccurrence}
                    onChange={(e) => {
                      setFormData({ ...formData, dateOfOccurrence: e.target.value });
                      if (formErrors.dateOfOccurrence) setFormErrors({ ...formErrors, dateOfOccurrence: "" });
                    }}
                    className={cn(formErrors.dateOfOccurrence && "border-destructive")}
                  />
                  {formErrors.dateOfOccurrence && (
                    <p className="text-xs text-destructive">{formErrors.dateOfOccurrence}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discovery" className={cn(formErrors.dateOfDiscovery && "text-destructive")}>
                    Date of Discovery *
                  </Label>
                  <Input
                    id="discovery"
                    type="date"
                    value={formData.dateOfDiscovery}
                    onChange={(e) => {
                      setFormData({ ...formData, dateOfDiscovery: e.target.value });
                      if (formErrors.dateOfDiscovery) setFormErrors({ ...formErrors, dateOfDiscovery: "" });
                    }}
                    className={cn(formErrors.dateOfDiscovery && "border-destructive")}
                  />
                  {formErrors.dateOfDiscovery && (
                    <p className="text-xs text-destructive">{formErrors.dateOfDiscovery}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate" className={cn(formErrors.dueDate && "text-destructive")}>
                    Due Date *
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => {
                      setFormData({ ...formData, dueDate: e.target.value });
                      if (formErrors.dueDate) setFormErrors({ ...formErrors, dueDate: "" });
                    }}
                    className={cn(formErrors.dueDate && "border-destructive")}
                  />
                  {formErrors.dueDate && (
                    <p className="text-xs text-destructive">{formErrors.dueDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source" className={cn(formErrors.issueSource && "text-destructive")}>
                    Issue Source *
                  </Label>
                  <Select 
                    value={formData.issueSource} 
                    onValueChange={(value) => {
                      setFormData({ ...formData, issueSource: value });
                      if (formErrors.issueSource) setFormErrors({ ...formErrors, issueSource: "" });
                    }}
                  >
                    <SelectTrigger id="source" className={cn(formErrors.issueSource && "border-destructive")}>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueSources.map(source => (
                        <SelectItem key={source} value={source}>{source}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.issueSource && (
                    <p className="text-xs text-destructive">{formErrors.issueSource}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categorization */}
          <Card>
            <CardHeader>
              <CardTitle>Categorization</CardTitle>
              <CardDescription>Classification and severity assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="severity">Severity *</Label>
                <Select value={formData.severityClassification} onValueChange={(value) => setFormData({ ...formData, severityClassification: value as SeverityLevel })}>
                  <SelectTrigger id="severity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={cn(formErrors.impactTypes && "text-destructive")}>
                  Impact Type * (Select at least one)
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {(["Financial", "Operational", "Reputational", "Regulatory"] as ImpactType[]).map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={formData.impactTypes.includes(type)}
                        onCheckedChange={() => {
                          toggleImpactType(type);
                          if (formErrors.impactTypes) setFormErrors({ ...formErrors, impactTypes: "" });
                        }}
                      />
                      <Label htmlFor={type} className="cursor-pointer">{type}</Label>
                    </div>
                  ))}
                </div>
                {formErrors.impactTypes && (
                  <p className="text-xs text-destructive">{formErrors.impactTypes}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Risk Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Categories</CardTitle>
              <CardDescription>Hierarchical risk classification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="risk1" className={cn(formErrors.riskLevel1 && "text-destructive")}>
                    Risk Level 1 *
                  </Label>
                  <Select 
                    value={formData.riskLevel1} 
                    onValueChange={(value) => {
                      setFormData({ ...formData, riskLevel1: value, riskLevel2: "", riskLevel3: "" });
                      if (formErrors.riskLevel1) setFormErrors({ ...formErrors, riskLevel1: "" });
                    }}
                  >
                    <SelectTrigger id="risk1" className={cn(formErrors.riskLevel1 && "border-destructive")}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {riskCategories.level1.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.riskLevel1 && (
                    <p className="text-xs text-destructive">{formErrors.riskLevel1}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="risk2" className={cn(formErrors.riskLevel2 && "text-destructive")}>
                    Risk Level 2 *
                  </Label>
                  <Select 
                    value={formData.riskLevel2} 
                    onValueChange={(value) => {
                      setFormData({ ...formData, riskLevel2: value, riskLevel3: "" });
                      if (formErrors.riskLevel2) setFormErrors({ ...formErrors, riskLevel2: "" });
                    }}
                    disabled={!formData.riskLevel1}
                  >
                    <SelectTrigger id="risk2" className={cn(formErrors.riskLevel2 && "border-destructive")}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.riskLevel1 && riskCategories.level2[formData.riskLevel1 as keyof typeof riskCategories.level2]?.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.riskLevel2 && (
                    <p className="text-xs text-destructive">{formErrors.riskLevel2}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="risk3" className={cn(formErrors.riskLevel3 && "text-destructive")}>
                    Risk Level 3 *
                  </Label>
                  <Select 
                    value={formData.riskLevel3} 
                    onValueChange={(value) => {
                      setFormData({ ...formData, riskLevel3: value });
                      if (formErrors.riskLevel3) setFormErrors({ ...formErrors, riskLevel3: "" });
                    }}
                    disabled={!formData.riskLevel2}
                  >
                    <SelectTrigger id="risk3" className={cn(formErrors.riskLevel3 && "border-destructive")}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.riskLevel2 && riskCategories.level3[formData.riskLevel2 as keyof typeof riskCategories.level3]?.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.riskLevel3 && (
                    <p className="text-xs text-destructive">{formErrors.riskLevel3}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Incident Linking */}
          <Card>
            <CardHeader>
              <CardTitle>Incident Linking (Optional)</CardTitle>
              <CardDescription>Link this issue to an incident</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedIncident">Linked Incident</Label>
                <Select 
                  value={formData.linkedIncidentId} 
                  onValueChange={(value) => setFormData({ ...formData, linkedIncidentId: value })}
                  disabled={!!linkedIncidentFromState}
                >
                  <SelectTrigger id="linkedIncident">
                    <SelectValue placeholder="Select an incident (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockIncidents.map(incident => (
                      <SelectItem key={incident.id} value={incident.id.toString()}>
                        #{incident.id} - {incident.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {linkedIncidentFromState && (
                  <p className="text-xs text-muted-foreground">
                    Automatically linked from Incident #{linkedIncidentFromState}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleSave} variant="outline" size="lg">
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={handleSubmit} size="lg" className="bg-gradient-primary">
              <Send className="mr-2 h-4 w-4" />
              Submit for Review
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="extension" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Extension</CardTitle>
              <CardDescription>Request an extension for the issue due date</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="extendedDueDate">Extended Due Date *</Label>
                <Input
                  id="extendedDueDate"
                  type="date"
                  value={formData.extendedDueDate}
                  onChange={(e) => setFormData({ ...formData, extendedDueDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="extensionJustification">Justification *</Label>
                <Textarea
                  id="extensionJustification"
                  value={formData.extensionJustification}
                  onChange={(e) => setFormData({ ...formData, extensionJustification: e.target.value })}
                  placeholder="Explain why an extension is needed..."
                  rows={6}
                  maxLength={2000}
                />
              </div>

              <Button onClick={handleRequestExtension} size="lg">
                Submit Extension Request
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          {/* Add New Action Item */}
          <Card>
            <CardHeader>
              <CardTitle>Add Action Item</CardTitle>
              <CardDescription>Create a new action item for this issue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="actionTitle">Title *</Label>
                <Input
                  id="actionTitle"
                  value={newActionItem.title}
                  onChange={(e) => setNewActionItem({ ...newActionItem, title: e.target.value })}
                  placeholder="Action item title"
                  maxLength={255}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="actionOwner">Owner *</Label>
                  <Select value={newActionItem.owner} onValueChange={(value) => setNewActionItem({ ...newActionItem, owner: value })}>
                    <SelectTrigger id="actionOwner">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockUsers.map(user => (
                        <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actionDueDate">Due Date *</Label>
                  <Input
                    id="actionDueDate"
                    type="date"
                    value={newActionItem.dueDate}
                    onChange={(e) => setNewActionItem({ ...newActionItem, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="actionDescription">Description</Label>
                <Textarea
                  id="actionDescription"
                  value={newActionItem.description}
                  onChange={(e) => setNewActionItem({ ...newActionItem, description: e.target.value })}
                  placeholder="Detailed description of the action item"
                  rows={3}
                  maxLength={1000}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="actionComments">Comments</Label>
                <Textarea
                  id="actionComments"
                  value={newActionItem.comments}
                  onChange={(e) => setNewActionItem({ ...newActionItem, comments: e.target.value })}
                  placeholder="Additional comments or notes"
                  rows={2}
                  maxLength={1000}
                />
              </div>

              <Button onClick={handleAddActionItem}>
                <Plus className="mr-2 h-4 w-4" />
                Add Action Item
              </Button>
            </CardContent>
          </Card>

          {/* Action Items List */}
          <Card>
            <CardHeader>
              <CardTitle>Action Items ({actionItems.length})</CardTitle>
              <CardDescription>Track action items for this issue</CardDescription>
            </CardHeader>
            <CardContent>
              {actionItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No action items yet. Add one above to get started.
                </p>
              ) : (
                <div className="border rounded-lg">
                  <div className="space-y-4">
                    {actionItems.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-lg">{item.title}</div>
                                {item.description && (
                                  <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                                )}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteActionItem(item.id)}
                                className="ml-2"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label className="text-xs text-muted-foreground">Owner</Label>
                                <div className="text-sm">{item.owner.name}</div>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Due Date</Label>
                                <div className="text-sm">{format(item.dueDate, "MMM dd, yyyy")}</div>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Status</Label>
                                <Select 
                                  value={item.status} 
                                  onValueChange={(value: ActionItemStatus) => handleUpdateActionItemStatus(item.id, value)}
                                >
                                  <SelectTrigger className="w-full mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Open">
                                      <Badge variant="outline" className={cn("border", getActionStatusColor("Open"))}>
                                        Open
                                      </Badge>
                                    </SelectItem>
                                    <SelectItem value="In Progress">
                                      <Badge variant="outline" className={cn("border", getActionStatusColor("In Progress"))}>
                                        In Progress
                                      </Badge>
                                    </SelectItem>
                                    <SelectItem value="Closed">
                                      <Badge variant="outline" className={cn("border", getActionStatusColor("Closed"))}>
                                        Closed
                                      </Badge>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`comments-${item.id}`} className="text-sm">Comments</Label>
                              <Textarea
                                id={`comments-${item.id}`}
                                value={item.comments || ""}
                                onChange={(e) => handleUpdateActionItemComments(item.id, e.target.value)}
                                placeholder="Add comments or notes about this action item..."
                                rows={2}
                                maxLength={1000}
                              />
                            </div>

                            {item.status === "Closed" && item.justificationForClosure && (
                              <div className="space-y-2">
                                <Label className="text-sm">Closure Justification</Label>
                                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                  {item.justificationForClosure}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Closure Justification Dialog */}
      <Dialog open={showClosureDialog} onOpenChange={setShowClosureDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Action Item</DialogTitle>
            <DialogDescription>
              Please provide a justification for closing this action item.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="closure-justification">Justification *</Label>
              <Textarea
                id="closure-justification"
                value={closingActionItem?.justification || ""}
                onChange={(e) => setClosingActionItem(closingActionItem ? { ...closingActionItem, justification: e.target.value } : null)}
                placeholder="Explain why this action item is being closed..."
                rows={4}
                maxLength={1000}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowClosureDialog(false);
              setClosingActionItem(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleConfirmClosure}>
              Confirm Closure
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
