import { useStripeBuyButtonScript } from '../../hooks/useStripeBuyButtonScript';
import { Loader2 } from 'lucide-react';

interface StripeBuyButtonProps {
  className?: string;
}

const BUY_BUTTON_ID = 'buy_btn_1T1CocB4KBG51gmzJFaiAsoy';
const PUBLISHABLE_KEY = 'pk_live_51T1CE5B4KBG51gmzluG8wT3ezxfzoERDITdNTErbhNi3ow2GQr6ZtBBCyf9XzwkYuEtUQzlwQnNapgITwpzL2SIO00shjXGEIN';

/**
 * Reusable Stripe Buy Button component that renders the embedded Stripe checkout.
 * Waits for the Stripe Buy Button script to load before rendering the custom element.
 */
export default function StripeBuyButton({ className }: StripeBuyButtonProps) {
  const { isLoading, isLoaded, error } = useStripeBuyButtonScript();

  if (error) {
    return (
      <div className={className}>
        <p className="text-sm text-destructive">Failed to load payment button</p>
      </div>
    );
  }

  if (isLoading || !isLoaded) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center gap-2 py-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading payment...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* @ts-ignore - Stripe Buy Button custom element */}
      <stripe-buy-button
        buy-button-id={BUY_BUTTON_ID}
        publishable-key={PUBLISHABLE_KEY}
      />
    </div>
  );
}
