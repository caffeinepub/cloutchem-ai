import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, CheckCircle, AlertCircle } from 'lucide-react';
import {
  getStripeCheckoutConfig,
  saveStripeCheckoutConfig,
  validateCheckoutUrl,
  type StripeCheckoutConfig,
} from '../../config/stripeCheckoutConfig';

export default function StripeCheckoutConfigPanel() {
  const [config, setConfig] = useState<StripeCheckoutConfig>(() => {
    const stored = getStripeCheckoutConfig();
    return stored || { checkoutUrl: '', successUrl: '', cancelUrl: '' };
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSave = () => {
    // Validate checkout URL
    const validation = validateCheckoutUrl(config.checkoutUrl);
    if (!validation.valid) {
      setSaveStatus('error');
      setErrorMessage(validation.error || 'Invalid checkout URL');
      return;
    }

    try {
      saveStripeCheckoutConfig(config);
      setSaveStatus('success');
      setErrorMessage('');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setErrorMessage('Failed to save configuration');
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
            <Settings className="w-5 h-5 text-blue-400" />
          </div>
          <CardTitle className="text-xl">Stripe Checkout Configuration</CardTitle>
        </div>
        <CardDescription>
          Configure your Stripe-hosted checkout URL as a fallback payment method when the embedded buy button is unavailable
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="checkoutUrl">
            Checkout URL <span className="text-destructive">*</span>
          </Label>
          <Input
            id="checkoutUrl"
            type="url"
            placeholder="https://checkout.stripe.com/c/pay/..."
            value={config.checkoutUrl}
            onChange={(e) => setConfig({ ...config, checkoutUrl: e.target.value })}
            className="bg-background/50"
          />
          <p className="text-xs text-muted-foreground">
            Your Stripe-hosted checkout page URL (required)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="successUrl">Success Return URL (Optional)</Label>
          <Input
            id="successUrl"
            type="url"
            placeholder="https://yourapp.com/payment-success"
            value={config.successUrl || ''}
            onChange={(e) => setConfig({ ...config, successUrl: e.target.value })}
            className="bg-background/50"
          />
          <p className="text-xs text-muted-foreground">
            Where to redirect after successful payment
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cancelUrl">Cancel Return URL (Optional)</Label>
          <Input
            id="cancelUrl"
            type="url"
            placeholder="https://yourapp.com/payment-cancel"
            value={config.cancelUrl || ''}
            onChange={(e) => setConfig({ ...config, cancelUrl: e.target.value })}
            className="bg-background/50"
          />
          <p className="text-xs text-muted-foreground">
            Where to redirect if payment is canceled
          </p>
        </div>

        {saveStatus === 'success' && (
          <Alert className="bg-green-500/10 border-green-500/30">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-500">
              Configuration saved successfully!
            </AlertDescription>
          </Alert>
        )}

        {saveStatus === 'error' && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Button onClick={handleSave} className="w-full">
          Save Configuration
        </Button>
      </CardContent>
    </Card>
  );
}
