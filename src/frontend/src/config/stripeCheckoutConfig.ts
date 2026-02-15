/**
 * Single source of truth for Stripe checkout configuration.
 * Stores checkout URL and optional return URLs in localStorage.
 */

export interface StripeCheckoutConfig {
  checkoutUrl: string;
  successUrl?: string;
  cancelUrl?: string;
}

const STORAGE_KEY = 'stripe_checkout_config';

/**
 * Get the current Stripe checkout configuration from localStorage
 */
export function getStripeCheckoutConfig(): StripeCheckoutConfig | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as StripeCheckoutConfig;
  } catch (error) {
    console.error('Failed to read Stripe checkout config:', error);
    return null;
  }
}

/**
 * Save Stripe checkout configuration to localStorage
 */
export function saveStripeCheckoutConfig(config: StripeCheckoutConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save Stripe checkout config:', error);
    throw new Error('Failed to save configuration');
  }
}

/**
 * Validate that the checkout URL is present and appears valid
 */
export function validateCheckoutUrl(url: string): { valid: boolean; error?: string } {
  if (!url || url.trim() === '') {
    return { valid: false, error: 'Checkout URL is required' };
  }

  try {
    const parsed = new URL(url);
    if (!parsed.protocol.startsWith('http')) {
      return { valid: false, error: 'URL must use http or https protocol' };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Check if Stripe checkout is configured
 */
export function isStripeConfigured(): boolean {
  const config = getStripeCheckoutConfig();
  if (!config) return false;
  const validation = validateCheckoutUrl(config.checkoutUrl);
  return validation.valid;
}
