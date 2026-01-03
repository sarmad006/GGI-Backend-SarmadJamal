import { SubscriptionBundle, Tier } from '../domain/SubscriptionBundle';
import { v4 as uuid } from 'uuid';

const TIER_CONFIG = {
  BASIC: { max: 10, price: 10 },
  PRO: { max: 100, price: 30 },
  ENTERPRISE: { max: Infinity, price: 100 },
};

export class SubscriptionService {
  async create(
    userId: string,
    tier: Tier,
    billingCycle: 'MONTHLY' | 'YEARLY',
    autoRenew: boolean
  ) {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + (billingCycle === 'MONTHLY' ? 1 : 12));

    return new SubscriptionBundle(
      uuid(),
      userId,
      tier,
      TIER_CONFIG[tier].max,
      0,
      autoRenew,
      true,
      endDate,
      endDate,
      billingCycle,
      now
    );
  }

  simulateRenewal(bundle: SubscriptionBundle) {
    if (!bundle.autoRenew) return;

    if (Math.random() < 0.2) {
      bundle.active = false;
      return;
    }

    bundle.usedMessages = 0;
    bundle.endDate.setMonth(bundle.endDate.getMonth() + 1);
  }
}
