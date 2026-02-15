import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetCallerUserProfile, useRefreshUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Sparkles, User, Calendar, AlertCircle, Rocket, RefreshCw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import AICaptionGenerator from '../components/ai/AICaptionGenerator';
import UpgradeToProCard from '../components/billing/UpgradeToProCard';
import StripeCheckoutConfigPanel from '../components/billing/StripeCheckoutConfigPanel';
import { getTierLabel } from '../utils/subscriptionTier';

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading, error, isFetched } = useGetCallerUserProfile();
  const { refetch: refreshProfile, isFetching: isRefreshing } = useRefreshUserProfile();

  const principalId = identity?.getPrincipal().toString() || '';
  const shortPrincipal = principalId ? `${principalId.slice(0, 8)}...${principalId.slice(-6)}` : '';

  const handleRefreshStatus = async () => {
    await refreshProfile();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="space-y-8">
          <Skeleton className="h-12 w-64" />
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load your profile. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const createdDate = userProfile?.createdAt
    ? new Date(Number(userProfile.createdAt) / 1000000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

  const tierLabel = getTierLabel(userProfile?.tier);

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Welcome to CloutChem AI
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground mt-1">
                  Your AI-powered creator dashboard
                </p>
              </div>
            </div>
            <Button
              onClick={handleRefreshStatus}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Status
            </Button>
          </div>
        </div>

        <Separator className="opacity-20" />

        {/* Account Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-amber-400" />
                </div>
                <CardTitle className="text-xl">Account Details</CardTitle>
              </div>
              <CardDescription>Your secure identity information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Principal ID</p>
                <p className="text-sm font-mono bg-accent/10 px-3 py-2 rounded-lg border border-accent/20 break-all">
                  {shortPrincipal}
                </p>
              </div>
              {userProfile && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Member since</span>
                  </div>
                  <p className="text-sm font-medium">{createdDate}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 backdrop-blur-sm border-amber-500/30">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/30 to-yellow-600/30 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-amber-400" />
                </div>
                <CardTitle className="text-xl">Quick Stats</CardTitle>
              </div>
              <CardDescription>Your account overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="text-lg font-semibold text-amber-400">{tierLabel}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-semibold text-green-400">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade to Pro Card */}
        <UpgradeToProCard tier={userProfile?.tier} />

        {/* Stripe Configuration Panel */}
        <StripeCheckoutConfigPanel />

        {/* AI Caption Generator */}
        <AICaptionGenerator />
      </div>
    </div>
  );
}
