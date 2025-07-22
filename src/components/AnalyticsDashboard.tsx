import { useState } from "react";
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
  Download
} from "lucide-react";

// Mock data for charts
const clicksData = [
  { date: "Jan 1", clicks: 245, revenue: 450.25 },
  { date: "Jan 2", clicks: 289, revenue: 523.50 },
  { date: "Jan 3", clicks: 356, revenue: 678.75 },
  { date: "Jan 4", clicks: 412, revenue: 789.25 },
  { date: "Jan 5", clicks: 378, revenue: 695.50 },
  { date: "Jan 6", clicks: 445, revenue: 825.75 },
  { date: "Jan 7", clicks: 389, revenue: 712.25 }
];

const platformData = [
  { platform: "Amazon", revenue: 8450.25, clicks: 2450, color: "#FF9900" },
  { platform: "Flipkart", revenue: 5230.50, clicks: 1680, color: "#047BD6" },
  { platform: "ClickBank", revenue: 3890.75, clicks: 890, color: "#00A651" },
  { platform: "ShareASale", revenue: 2340.25, clicks: 567, color: "#8B5CF6" },
  { platform: "Other", revenue: 1560.75, clicks: 234, color: "#F59E0B" }
];

const geoData = [
  { country: "United States", clicks: 3245, revenue: 6780.50, percentage: 45.2 },
  { country: "Canada", clicks: 1890, revenue: 3456.25, percentage: 26.3 },
  { country: "United Kingdom", clicks: 1234, revenue: 2345.75, percentage: 17.2 },
  { country: "Australia", clicks: 567, revenue: 1234.50, percentage: 7.9 },
  { country: "Germany", clicks: 234, revenue: 567.25, percentage: 3.4 }
];

const deviceData = [
  { device: "Desktop", clicks: 4567, percentage: 63.2 },
  { device: "Mobile", clicks: 2234, percentage: 30.9 },
  { device: "Tablet", clicks: 423, percentage: 5.9 }
];

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("clicks");

  const totalClicks = clicksData.reduce((sum, item) => sum + item.clicks, 0);
  const totalRevenue = clicksData.reduce((sum, item) => sum + item.revenue, 0);
  const avgCTR = 3.4;
  const avgCPC = totalRevenue / totalClicks;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Detailed performance insights for your affiliate links</p>
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
            <div className="text-2xl font-bold text-foreground">{totalClicks.toLocaleString()}</div>
            <div className="flex items-center text-xs text-success">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12.5% from last period
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalRevenue.toFixed(2)}</div>
            <div className="flex items-center text-xs text-success">
              <TrendingUp className="mr-1 h-3 w-3" />
              +8.7% from last period
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. CTR</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{avgCTR}%</div>
            <div className="flex items-center text-xs text-success">
              <TrendingUp className="mr-1 h-3 w-3" />
              +0.3% from last period
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. CPC</CardTitle>
            <DollarSign className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${avgCPC.toFixed(2)}</div>
            <div className="flex items-center text-xs text-success">
              <TrendingUp className="mr-1 h-3 w-3" />
              +5.1% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Clicks & Revenue Trend */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>Clicks and revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={clicksData}>
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

        {/* Platform Performance */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>Revenue distribution by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="revenue"
                  label={({ platform, percentage }) => `${platform}: ${percentage}%`}
                >
                  {platformData.map((entry, index) => (
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
          </CardContent>
        </Card>
      </div>

      {/* Geographic & Device Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Geographic Performance */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Geographic Performance</CardTitle>
            <CardDescription>Top performing countries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {geoData.map((country, index) => (
                <div key={country.country} className="flex items-center justify-between p-3 border border-border rounded-lg bg-gradient-card">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{country.country}</div>
                      <div className="text-sm text-muted-foreground">{country.clicks.toLocaleString()} clicks</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-success">${country.revenue.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">{country.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Performance */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Device Analytics</CardTitle>
            <CardDescription>Traffic by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={deviceData} layout="horizontal">
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
              {deviceData.map((device) => (
                <div key={device.device} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{device.device}</span>
                  <span className="font-medium text-foreground">{device.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Breakdown Table */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Platform Performance Breakdown</CardTitle>
          <CardDescription>Detailed metrics for each affiliate platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Platform</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Clicks</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">CTR</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">CPC</th>
                </tr>
              </thead>
              <tbody>
                {platformData.map((platform) => {
                  const ctr = ((platform.clicks / totalClicks) * 100).toFixed(1);
                  const cpc = (platform.revenue / platform.clicks).toFixed(2);
                  
                  return (
                    <tr key={platform.platform} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: platform.color }}
                          />
                          <span className="font-medium text-foreground">{platform.platform}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 text-foreground">{platform.clicks.toLocaleString()}</td>
                      <td className="text-right py-3 px-4 font-semibold text-success">${platform.revenue.toFixed(2)}</td>
                      <td className="text-right py-3 px-4 text-foreground">{ctr}%</td>
                      <td className="text-right py-3 px-4 text-foreground">${cpc}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}