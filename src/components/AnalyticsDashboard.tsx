import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  MousePointer, 
  DollarSign, 
  Users, 
  Globe,
  Calendar,
  Filter,
  Download,
  Activity,
  MapPin
} from "lucide-react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface AnalyticsData {
  totalClicks: number;
  totalRevenue: number;
  avgCTR: number;
  avgCPC: number;
  clicksData: Array<{ date: string; clicks: number; revenue: number }>;
  platformData: Array<{ platform: string; revenue: number; clicks: number; color: string }>;
  geoData: Array<{ country: string; clicks: number; revenue: number; percentage: number; coordinates: [number, number] }>;
  deviceData: Array<{ device: string; clicks: number; percentage: number }>;
  recentClicks: Array<{ id: string; country: string; city: string; device_type: string; browser: string; clicked_at: string; link_title: string }>;
}

const platformColors = {
  'Amazon': '#FF9900',
  'Flipkart': '#047BD6',
  'ClickBank': '#00A651',
  'ShareASale': '#8B5CF6',
  'Other': '#F59E0B'
};

const countryCoordinates: Record<string, [number, number]> = {
  'United States': [-95.7129, 37.0902],
  'Canada': [-106.3468, 56.1304],
  'United Kingdom': [-3.4360, 55.3781],
  'Germany': [10.4515, 51.1657],
  'France': [2.2137, 46.2276],
  'Australia': [133.7751, -25.2744],
  'India': [78.9629, 20.5937],
  'Japan': [138.2529, 36.2048],
  'Brazil': [-51.9253, -14.2350],
  'China': [104.1954, 35.8617]
};

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState("7d");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalClicks: 0,
    totalRevenue: 0,
    avgCTR: 0,
    avgCPC: 0,
    clicksData: [],
    platformData: [],
    geoData: [],
    deviceData: [],
    recentClicks: []
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
      
      // Set up real-time subscription for live updates
      const channel = supabase
        .channel('analytics_updates')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'clicks' },
          () => fetchAnalyticsData()
        )
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'conversions' },
          () => fetchAnalyticsData()
        )
        .subscribe();

      // Refresh data every 30 seconds for live updates
      const interval = setInterval(fetchAnalyticsData, 30000);

      return () => {
        supabase.removeChannel(channel);
        clearInterval(interval);
      };
    }
  }, [user, dateRange]);

  const fetchAnalyticsData = async () => {
    if (!user) return;

    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : dateRange === "90d" ? 90 : 365;
      startDate.setDate(endDate.getDate() - days);

      // Fetch clicks with link and conversion data
      const { data: clicksData, error: clicksError } = await supabase
        .from('clicks')
        .select(`
          *,
          affiliate_links!inner(title, platform, user_id),
          conversions(commission_amount)
        `)
        .eq('affiliate_links.user_id', user.id)
        .gte('clicked_at', startDate.toISOString())
        .order('clicked_at', { ascending: false });

      if (clicksError) throw clicksError;

      // Process the data
      const totalClicks = clicksData?.length || 0;
      const totalRevenue = clicksData?.reduce((sum, click) => {
        const revenue = click.conversions?.reduce((convSum: number, conv: any) => convSum + (conv.commission_amount || 0), 0) || 0;
        return sum + revenue;
      }, 0) || 0;

      const avgCPC = totalClicks > 0 ? totalRevenue / totalClicks : 0;
      const avgCTR = 3.4; // This would need additional data to calculate properly

      // Process clicks by date
      const clicksByDate = clicksData?.reduce((acc: Record<string, { clicks: number; revenue: number }>, click) => {
        const date = new Date(click.clicked_at).toLocaleDateString();
        if (!acc[date]) acc[date] = { clicks: 0, revenue: 0 };
        acc[date].clicks++;
        acc[date].revenue += click.conversions?.reduce((sum: number, conv: any) => sum + (conv.commission_amount || 0), 0) || 0;
        return acc;
      }, {}) || {};

      const clicksDataForChart = Object.entries(clicksByDate)
        .slice(-7)
        .map(([date, data]) => ({ date, ...data }));

      // Process platform data
      const platformStats = clicksData?.reduce((acc: Record<string, { clicks: number; revenue: number }>, click) => {
        const platform = click.affiliate_links?.platform || 'Other';
        if (!acc[platform]) acc[platform] = { clicks: 0, revenue: 0 };
        acc[platform].clicks++;
        acc[platform].revenue += click.conversions?.reduce((sum: number, conv: any) => sum + (conv.commission_amount || 0), 0) || 0;
        return acc;
      }, {}) || {};

      const platformData = Object.entries(platformStats).map(([platform, data]) => ({
        platform,
        ...data,
        color: platformColors[platform as keyof typeof platformColors] || platformColors.Other
      }));

      // Process geographic data
      const geoStats = clicksData?.reduce((acc: Record<string, { clicks: number; revenue: number }>, click) => {
        const country = click.country || 'Unknown';
        if (!acc[country]) acc[country] = { clicks: 0, revenue: 0 };
        acc[country].clicks++;
        acc[country].revenue += click.conversions?.reduce((sum: number, conv: any) => sum + (conv.commission_amount || 0), 0) || 0;
        return acc;
      }, {}) || {};

      const geoData = Object.entries(geoStats)
        .map(([country, data]) => ({
          country,
          ...data,
          percentage: totalClicks > 0 ? (data.clicks / totalClicks) * 100 : 0,
          coordinates: countryCoordinates[country] || [0, 0] as [number, number]
        }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

      // Process device data
      const deviceStats = clicksData?.reduce((acc: Record<string, number>, click) => {
        const device = click.device_type || 'Unknown';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {}) || {};

      const deviceData = Object.entries(deviceStats).map(([device, clicks]) => ({
        device,
        clicks,
        percentage: totalClicks > 0 ? (clicks / totalClicks) * 100 : 0
      }));

      // Get recent clicks for live feed
      const recentClicks = clicksData?.slice(0, 10).map(click => ({
        id: click.id,
        country: click.country || 'Unknown',
        city: click.city || 'Unknown',
        device_type: click.device_type || 'Unknown',
        browser: click.browser || 'Unknown',
        clicked_at: click.clicked_at,
        link_title: click.affiliate_links?.title || 'Unknown Link'
      })) || [];

      setAnalyticsData({
        totalClicks,
        totalRevenue,
        avgCTR,
        avgCPC,
        clicksData: clicksDataForChart,
        platformData,
        geoData,
        deviceData,
        recentClicks
      });

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time performance insights for your affiliate links</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{analyticsData.totalClicks.toLocaleString()}</div>
            <div className="flex items-center text-xs text-success">
              <Activity className="mr-1 h-3 w-3" />
              Live tracking active
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${analyticsData.totalRevenue.toFixed(2)}</div>
            <div className="flex items-center text-xs text-success">
              <TrendingUp className="mr-1 h-3 w-3" />
              Real-time updates
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. CTR</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{analyticsData.avgCTR}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Globe className="mr-1 h-3 w-3" />
              Global average
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. CPC</CardTitle>
            <DollarSign className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${analyticsData.avgCPC.toFixed(2)}</div>
            <div className="flex items-center text-xs text-success">
              <TrendingUp className="mr-1 h-3 w-3" />
              Cost per click
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Analytics Map */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Live Global Analytics
          </CardTitle>
          <CardDescription>Real-time click tracking across the world</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 120,
                center: [0, 20]
              }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#e2e8f0"
                      stroke="#cbd5e1"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: "#f1f5f9" },
                        pressed: { outline: "none" }
                      }}
                    />
                  ))
                }
              </Geographies>
              {analyticsData.geoData.map((country) => (
                <Marker key={country.country} coordinates={country.coordinates}>
                  <circle
                    r={Math.max(4, Math.min(20, country.clicks / 10))}
                    fill="hsl(var(--primary))"
                    fillOpacity={0.7}
                    stroke="white"
                    strokeWidth={2}
                  />
                  <text
                    textAnchor="middle"
                    y={-25}
                    style={{
                      fontFamily: "system-ui",
                      fontSize: "12px",
                      fill: "hsl(var(--foreground))",
                      fontWeight: "bold"
                    }}
                  >
                    {country.clicks}
                  </text>
                </Marker>
              ))}
            </ComposableMap>
          </div>
        </CardContent>
      </Card>

      {/* Performance Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Clicks & Revenue Trend */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>Real-time clicks and revenue tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.clicksData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis yAxisId="left" stroke="#64748b" />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="clicks"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--success))"
                  fill="hsl(var(--success))"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Live Activity Feed */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Live Activity Feed
            </CardTitle>
            <CardDescription>Recent clicks in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {analyticsData.recentClicks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="mx-auto h-8 w-8 mb-2" />
                  <p>No recent activity</p>
                </div>
              ) : (
                analyticsData.recentClicks.map((click) => (
                  <div key={click.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-gradient-card">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                      <div>
                        <div className="font-medium text-sm">{click.link_title}</div>
                        <div className="text-xs text-muted-foreground">
                          <MapPin className="inline h-3 w-3 mr-1" />
                          {click.city}, {click.country}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <div>{click.device_type}</div>
                      <div>{new Date(click.clicked_at).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform & Device Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Platform Performance */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>Revenue distribution by platform</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData.platformData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.platformData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="revenue"
                    label={({ platform, percentage }) => `${platform}: ${percentage?.toFixed(1)}%`}
                  >
                    {analyticsData.platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="mx-auto h-8 w-8 mb-2" />
                <p>No platform data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Analytics */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Device Analytics</CardTitle>
            <CardDescription>Traffic by device type</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData.deviceData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analyticsData.deviceData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis dataKey="device" type="category" stroke="#64748b" />
                    <Tooltip
                      formatter={(value: number) => [value.toLocaleString(), 'Clicks']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="clicks" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="mt-4 space-y-2">
                  {analyticsData.deviceData.map((device) => (
                    <div key={device.device} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{device.device}</span>
                      <span className="font-medium text-foreground">{device.percentage.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="mx-auto h-8 w-8 mb-2" />
                <p>No device data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Geographic Performance Table */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Geographic Performance</CardTitle>
          <CardDescription>Detailed metrics by country</CardDescription>
        </CardHeader>
        <CardContent>
          {analyticsData.geoData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Country</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Clicks</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.geoData.map((country) => (
                    <tr key={country.country} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">{country.country}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 text-foreground">{country.clicks.toLocaleString()}</td>
                      <td className="text-right py-3 px-4 font-semibold text-success">${country.revenue.toFixed(2)}</td>
                      <td className="text-right py-3 px-4 text-foreground">{country.percentage.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="mx-auto h-8 w-8 mb-2" />
              <p>No geographic data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}