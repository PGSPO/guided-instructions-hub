import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IssueMetricCards } from "@/components/issues/IssueMetricCards";
import { IssueTable } from "@/components/issues/IssueTable";
import { mockIssues, mockUsers } from "@/lib/issuesMockData";
import { IssueStatus } from "@/types/issue";

export default function IssueList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState<IssueStatus | null>(null);
  
  const currentUser = mockUsers[0]; // Mock current user

  // Calculate metrics
  const metrics = [
    { title: "Draft", count: mockIssues.filter(i => i.status === "Draft").length, status: "Draft" as IssueStatus },
    { title: "Submitted", count: mockIssues.filter(i => i.status === "Submitted").length, status: "Submitted" as IssueStatus },
    { title: "In Progress", count: mockIssues.filter(i => i.status === "In Progress").length, status: "In Progress" as IssueStatus },
    { title: "Completed", count: mockIssues.filter(i => i.status === "Completed").length, status: "Completed" as IssueStatus },
    { title: "Closed", count: mockIssues.filter(i => i.status === "Closed").length, status: "Closed" as IssueStatus },
  ];

  // Filter issues based on search, tab, and status
  const filteredIssues = mockIssues.filter(issue => {
    const matchesSearch = searchQuery === "" || 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.owner.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === null || issue.status === statusFilter;
    
    let matchesTab = true;
    if (activeTab === "my") {
      matchesTab = issue.owner.id === currentUser.id;
    } else if (activeTab === "observing") {
      matchesTab = issue.observers.some(o => o.id === currentUser.id);
    }
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Issues</h2>
          <p className="text-muted-foreground mt-1">
            Manage and track all issues across the organization
          </p>
        </div>
        <Button onClick={() => navigate("/issues/new")} className="bg-gradient-primary">
          <Plus className="mr-2 h-4 w-4" />
          New Issue
        </Button>
      </div>

      {/* Metrics Cards */}
      <IssueMetricCards 
        metrics={metrics} 
        onFilterChange={setStatusFilter}
        activeFilter={statusFilter}
      />

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs and Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="all">All Issues</TabsTrigger>
          <TabsTrigger value="my">My Issues</TabsTrigger>
          <TabsTrigger value="observing">Observing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <IssueTable issues={filteredIssues} />
        </TabsContent>
        
        <TabsContent value="my" className="space-y-4">
          <IssueTable issues={filteredIssues} />
        </TabsContent>
        
        <TabsContent value="observing" className="space-y-4">
          <IssueTable issues={filteredIssues} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
