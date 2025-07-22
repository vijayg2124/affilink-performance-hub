import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  MousePointer, 
  Link as LinkIcon, 
  BarChart3,
  Plus,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { LinkManager } from "./LinkManager";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { RevenueTracker } from "./RevenueTracker";

interface DashboardProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// Mock data for demonstration
const mockStats = {
  totalRevenue: 24750.50,
  totalClicks: 12843,
  activeLinks: 47,
  conversionRate: 3.2,
  revenueChange: 12.5,
  clicksChange: -2.1,
  linksChange: 8.0,
  conversionChange: 0.8
};

const mockRecentLinks = [
  {
    id: "1",
    name: "iPhone 15 Pro Review",
    url: "https://amzn.to/abc123",
    clicks: 1547,
    revenue: 2340.50,
    platform: "Amazon",
    status: "active",
    ctr: 3.2
  },
  {
    id: "2", 
    name: "Best Laptops 2024",
    url: "https://flipkart.com/xyz789",
    clicks: 892,
    revenue: 1850.25,
    platform: "Flipkart",
    status: "active",
    ctr: 2.8
  },
  {
    id: "3",
    name: "Digital Marketing Course",
    url: "https://clickbank.net/def456",
    clicks: 456,
    revenue: 890.00,
    platform: "ClickBank",
    status: "paused",
    ctr: 4.1
  }
];

export function Dashboard({ activeTab, onTabChange }: DashboardProps) {
  const [selectedLink, setSelectedLink] = useState<string | null>(null);

  const renderStatCard = (
    title: string,
    value: string | number,
    change: number,
    icon: React.ReactNode,
    prefix?: string
  ) => (
    <Card className="bg-gradient-card hover:shadow-elegant transition-smooth">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="flex items-center text-xs">
          {change > 0 ? (
            <TrendingUp className="mr-1 h-3 w-3 text-success" />
          ) : (
            <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
          )}
          <span className={change > 0 ? "text-success" : "text-destructive"}>
            {Math.abs(change)}%
          </span>
          <span className="text-muted-foreground ml-1">from last month</span>
        </div>
      </CardContent>
    </Card>
  );

  if (activeTab === "links") {
    return <LinkManager />;
  }

  if (activeTab === "analytics") {
    return <AnalyticsDashboard />;
  }

  if (activeTab === "revenue") {
    return <RevenueTracker />;
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {renderStatCard(
          "Total Revenue",
          mockStats.totalRevenue.toFixed(2),
          mockStats.revenueChange,
          <DollarSign className="h-4 w-4" />,
          "$"
        )}
        {renderStatCard(
          "Total Clicks",
          mockStats.totalClicks,
          mockStats.clicksChange,
          <MousePointer className="h-4 w-4" />
        )}
        {renderStatCard(
          "Active Links",
          mockStats.activeLinks,
          mockStats.linksChange,
          <LinkIcon className="h-4 w-4" />
        )}
        {renderStatCard(
          "Conversion Rate",
          `${mockStats.conversionRate}%`,
          mockStats.conversionChange,
          <BarChart3 className="h-4 w-4" />
        )}
      </div>

      {/* Recent Links Performance */}
      <Card className="shadow-elegant">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Top Performing Links</CardTitle>
            <CardDescription>Your highest converting affiliate links this month</CardDescription>
          </div>
          <Button onClick={() => onTabChange("links")} className="btn-hero">
            <Plus className="mr-2 h-4 w-4" />
            Add Link
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentLinks.map((link) => (
              <div 
                key={link.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg bg-gradient-card hover:shadow-glow transition-smooth"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-foreground">{link.name}</h4>
                    <Badge 
                      variant={link.status === "active" ? "default" : "secondary"}
                      className={link.status === "active" ? "status-success" : ""}
                    >
                      {link.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {link.platform}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate max-w-md">
                    {link.url}
                  </p>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-foreground">{link.clicks.toLocaleString()}</div>
                    <div className="text-muted-foreground">Clicks</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-success">${link.revenue.toFixed(2)}</div>
                    <div className="text-muted-foreground">Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-primary">{link.ctr}%</div>
                    <div className="text-muted-foreground">CTR</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onTabChange("analytics")}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}