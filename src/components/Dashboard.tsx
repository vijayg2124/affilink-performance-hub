import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface DashboardProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface DashboardStats {
  totalRevenue: number;
  totalClicks: number;
  activeLinks: number;
  conversionRate: number;
}

interface TopLink {
  id: string;
  title: string;
  short_url: string;
  platform: string;
  is_active: boolean;
  clicks: number;
  revenue: number;
  conversions: number;
}

export function Dashboard({ activeTab, onTabChange }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalClicks: 0,
    activeLinks: 0,
    conversionRate: 0
  });
  const [topLinks, setTopLinks] = useState<TopLink[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch links with their stats
      const { data: links, error: linksError } = await supabase
        .from('affiliate_links')
        .select(`
          *,
          clicks:clicks(count),
          conversions_count:conversions(count),
          conversions_sum:conversions(sum:commission_amount)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (linksError) throw linksError;

      // Calculate stats
      let totalClicks = 0;
      let totalRevenue = 0;
      let totalConversions = 0;
      const activeLinks = links?.filter(link => link.is_active).length || 0;

      const topLinksData: TopLink[] = links?.map(link => {
        const clicks = link.clicks?.[0]?.count || 0;
        const conversions = link.conversions_count?.[0]?.count || 0;
        const revenue = link.conversions_sum?.[0]?.sum || 0;

        totalClicks += clicks;
        totalRevenue += revenue;
        totalConversions += conversions;

        return {
          id: link.id,
          title: link.title,
          short_url: link.short_url,
          platform: link.platform,
          is_active: link.is_active,
          clicks,
          conversions,
          revenue
        };
      }).slice(0, 5) || [];

      const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

      setStats({
        totalRevenue,
        totalClicks,
        activeLinks,
        conversionRate
      });

      setTopLinks(topLinksData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {renderStatCard(
          "Total Revenue",
          stats.totalRevenue.toFixed(2),
          12.5,
          <DollarSign className="h-4 w-4" />,
          "$"
        )}
        {renderStatCard(
          "Total Clicks",
          stats.totalClicks,
          -2.1,
          <MousePointer className="h-4 w-4" />
        )}
        {renderStatCard(
          "Active Links",
          stats.activeLinks,
          8.0,
          <LinkIcon className="h-4 w-4" />
        )}
        {renderStatCard(
          "Conversion Rate",
          `${stats.conversionRate.toFixed(2)}%`,
          0.8,
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
            {topLinks.length === 0 ? (
              <div className="text-center py-8">
                <LinkIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No links yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first affiliate link to start tracking performance
                </p>
                <Button onClick={() => onTabChange("links")} className="btn-hero">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Link
                </Button>
              </div>
            ) : (
              topLinks.map((link) => (
                <div 
                  key={link.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg bg-gradient-card hover:shadow-glow transition-smooth"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-foreground">{link.title}</h4>
                      <Badge 
                        variant={link.is_active ? "default" : "secondary"}
                        className={link.is_active ? "status-success" : ""}
                      >
                        {link.is_active ? "active" : "inactive"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {link.platform}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate max-w-md">
                      {link.short_url}
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
                      <div className="font-semibold text-primary">
                        {link.clicks > 0 ? ((link.conversions / link.clicks) * 100).toFixed(1) : 0}%
                      </div>
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
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}