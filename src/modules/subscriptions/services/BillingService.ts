import { BillingConfig } from '../../../shared/config';
import { SubscriptionRepository } from '../repositories/SubscriptionRepository';

export class BillingService {
  constructor(private readonly subscriptionRepo: SubscriptionRepository) {}

  async processRenewals(): Promise<void> {
    const today = new Date();

    const renewable = await this.subscriptionRepo.findRenewable(today);

    for (const bundle of renewable) {
      // simulate payment
      const paymentSucceeded = this.simulatePayment();
      console.log(`Processing bundle ${bundle.id}: payment ${
        paymentSucceeded ? 'succeeded' : 'failed'
      }`);

      if (!paymentSucceeded) {
        bundle.active = false;
        bundle.autoRenew = false;

        await this.subscriptionRepo.deactivate(bundle.id);
        continue;
      }

      bundle.startDate = bundle.end_date;
      bundle.endDate = this.calculateNextEndDate(bundle);
      bundle.renewalDate = bundle.endDate;
      bundle.usedMessages = 0;
      console.log(`Renewed bundle ${bundle.id}: new end date ${bundle.endDate}`);

      await this.subscriptionRepo.renew(bundle);
    }
  }

  private simulatePayment(): boolean {
    return Math.random() < BillingConfig.PAYMENT_SUCCESS_RATE;
  }

  private calculateNextEndDate(bundle: any): Date {
    // console.log('Calculating next end date for bundle:', bundle);
    const next = new Date(bundle.end_date);
    // console.log('Calculating next end date from:', next);

    if (bundle.billingCycle === 'MONTHLY') {
      next.setMonth(next.getMonth() + 1);
    } else {
      next.setFullYear(next.getFullYear() + 1);
    }

    return next;
  }
}
