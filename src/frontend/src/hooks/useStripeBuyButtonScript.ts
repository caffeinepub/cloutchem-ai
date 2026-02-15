import { useEffect, useState } from 'react';

const STRIPE_BUY_BUTTON_SCRIPT_URL = 'https://js.stripe.com/v3/buy-button.js';
const SCRIPT_ID = 'stripe-buy-button-script';

// Module-level singleton to track script loading state
let scriptLoadingPromise: Promise<void> | null = null;

/**
 * Load the Stripe Buy Button script exactly once across the entire app lifecycle.
 * Uses a module-level singleton promise to prevent duplicate script injections.
 */
function loadStripeBuyButtonScript(): Promise<void> {
  // Return existing promise if script is already loading or loaded
  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  // Check if script already exists in DOM
  if (document.getElementById(SCRIPT_ID)) {
    scriptLoadingPromise = Promise.resolve();
    return scriptLoadingPromise;
  }

  // Create new loading promise
  scriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = STRIPE_BUY_BUTTON_SCRIPT_URL;
    script.async = true;

    script.onload = () => {
      resolve();
    };

    script.onerror = () => {
      scriptLoadingPromise = null; // Reset on error to allow retry
      reject(new Error('Failed to load Stripe Buy Button script'));
    };

    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

/**
 * Hook to load the Stripe Buy Button script and track its loading status.
 * Safe to call multiple times - script is only loaded once.
 */
export function useStripeBuyButtonScript() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadStripeBuyButtonScript()
      .then(() => {
        setIsLoaded(true);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  return { isLoading, isLoaded, error };
}
