import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Rocket, Crown, AlertCircle, Sparkles } from 'lucide-react';
import { SubscriptionTier } from '../../backend';
import { getStripeCheckoutConfig, isStripeConfigured } from '../../config/stripeCheckoutConfig';

interface UpgradeToProCardProps {
  tier: SubscriptionTier | undefined | null;
}

export default function UpgradeToProCard({ tier }: UpgradeToProCardProps) {
  const isFree = !tier || tier === SubscriptionTier.free;
  const isPro = tier === SubscriptionTier.pro;
  const stripeConfigured = isStripeConfigured();

  const handleUpgrade = () => {
    if (!stripeConfigured) {
      return;
    }

    const config = getStripeCheckoutConfig();
    if (!config?.checkoutUrl) {
      console.error('Stripe checkout URL not configured');
      return;
    }

    // Redirect to Stripe checkout in the same tab
    window.location.href = config.checkoutUrl;
  };

  if (isPro) {
    return (
      <Card className="bg-gradient-to-br from-amber-500/10 to-yellow-600/10 backdrop-blur-sm border-amber-500/30">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/30 to-yellow-600/30 flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <CardTitle className="text-xl">Pro Member</CardTitle>
          </div>
          <CardDescription>You're on the Pro plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-sm text-foreground">
              You have access to all Pro features and unlimited AI caption generation.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isFree) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-blue-400" />
            </div>
            <CardTitle className="text-xl">Upgrade to Pro</CardTitle>
          </div>
          <CardDescription>Unlock unlimited AI-powered features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Unlimited AI caption generation
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Advanced customization options
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Priority support
              </p>
            </div>
          </div>

          {!stripeConfigured && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Payments are not configured. Please configure Stripe checkout below.
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleUpgrade}
            disabled={!stripeConfigured}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
}
