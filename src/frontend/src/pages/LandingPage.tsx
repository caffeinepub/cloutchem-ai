import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Zap, TrendingUp, Shield, Check } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function LandingPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/generated/cloutchem-hero-bg.dim_1920x1080.png"
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 py-24 md:py-32 lg:py-40">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-accent-foreground" />
              <span className="text-sm font-medium text-accent-foreground">AI-Powered Creator Growth</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                Elevate Your Social Presence with
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                CloutChem AI
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform your content strategy with intelligent AI tools designed for modern creators who demand excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-background font-semibold shadow-lg shadow-amber-500/20">
                    Go to Dashboard
                    <TrendingUp className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-background font-semibold shadow-lg shadow-amber-500/20">
                    Get Started Free
                    <Sparkles className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <Separator className="opacity-20" />

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-background to-accent/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to grow your audience and maximize engagement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </div>
                <CardTitle className="text-2xl">AI Caption Generator</CardTitle>
                <CardDescription className="text-base">
                  Create engaging, on-brand captions that resonate with your audience in seconds
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-amber-400" />
                </div>
                <CardTitle className="text-2xl">Smart DM Assistant</CardTitle>
                <CardDescription className="text-base">
                  Craft personalized messages that build authentic connections with your community
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-amber-400" />
                </div>
                <CardTitle className="text-2xl">Content Strategy</CardTitle>
                <CardDescription className="text-base">
                  Get data-driven content ideas tailored to your niche and audience preferences
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-amber-400" />
                </div>
                <CardTitle className="text-2xl">Profile Optimization</CardTitle>
                <CardDescription className="text-base">
                  Optimize your bio, highlights, and profile for maximum discoverability
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-amber-400" />
                </div>
                <CardTitle className="text-2xl">Growth Analytics</CardTitle>
                <CardDescription className="text-base">
                  Track your progress with detailed insights and actionable growth strategies
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </div>
                <CardTitle className="text-2xl">Trend Insights</CardTitle>
                <CardDescription className="text-base">
                  Stay ahead with AI-powered trend analysis and content recommendations
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="opacity-20" />

      {/* Pricing Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Simple, Transparent Pricing
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your growth journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-card/50 backdrop-blur-sm border-accent/20 hover:border-accent/30 transition-all duration-300">
              <CardHeader className="space-y-4">
                <CardTitle className="text-2xl">Free</CardTitle>
                <div className="space-y-2">
                  <div className="text-4xl font-bold">
                    <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">$0</span>
                  </div>
                  <p className="text-muted-foreground">forever</p>
                </div>
                <CardDescription className="text-base">Perfect for creators just starting out</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">10 AI-generated captions/month</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Basic caption templates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Community support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Access to core features</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-6 border-accent/30 hover:bg-accent/10">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-gradient-to-b from-accent/10 to-accent/5 backdrop-blur-sm border-amber-500/40 hover:border-amber-500/60 transition-all duration-300 shadow-lg shadow-amber-500/10 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-background text-sm font-semibold rounded-full">
                Most Popular
              </div>
              <CardHeader className="space-y-4 pt-8">
                <CardTitle className="text-2xl">Pro</CardTitle>
                <div className="space-y-2">
                  <div className="text-4xl font-bold">
                    <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">$29</span>
                  </div>
                  <p className="text-muted-foreground">per month</p>
                </div>
                <CardDescription className="text-base">For serious creators scaling their brand</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Unlimited AI captions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Advanced customization</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Priority support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Analytics & insights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Early access to new features</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Custom branding options</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-background font-semibold">
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="opacity-20" />

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-accent/5 to-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Ready to Transform Your Content?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of creators who are already using CloutChem AI to elevate their social media presence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-background font-semibold shadow-lg shadow-amber-500/20">
                    Go to Dashboard
                    <TrendingUp className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-background font-semibold shadow-lg shadow-amber-500/20">
                    Start Free Today
                    <Sparkles className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
