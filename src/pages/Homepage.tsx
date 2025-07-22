import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Link2, 
  TrendingUp, 
  BarChart3, 
  Target, 
  Globe, 
  Zap,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const Homepage = () => {
  const features = [
    {
      icon: Link2,
      title: "Smart Link Management",
      description: "Create, organize, and optimize your affiliate links with intelligent categorization and bulk operations."
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track clicks, conversions, and revenue in real-time with detailed geographic and device insights."
    },
    {
      icon: Target,
      title: "A/B Testing",
      description: "Split test your links to maximize conversion rates and identify the highest-performing variations."
    },
    {
      icon: TrendingUp,
      title: "Revenue Tracking",
      description: "Monitor earnings from Amazon, Flipkart, ClickBank, and other platforms in one unified dashboard."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Serve geo-targeted content and track performance across different regions and markets."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized redirect speeds ensure maximum user experience and conversion rates."
    }
  ];

  const benefits = [
    "Increase conversion rates by up to 40%",
    "Save 10+ hours per week on link management",
    "Track revenue from all affiliate platforms",
    "Advanced fraud detection and protection",
    "White-label and custom domain support",
    "24/7 customer support and onboarding"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-elegant overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto text-white space-y-8">
            <h1 className="text-6xl lg:text-7xl font-bold tracking-tight">
              The Ultimate
              <span className="block bg-gradient-to-r from-accent via-primary-glow to-white bg-clip-text text-transparent">
                Affiliate Marketing
              </span>
              Platform
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Maximize your affiliate revenue with smart link management, real-time analytics, 
              A/B testing, and comprehensive tracking across all major affiliate platforms.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg group"
                asChild
              >
                <Link to="/auth">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                Watch Demo
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-white/70">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">10M+</div>
                <div className="text-white/70">Links Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-white/70">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">$2M+</div>
                <div className="text-white/70">Revenue Tracked</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed specifically for affiliate marketers who want to maximize their earnings
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 bg-gradient-subtle shadow-elegant hover:shadow-glow transition-all duration-300 group">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Why Choose AffiliateHub?
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Join thousands of successful affiliate marketers who have transformed their 
                business with our comprehensive platform.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 text-white font-semibold px-8 py-6 text-lg group"
                asChild
              >
                <Link to="/auth">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            
            <div className="relative">
              <div className="relative bg-card rounded-2xl p-8 shadow-elegant">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">Revenue Dashboard</h3>
                    <div className="text-3xl font-bold text-primary">$24,567</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-subtle rounded-lg">
                      <div className="text-2xl font-bold text-primary">1,234</div>
                      <div className="text-sm text-muted-foreground">Total Clicks</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-subtle rounded-lg">
                      <div className="text-2xl font-bold text-accent">89</div>
                      <div className="text-sm text-muted-foreground">Conversions</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Amazon Associates</span>
                      <span className="font-semibold">$12,345</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Flipkart Affiliate</span>
                      <span className="font-semibold">$8,901</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>ClickBank</span>
                      <span className="font-semibold">$3,321</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-elegant text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to 10x Your Affiliate Revenue?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Join thousands of successful marketers who have already transformed their business. 
            Start your free trial today - no credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg group"
              asChild
            >
              <Link to="/auth">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;