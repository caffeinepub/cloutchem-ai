import { SubscriptionTier } from '../backend';

/**
 * Converts backend SubscriptionTier enum to user-facing label
 */
export function getTierLabel(tier: SubscriptionTier | undefined | null): string {
  if (!tier) return 'Free';
  
  switch (tier) {
    case SubscriptionTier.free:
      return 'Free';
    case SubscriptionTier.pro:
      return 'Pro';
    default:
      return 'Free';
  }
}

/**
 * Gets a fallback tier label when profile data is missing
 */
export function getFallbackTierLabel(): string {
  return 'Free';
}

/**
 * Check if user is on Free tier
 */
export function isFree(tier: SubscriptionTier | undefined | null): boolean {
  return !tier || tier === SubscriptionTier.free;
}

/**
 * Check if user is on Pro tier
 */
export function isPro(tier: SubscriptionTier | undefined | null): boolean {
  return tier === SubscriptionTier.pro;
}
