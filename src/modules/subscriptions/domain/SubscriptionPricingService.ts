import { Tier as SubscriptionTier } from './SubscriptionBundle';

export type BillingCycle = 'MONTHLY' | 'YEARLY';

export class SubscriptionPricingService {
  static getPrice(
    tier: SubscriptionTier,
    billingCycle: BillingCycle
  ): number {
    const pricingTable = {
      BASIC: {
        MONTHLY: 10,
        YEARLY: 100,
      },
      PRO: {
        MONTHLY: 30,
        YEARLY: 300,
      },
      ENTERPRISE: {
        MONTHLY: 100,
        YEARLY: 1000,
      },
    };

    return pricingTable[tier][billingCycle];
  }

  static getMaxMessages(tier: SubscriptionTier): number | null {
    switch (tier) {
      case 'BASIC':
        return 10;
      case 'PRO':
        return 100;
      case 'ENTERPRISE':
        return null; // unlimited
    }
  }
}
