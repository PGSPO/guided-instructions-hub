import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock, FileText, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { IssueStatus } from "@/types/issue";

interface MetricCardProps {
  title: string;
  count: number;
  status: IssueStatus;
  onClick: (status: IssueStatus) => void;
  isActive: boolean;
}

const MetricCard = ({ title, count, status, onClick, isActive }: MetricCardProps) => {
  const getIcon = () => {
    switch (status) {
      case "Draft":
        return <FileText className="h-5 w-5" />;
      case "Submitted":
        return <AlertCircle className="h-5 w-5" />;
      case "In Progress":
        return <Clock className="h-5 w-5" />;
      case "Completed":
        return <CheckCheck className="h-5 w-5" />;
      case "Closed":
        return <CheckCircle2 className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getColorClasses = () => {
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
        return "bg-status-open/10 text-status-open border-status-open/20";
    }
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isActive && "ring-2 ring-primary shadow-md"
      )}
      onClick={() => onClick(status)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{count}</p>
          </div>
          <div className={cn("p-3 rounded-lg border", getColorClasses())}>
            {getIcon()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface IssueMetricCardsProps {
  metrics: Array<{ title: string; count: number; status: IssueStatus }>;
  onFilterChange: (status: IssueStatus | null) => void;
  activeFilter: IssueStatus | null;
}

export const IssueMetricCards = ({ metrics, onFilterChange, activeFilter }: IssueMetricCardsProps) => {
  const handleCardClick = (status: IssueStatus) => {
    if (activeFilter === status) {
      onFilterChange(null);
    } else {
      onFilterChange(status);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.status}
          {...metric}
          onClick={handleCardClick}
          isActive={activeFilter === metric.status}
        />
      ))}
    </div>
  );
};
