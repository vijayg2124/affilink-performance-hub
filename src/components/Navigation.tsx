import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  BarChart3, 
  DollarSign, 
  Settings, 
  User,
  Bell,
  Search,
  Menu,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "links", label: "Link Manager", icon: LinkIcon },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "revenue", label: "Revenue", icon: DollarSign },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center justify-between bg-card border-b border-border px-6 py-4 shadow-glow">
        {/* Logo & Brand */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <LinkIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AffiLink</h1>
              <p className="text-xs text-muted-foreground">Performance Hub</p>
            </div>
          </div>
          
          {/* Navigation Items */}
          <div className="flex gap-2">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 transition-smooth ${
                  activeTab === item.id 
                    ? "bg-gradient-primary text-white shadow-md" 
                    : "hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search links, analytics..."
              className="pl-10 w-64"
            />
          </div>
          
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>
          
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="text-sm">
              <div className="font-medium text-foreground">John Doe</div>
              <div className="text-xs text-muted-foreground">Pro Plan</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-card border-b border-border shadow-glow">
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <LinkIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">AffiLink</h1>
              <p className="text-xs text-muted-foreground">Performance Hub</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-border bg-muted/50 p-4 space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                onClick={() => {
                  onTabChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full justify-start gap-3 transition-smooth ${
                  activeTab === item.id 
                    ? "bg-gradient-primary text-white shadow-md" 
                    : "hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
            
            <div className="pt-4 border-t border-border mt-4">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center gap-3 p-2 rounded-lg bg-card">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground text-sm">John Doe</div>
                  <div className="text-xs text-muted-foreground">Pro Plan</div>
                </div>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}