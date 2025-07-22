import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

// Mock revenue data
const monthlyRevenue = [
  { month: "Jan", amazon: 8450, flipkart: 5230, clickbank: 3890, total: 17570 },
  { month: "Feb", amazon: 9230, flipkart: 4890, clickbank: 4120, total: 18240 },
  { month: "Mar", amazon: 10120, flipkart: 5680, clickbank: 3950, total: 19750 },
  { month: "Apr", amazon: 11450, flipkart: 6230, clickbank: 4890, total: 22570 },
  { month: "May", amazon: 12890, flipkart: 7120, clickbank: 5230, total: 25240 },
  { month: "Jun", amazon: 13560, flipkart: 7890, clickbank: 5890, total: 27340 }
];

const platformBreakdown = [
  { platform: "Amazon", revenue: 13560, percentage: 49.6, commission: 4.5, color: "#FF9900" },
  { platform: "Flipkart", revenue: 7890, percentage: 28.9, commission: 6.2, color: "#047BD6" },
  { platform: "ClickBank", revenue: 5890, percentage: 21.5, commission: 35.0, color: "#00A651" }
];

const revenueGoals = [
  { period: "Monthly", target: 30000, current: 27340, label: "This Month" },
  { period: "Quarterly", target: 75000, current: 65150, label: "Q2 2024" },
  { period: "Yearly", target: 250000, current: 156780, label: "2024" }
];

const topEarningLinks = [
  {
    id: "1",
    name: "iPhone 15 Pro Max Review",
    platform: "Amazon",
    revenue: 3456.78,
    clicks: 2450,
    conversion: 4.2,
    trend: "up",
    change: 12.5
  },
  {
    id: "2",
    name: "MacBook Air M3 Guide",
    platform: "Amazon",
    revenue: 2890.45,
    clicks: 1890,
    conversion: 3.8,
    trend: "up",
    change: 8.3
  },
  {
    id: "3",
    name: "Digital Marketing Course",
    platform: "ClickBank",
    revenue: 2340.50,
    clicks: 567,
    conversion: 15.2,
    trend: "down",
    change: -2.1
  },
  {
    id: "4",
    name: "Samsung Galaxy S24",
    platform: "Flipkart",
    revenue: 1890.25,
    clicks: 1234,
    conversion: 2.9,
    trend: "up",
    change: 15.7
  }
];

const paymentStatus = [
  {
    platform: "Amazon",
    pendingAmount: 2456.78,
    lastPayment: "2024-01-15",
    nextPayment: "2024-02-15",
    status: "pending",
    minimumPayout: 100
  },
  {
    platform: "Flipkart",
    pendingAmount: 1890.45,
    lastPayment: "2024-01-20",
    nextPayment: "2024-02-20",
    status: "pending",
    minimumPayout: 250
  },
  {
    platform: "ClickBank",
    pendingAmount: 3456.90,
    lastPayment: "2024-01-10",
    nextPayment: "2024-02-10",
    status: "processing",
    minimumPayout: 50
  }
];

export function RevenueTracker() {
  const [timeRange, setTimeRange] = useState("6m");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  const totalRevenue = monthlyRevenue[monthlyRevenue.length - 1].total;
  const previousTotal = monthlyRevenue[monthlyRevenue.length - 2].total;
  const revenueGrowth = ((totalRevenue - previousTotal) / previousTotal * 100).toFixed(1);

  const totalPending = paymentStatus.reduce((sum, platform) => sum + platform.pendingAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Revenue Tracker</h1>
          <p className="text-muted-foreground">Monitor earnings across all affiliate platforms</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Data
          </Button>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs">
              <TrendingUp className="mr-1 h-3 w-3 text-success" />
              <span className="text-success">+{revenueGrowth}%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalPending.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">
              Across {paymentStatus.length} platforms
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Commission</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12.4%</div>
            <div className="flex items-center text-xs">
              <TrendingUp className="mr-1 h-3 w-3 text-success" />
              <span className="text-success">+2.1%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Platform</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">Amazon</div>
            <div className="text-xs text-muted-foreground">
              49.6% of total revenue
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Goals */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Revenue Goals</CardTitle>
          <CardDescription>Track your progress towards revenue targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {revenueGoals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              const remaining = goal.target - goal.current;
              
              return (
                <div key={goal.period} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-foreground">{goal.label}</h4>
                    <Badge variant={progress >= 100 ? "default" : progress >= 75 ? "secondary" : "outline"}>
                      {progress.toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <Progress value={Math.min(progress, 100)} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      ${remaining.toLocaleString()} left
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Revenue Trend */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="amazon" 
                  stroke="#FF9900" 
                  strokeWidth={2}
                  dot={{ fill: '#FF9900', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="flipkart" 
                  stroke="#047BD6" 
                  strokeWidth={2}
                  dot={{ fill: '#047BD6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="clickbank" 
                  stroke="#00A651" 
                  strokeWidth={2}
                  dot={{ fill: '#00A651', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Revenue Breakdown */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Platform Breakdown</CardTitle>
            <CardDescription>Revenue distribution and commission rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={platformBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="revenue"
                  label={({ platform, percentage }) => `${platform}: ${percentage}%`}
                >
                  {platformBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="mt-4 space-y-2">
              {platformBreakdown.map((platform) => (
                <div key={platform.platform} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: platform.color }}
                    />
                    <span className="text-sm font-medium">{platform.platform}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{platform.commission}% commission</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Earning Links */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Top Earning Links</CardTitle>
          <CardDescription>Your highest revenue generating affiliate links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topEarningLinks.map((link, index) => (
              <div 
                key={link.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg bg-gradient-card hover:shadow-glow transition-smooth"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{link.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">{link.platform}</Badge>
                      <span>{link.clicks.toLocaleString()} clicks</span>
                      <span>•</span>
                      <span>{link.conversion}% conversion</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold text-success text-lg">
                      ${link.revenue.toFixed(2)}
                    </div>
                    <div className="flex items-center text-xs">
                      {link.trend === "up" ? (
                        <TrendingUp className="mr-1 h-3 w-3 text-success" />
                      ) : (
                        <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
                      )}
                      <span className={link.trend === "up" ? "text-success" : "text-destructive"}>
                        {Math.abs(link.change)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Status */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Payment Status</CardTitle>
          <CardDescription>Track pending payments from affiliate platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {paymentStatus.map((payment) => (
              <div 
                key={payment.platform}
                className="p-4 border border-border rounded-lg bg-gradient-card space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-foreground">{payment.platform}</h4>
                  <Badge 
                    variant={payment.status === "processing" ? "default" : "secondary"}
                    className={payment.status === "processing" ? "status-warning" : ""}
                  >
                    {payment.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pending Amount</span>
                    <span className="font-semibold text-foreground">${payment.pendingAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Payment</span>
                    <span className="text-foreground">{payment.lastPayment}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Next Payment</span>
                    <span className="text-foreground">{payment.nextPayment}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Min. Payout</span>
                    <span className="text-foreground">${payment.minimumPayout}</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Progress 
                    value={(payment.pendingAmount / payment.minimumPayout) * 100} 
                    className="h-2" 
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {payment.pendingAmount >= payment.minimumPayout 
                      ? "Ready for payout" 
                      : `$${(payment.minimumPayout - payment.pendingAmount).toFixed(2)} until payout`
                    }
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