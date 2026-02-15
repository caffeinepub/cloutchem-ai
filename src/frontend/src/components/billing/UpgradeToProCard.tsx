import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Rocket, Crown, AlertCircle, Sparkles } from 'lucide-react';
import { SubscriptionTier } from '../../backend';
import { getStripeCheckoutConfig, isStripeConfigured } from '../../config/stripeCheckoutConfig';
import StripeBuyButton from './StripeBuyButton';
import { useStripeBuyButtonScript } from '../../hooks/useStripeBuyButtonScript';

interface UpgradeToProCardProps {
  tier: SubscriptionTier | undefined | null;
}

export default function UpgradeToProCard({ tier }: UpgradeToProCardProps) {
  const isFree = !tier || tier === SubscriptionTier.free;
  const isPro = tier === SubscriptionTier.pro;
  const stripeConfigured = isStripeConfigured();
  const { isLoaded: stripeBuyButtonReady } = useStripeBuyButtonScript();

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
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-amber-400" />
            </div>
            <CardTitle className="text-xl">Upgrade to Pro</CardTitle>
          </div>
          <CardDescription>Unlock unlimited AI captions and premium features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Unlimited AI-generated captions
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Advanced customization options
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Priority support
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Early access to new features
            </li>
          </ul>

          {stripeBuyButtonReady ? (
            <StripeBuyButton className="w-full" />
          ) : stripeConfigured ? (
            <Button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-background font-semibold"
            >
              Upgrade to Pro
            </Button>
          ) : (
            <Alert className="bg-muted/50 border-muted">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Payment configuration required. Please configure Stripe checkout below.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}
