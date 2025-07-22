import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AffiliateLink {
  id: string;
  title: string;
  original_url: string;
  short_url: string;
  platform: string;
  category: string | null;
  is_active: boolean;
  created_at: string;
  clicks?: number;
  conversions?: number;
  revenue?: number;
}

export function LinkManager() {
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const [newLink, setNewLink] = useState({
    title: "",
    original_url: "",
    platform: "",
    category: ""
  });

  useEffect(() => {
    if (user) {
      fetchLinks();
      // Set up real-time subscription
      const channel = supabase
        .channel('affiliate_links_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'affiliate_links' },
          () => fetchLinks()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchLinks = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('affiliate_links')
        .select(`
          *,
          clicks:clicks(count),
          conversions:conversions(count, sum:commission_amount)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const linksWithStats = data.map(link => ({
        ...link,
        clicks: link.clicks?.[0]?.count || 0,
        conversions: link.conversions?.[0]?.count || 0,
        revenue: link.conversions?.[0]?.sum || 0
      }));

      setLinks(linksWithStats);
    } catch (error) {
      console.error('Error fetching links:', error);
      toast({
        title: "Error",
        description: "Failed to fetch affiliate links",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateShortUrl = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `https://short.ly/${result}`;
  };

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.platform.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === "all" || link.platform === filterPlatform;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && link.is_active) ||
                         (filterStatus === "inactive" && !link.is_active);
    
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const handleCopyLink = (link: AffiliateLink) => {
    navigator.clipboard.writeText(link.short_url);
    toast({
      title: "Link copied!",
      description: "The affiliate link has been copied to your clipboard.",
    });
  };

  const handleAddLink = async () => {
    if (!newLink.title || !newLink.original_url || !newLink.platform) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('affiliate_links')
        .insert([{
          user_id: user.id,
          title: newLink.title,
          original_url: newLink.original_url,
          short_url: generateShortUrl(),
          platform: newLink.platform,
          category: newLink.category || null,
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;

      setNewLink({ title: "", original_url: "", platform: "", category: "" });
      setIsAddLinkOpen(false);
      
      toast({
        title: "Link added successfully!",
        description: "Your new affiliate link is now active and ready to use.",
      });

      fetchLinks();
    } catch (error) {
      console.error('Error creating link:', error);
      toast({
        title: "Error",
        description: "Failed to create affiliate link",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = async (linkId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('affiliate_links')
        .update({ is_active: !currentStatus })
        .eq('id', linkId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Link ${!currentStatus ? 'activated' : 'deactivated'} successfully`
      });

      fetchLinks();
    } catch (error) {
      console.error('Error updating link status:', error);
      toast({
        title: "Error",
        description: "Failed to update link status",
        variant: "destructive"
      });
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      const { error } = await supabase
        .from('affiliate_links')
        .delete()
        .eq('id', linkId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Link deleted successfully"
      });

      fetchLinks();
    } catch (error) {
      console.error('Error deleting link:', error);
      toast({
        title: "Error",
        description: "Failed to delete link",
        variant: "destructive"
      });
    }
  };

  const platforms = Array.from(new Set(links.map(link => link.platform)));

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
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="original-url">Original URL *</Label>
                <Input
                  id="original-url"
                  placeholder="https://amazon.com/product-link"
                  value={newLink.original_url}
                  onChange={(e) => setNewLink({ ...newLink, original_url: e.target.value })}
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
                    <h3 className="text-lg font-semibold text-foreground">{link.title}</h3>
                    <Badge 
                      variant={link.is_active ? "default" : "secondary"}
                      className={link.is_active ? "status-success" : ""}
                    >
                      {link.is_active ? "active" : "inactive"}
                    </Badge>
                    <Badge variant="outline">{link.platform}</Badge>
                    {link.category && (
                      <Badge variant="secondary">{link.category}</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Smart URL:</span>
                      <code className="text-primary font-mono text-xs bg-primary/10 px-2 py-1 rounded">
                        {link.short_url}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Original:</span>
                      <span className="text-xs text-muted-foreground truncate max-w-md">
                        {link.original_url}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="font-semibold text-foreground">{(link.clicks || 0).toLocaleString()}</div>
                      <div className="text-muted-foreground">Clicks</div>
                    </div>
                    <div>
                      <div className="font-semibold text-success">${(link.revenue || 0).toFixed(2)}</div>
                      <div className="text-muted-foreground">Revenue</div>
                    </div>
                    <div>
                      <div className="font-semibold text-primary">
                        {link.clicks && link.clicks > 0 ? 
                          (((link.conversions || 0) / link.clicks) * 100).toFixed(1) : 0}%
                      </div>
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
                      title="Copy link"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="View analytics"
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="Edit link"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={link.is_active} 
                        onCheckedChange={() => handleToggleStatus(link.id, link.is_active)}
                        title={link.is_active ? "Deactivate" : "Activate"}
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteLink(link.id)}
                      title="Delete link"
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