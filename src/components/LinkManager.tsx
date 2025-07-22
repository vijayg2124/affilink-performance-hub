import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  Copy, 
  Edit, 
  Trash2, 
  BarChart3,
  Globe,
  Zap,
  Link as LinkIcon
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface AffiliateLink {
  id: string;
  name: string;
  originalUrl: string;
  smartUrl: string;
  platform: string;
  category: string;
  status: "active" | "paused" | "inactive";
  clicks: number;
  revenue: number;
  ctr: number;
  createdAt: string;
  isSmartLink: boolean;
}

const mockLinks: AffiliateLink[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max - Amazon",
    originalUrl: "https://amazon.com/iphone-15-pro-max",
    smartUrl: "https://your-domain.com/go/iphone15pro",
    platform: "Amazon",
    category: "Electronics",
    status: "active",
    clicks: 2547,
    revenue: 3840.50,
    ctr: 4.2,
    createdAt: "2024-01-15",
    isSmartLink: true
  },
  {
    id: "2",
    name: "MacBook Air M3 - Best Buy",
    originalUrl: "https://bestbuy.com/macbook-air-m3",
    smartUrl: "https://your-domain.com/go/macbook-air",
    platform: "Best Buy",
    category: "Electronics",
    status: "active",
    clicks: 1893,
    revenue: 2650.25,
    ctr: 3.8,
    createdAt: "2024-01-20",
    isSmartLink: true
  },
  {
    id: "3",
    name: "Digital Marketing Course",
    originalUrl: "https://clickbank.net/digital-marketing",
    smartUrl: "https://your-domain.com/go/dm-course",
    platform: "ClickBank",
    category: "Education",
    status: "paused",
    clicks: 456,
    revenue: 1290.00,
    ctr: 6.1,
    createdAt: "2024-01-10",
    isSmartLink: false
  }
];

export function LinkManager() {
  const [links, setLinks] = useState<AffiliateLink[]>(mockLinks);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const { toast } = useToast();

  const [newLink, setNewLink] = useState({
    name: "",
    originalUrl: "",
    platform: "",
    category: "",
    isSmartLink: true
  });

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.platform.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === "all" || link.platform === filterPlatform;
    const matchesStatus = filterStatus === "all" || link.status === filterStatus;
    
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const handleCopyLink = (link: AffiliateLink) => {
    navigator.clipboard.writeText(link.smartUrl);
    toast({
      title: "Link copied!",
      description: "The affiliate link has been copied to your clipboard.",
    });
  };

  const handleAddLink = () => {
    if (!newLink.name || !newLink.originalUrl || !newLink.platform) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const link: AffiliateLink = {
      id: Date.now().toString(),
      name: newLink.name,
      originalUrl: newLink.originalUrl,
      smartUrl: `https://your-domain.com/go/${Date.now()}`,
      platform: newLink.platform,
      category: newLink.category || "General",
      status: "active",
      clicks: 0,
      revenue: 0,
      ctr: 0,
      createdAt: new Date().toISOString().split('T')[0],
      isSmartLink: newLink.isSmartLink
    };

    setLinks([...links, link]);
    setNewLink({ name: "", originalUrl: "", platform: "", category: "", isSmartLink: true });
    setIsAddLinkOpen(false);
    
    toast({
      title: "Link added successfully!",
      description: "Your new affiliate link is now active and ready to use.",
    });
  };

  const platforms = Array.from(new Set(links.map(link => link.platform)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Link Management</h1>
          <p className="text-muted-foreground">Manage and optimize your affiliate links</p>
        </div>
        
        <Dialog open={isAddLinkOpen} onOpenChange={setIsAddLinkOpen}>
          <DialogTrigger asChild>
            <Button className="btn-hero">
              <Plus className="mr-2 h-4 w-4" />
              Add New Link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Affiliate Link</DialogTitle>
              <DialogDescription>
                Create a new affiliate link with smart tracking capabilities.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="link-name">Link Name *</Label>
                <Input
                  id="link-name"
                  placeholder="e.g., iPhone 15 Pro Review"
                  value={newLink.name}
                  onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="original-url">Original URL *</Label>
                <Input
                  id="original-url"
                  placeholder="https://amazon.com/product-link"
                  value={newLink.originalUrl}
                  onChange={(e) => setNewLink({ ...newLink, originalUrl: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="platform">Platform *</Label>
                <Select onValueChange={(value) => setNewLink({ ...newLink, platform: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Amazon">Amazon</SelectItem>
                    <SelectItem value="Flipkart">Flipkart</SelectItem>
                    <SelectItem value="ClickBank">ClickBank</SelectItem>
                    <SelectItem value="ShareASale">ShareASale</SelectItem>
                    <SelectItem value="Commission Junction">Commission Junction</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Electronics, Fashion"
                  value={newLink.category}
                  onChange={(e) => setNewLink({ ...newLink, category: e.target.value })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="smart-link"
                  checked={newLink.isSmartLink}
                  onCheckedChange={(checked) => setNewLink({ ...newLink, isSmartLink: checked })}
                />
                <Label htmlFor="smart-link" className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Enable Smart Link (A/B Testing)
                </Label>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsAddLinkOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddLink} className="btn-success">
                  Add Link
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search links..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterPlatform} onValueChange={setFilterPlatform}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                {platforms.map(platform => (
                  <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Links Grid */}
      <div className="grid gap-4">
        {filteredLinks.map((link) => (
          <Card key={link.id} className="bg-gradient-card hover:shadow-elegant transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-foreground">{link.name}</h3>
                    {link.isSmartLink && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        <Zap className="mr-1 h-3 w-3" />
                        Smart Link
                      </Badge>
                    )}
                    <Badge 
                      variant={link.status === "active" ? "default" : "secondary"}
                      className={link.status === "active" ? "status-success" : ""}
                    >
                      {link.status}
                    </Badge>
                    <Badge variant="outline">{link.platform}</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Smart URL:</span>
                      <code className="text-primary font-mono text-xs bg-primary/10 px-2 py-1 rounded">
                        {link.smartUrl}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Original:</span>
                      <span className="text-xs text-muted-foreground truncate max-w-md">
                        {link.originalUrl}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="font-semibold text-foreground">{link.clicks.toLocaleString()}</div>
                      <div className="text-muted-foreground">Clicks</div>
                    </div>
                    <div>
                      <div className="font-semibold text-success">${link.revenue.toFixed(2)}</div>
                      <div className="text-muted-foreground">Revenue</div>
                    </div>
                    <div>
                      <div className="font-semibold text-primary">{link.ctr}%</div>
                      <div className="text-muted-foreground">CTR</div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleCopyLink(link)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <BarChart3 className="h-4 w-4" />
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
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredLinks.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <LinkIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No links found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterPlatform !== "all" || filterStatus !== "all" 
                ? "Try adjusting your search or filters" 
                : "Get started by adding your first affiliate link"}
            </p>
            <Button onClick={() => setIsAddLinkOpen(true)} className="btn-hero">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Link
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}