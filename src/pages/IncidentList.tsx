import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCards } from "@/components/incidents/MetricCards";
import { IncidentTable } from "@/components/incidents/IncidentTable";
import { mockIncidents, mockUsers } from "@/lib/mockData";
import { IncidentStatus } from "@/types/incident";

export default function IncidentList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | null>(null);
  
  const currentUser = mockUsers[0]; // Mock current user

  // Calculate metrics
  const metrics = [
    { title: "Draft", count: mockIncidents.filter(i => i.status === "Draft").length, status: "Draft" as IncidentStatus },
    { title: "In Progress", count: mockIncidents.filter(i => i.status === "In Progress").length, status: "In Progress" as IncidentStatus },
    { title: "Submitted", count: mockIncidents.filter(i => i.status === "Submitted").length, status: "Submitted" as IncidentStatus },
    { title: "Closed", count: mockIncidents.filter(i => i.status === "Closed").length, status: "Closed" as IncidentStatus },
  ];

  // Filter incidents based on search, tab, and status
  const filteredIncidents = mockIncidents.filter(incident => {
    const matchesSearch = searchQuery === "" || 
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.owner.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === null || incident.status === statusFilter;
    
    let matchesTab = true;
    if (activeTab === "my") {
      matchesTab = incident.owner.id === currentUser.id;
    } else if (activeTab === "observing") {
      matchesTab = incident.observers.some(o => o.id === currentUser.id);
    }
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Incidents</h2>
          <p className="text-muted-foreground mt-1">
            Manage and track all incidents across the organization
          </p>
        </div>
        <Button onClick={() => navigate("/incidents/new")} className="bg-gradient-primary">
          <Plus className="mr-2 h-4 w-4" />
          New Incident
        </Button>
      </div>

      {/* Metrics Cards */}
      <MetricCards 
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
          <TabsTrigger value="all">All Incidents</TabsTrigger>
          <TabsTrigger value="my">My Incidents</TabsTrigger>
          <TabsTrigger value="observing">Observing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <IncidentTable incidents={filteredIncidents} />
        </TabsContent>
        
        <TabsContent value="my" className="space-y-4">
          <IncidentTable incidents={filteredIncidents} />
        </TabsContent>
        
        <TabsContent value="observing" className="space-y-4">
          <IncidentTable incidents={filteredIncidents} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
