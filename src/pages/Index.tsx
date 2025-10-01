import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, FileText, Plus, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockIncidents } from "@/lib/mockData";
import { mockIssues, mockActionItems } from "@/lib/issuesMockData";

const Index = () => {
  const navigate = useNavigate();

  // Calculate metrics
  const openIncidents = mockIncidents.filter(i => i.status !== "Closed").length;
  const openIssues = mockIssues.filter(i => i.status !== "Closed").length;
  const totalActionItems = mockActionItems.length;
  const pendingActionItems = mockActionItems.filter(ap => ap.status !== "Closed").length;

  const hasOutstandingItems = openIncidents > 0 || openIssues > 0 || pendingActionItems > 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, John</h1>
          <p className="text-muted-foreground mt-1">
            {hasOutstandingItems 
              ? "You have items that need attention" 
              : "All caught up! Start by reporting an incident or flagging an issue."}
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openIncidents}</div>
              <p className="text-xs text-muted-foreground">
                {openIncidents > 0 ? "Require attention" : "All clear"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openIssues}</div>
              <p className="text-xs text-muted-foreground">
                {openIssues > 0 ? "Need resolution" : "All resolved"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingActionItems}</div>
              <p className="text-xs text-muted-foreground">
                Out of {totalActionItems} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalActionItems > 0 
                  ? Math.round(((totalActionItems - pendingActionItems) / totalActionItems) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Action items completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button 
              onClick={() => navigate("/incidents/new")} 
              className="h-auto flex-col gap-2 py-6"
              variant="outline"
            >
              <Plus className="h-5 w-5" />
              <div className="text-center">
                <div className="font-semibold">Report Incident</div>
                <div className="text-xs text-muted-foreground">Document a new incident</div>
              </div>
            </Button>

            <Button 
              onClick={() => navigate("/issues/new")} 
              className="h-auto flex-col gap-2 py-6"
              variant="outline"
            >
              <Plus className="h-5 w-5" />
              <div className="text-center">
                <div className="font-semibold">Flag Issue</div>
                <div className="text-xs text-muted-foreground">Create a new issue</div>
              </div>
            </Button>

            <Button 
              onClick={() => navigate("/incidents")} 
              className="h-auto flex-col gap-2 py-6"
              variant="outline"
            >
              <FileText className="h-5 w-5" />
              <div className="text-center">
                <div className="font-semibold">View Incidents</div>
                <div className="text-xs text-muted-foreground">Browse all incidents</div>
              </div>
            </Button>

            <Button 
              onClick={() => navigate("/issues")} 
              className="h-auto flex-col gap-2 py-6"
              variant="outline"
            >
              <AlertCircle className="h-5 w-5" />
              <div className="text-center">
                <div className="font-semibold">View Issues</div>
                <div className="text-xs text-muted-foreground">Browse all issues</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Information Accordion */}
        <Card>
          <CardHeader>
            <CardTitle>Understanding the System</CardTitle>
            <CardDescription>Learn about incidents and issues</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="incident">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>What is an Incident?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    An incident is an unplanned event or deviation from normal operations that has occurred. 
                    It represents something that has already happened and needs to be documented, tracked, 
                    and potentially linked to underlying issues for resolution.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="issue">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>What is an Issue?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    An issue represents a root cause or systemic problem that may lead to multiple incidents. 
                    Issues require action plans with specific tasks to resolve them. They are typically more 
                    strategic and require coordinated efforts to prevent future incidents.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="workflow">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>How do Incidents and Issues work together?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    When you report an incident, you can link it to an existing issue or create a new one. 
                    This connection helps identify patterns and address root causes. Each issue requires an 
                    action plan with specific steps to resolve the underlying problem and prevent future incidents.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Index;
