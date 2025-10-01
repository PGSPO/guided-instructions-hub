import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Send, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { mockIncidents, incidentTypes, businessFunctions, riskCategories, mockUsers } from "@/lib/mockData";
import { ImpactType, SeverityLevel } from "@/types/incident";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  
  const incident = isNew ? null : mockIncidents.find(i => i.id === parseInt(id!));
  
  const [formData, setFormData] = useState({
    title: incident?.title || "",
    summary: incident?.summary || "",
    owner: incident?.owner.id || mockUsers[0].id,
    affectedFunction: incident?.affectedFunction || "",
    status: incident?.status || "Draft",
    dateOfOccurrence: incident?.dateOfOccurrence.toISOString().split('T')[0] || "",
    dateOfDiscovery: incident?.dateOfDiscovery.toISOString().split('T')[0] || "",
    incidentType: incident?.incidentType || "",
    severityClassification: incident?.severityClassification || "Low",
    impactTypes: incident?.impactTypes || [] as ImpactType[],
    actualFinancialImpact: incident?.actualFinancialImpact?.toString() || "",
    potentialFinancialImpact: incident?.potentialFinancialImpact?.toString() || "",
    riskLevel1: incident?.riskLevel1 || "",
    riskLevel2: incident?.riskLevel2 || "",
    riskLevel3: incident?.riskLevel3 || "",
    justificationForClosure: incident?.justificationForClosure || "",
  });

  const hasFinancialImpact = formData.impactTypes.includes("Financial");

  const handleSave = () => {
    toast.success("Incident saved as draft");
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.title || !formData.summary || !formData.dateOfOccurrence) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Incident submitted for review");
    navigate("/");
  };

  const handleClose = () => {
    if (!formData.justificationForClosure) {
      toast.error("Justification for closure is required");
      return;
    }
    toast.success("Incident closed successfully");
    navigate("/");
  };

  const toggleImpactType = (type: ImpactType) => {
    setFormData(prev => ({
      ...prev,
      impactTypes: prev.impactTypes.includes(type)
        ? prev.impactTypes.filter(t => t !== type)
        : [...prev.impactTypes, type]
    }));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {isNew ? "Create New Incident" : `Incident #${incident?.id}`}
            </h2>
            <p className="text-muted-foreground mt-1">
              {isNew ? "Fill in the details to create a new incident" : "View and edit incident details"}
            </p>
          </div>
        </div>
        {!isNew && incident && (
          <Badge variant="outline" className={cn(
            "text-base px-4 py-2",
            incident.status === "Draft" && "bg-status-draft/10 text-status-draft border-status-draft/20",
            incident.status === "In Progress" && "bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20",
            incident.status === "Closed" && "bg-status-closed/10 text-status-closed border-status-closed/20"
          )}>
            {incident.status}
          </Badge>
        )}
      </div>

      {/* Form Tabs */}
      <Tabs defaultValue="form" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="form">Incident Form</TabsTrigger>
          <TabsTrigger value="close">Close Incident</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential details about the incident</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Brief description of the incident"
                  maxLength={200}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary *</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Detailed description of the incident"
                  rows={4}
                  maxLength={1000}
                />
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
                  <Label htmlFor="function">Affected Function *</Label>
                  <Select value={formData.affectedFunction} onValueChange={(value) => setFormData({ ...formData, affectedFunction: value })}>
                    <SelectTrigger id="function">
                      <SelectValue placeholder="Select function" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessFunctions.map(func => (
                        <SelectItem key={func} value={func}>{func}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occurrence">Date of Occurrence *</Label>
                  <Input
                    id="occurrence"
                    type="date"
                    value={formData.dateOfOccurrence}
                    onChange={(e) => setFormData({ ...formData, dateOfOccurrence: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discovery">Date of Discovery *</Label>
                  <Input
                    id="discovery"
                    type="date"
                    value={formData.dateOfDiscovery}
                    onChange={(e) => setFormData({ ...formData, dateOfDiscovery: e.target.value })}
                  />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Incident Type *</Label>
                  <Select value={formData.incidentType} onValueChange={(value) => setFormData({ ...formData, incidentType: value })}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {incidentTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
              </div>

              <div className="space-y-2">
                <Label>Impact Type * (Select at least one)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {(["Financial", "Operational", "Reputational", "Regulatory"] as ImpactType[]).map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={formData.impactTypes.includes(type)}
                        onCheckedChange={() => toggleImpactType(type)}
                      />
                      <Label htmlFor={type} className="cursor-pointer">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {hasFinancialImpact && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="actual">Actual Financial Impact ($)</Label>
                    <Input
                      id="actual"
                      type="number"
                      value={formData.actualFinancialImpact}
                      onChange={(e) => setFormData({ ...formData, actualFinancialImpact: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="potential">Potential Financial Impact ($)</Label>
                    <Input
                      id="potential"
                      type="number"
                      value={formData.potentialFinancialImpact}
                      onChange={(e) => setFormData({ ...formData, potentialFinancialImpact: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}
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
                  <Label htmlFor="risk1">Risk Level 1 *</Label>
                  <Select value={formData.riskLevel1} onValueChange={(value) => setFormData({ ...formData, riskLevel1: value, riskLevel2: "", riskLevel3: "" })}>
                    <SelectTrigger id="risk1">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {riskCategories.level1.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="risk2">Risk Level 2 *</Label>
                  <Select 
                    value={formData.riskLevel2} 
                    onValueChange={(value) => setFormData({ ...formData, riskLevel2: value, riskLevel3: "" })}
                    disabled={!formData.riskLevel1}
                  >
                    <SelectTrigger id="risk2">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.riskLevel1 && riskCategories.level2[formData.riskLevel1 as keyof typeof riskCategories.level2]?.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="risk3">Risk Level 3 *</Label>
                  <Select 
                    value={formData.riskLevel3} 
                    onValueChange={(value) => setFormData({ ...formData, riskLevel3: value })}
                    disabled={!formData.riskLevel2}
                  >
                    <SelectTrigger id="risk3">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.riskLevel2 && riskCategories.level3[formData.riskLevel2 as keyof typeof riskCategories.level3]?.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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

        <TabsContent value="close" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Close Incident</CardTitle>
              <CardDescription>Provide justification for closing this incident</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="justification">Justification for Closure *</Label>
                <Textarea
                  id="justification"
                  value={formData.justificationForClosure}
                  onChange={(e) => setFormData({ ...formData, justificationForClosure: e.target.value })}
                  placeholder="Explain why this incident is being closed..."
                  rows={6}
                  maxLength={1000}
                />
              </div>

              <Button onClick={handleClose} variant="destructive" size="lg">
                <XCircle className="mr-2 h-4 w-4" />
                Close Incident
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
