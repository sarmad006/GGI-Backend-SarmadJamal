export type Tier = 'BASIC' | 'PRO' | 'ENTERPRISE';

export class SubscriptionBundle {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public tier: Tier,
    public maxMessages: number,
    public usedMessages: number,
    public autoRenew: boolean,
    public active: boolean,
    public renewalDate: Date,
    public endDate: Date,
    public billingCycle: 'MONTHLY' | 'YEARLY',
    public startDate: Date
  ) {}

  isUnlimited(): boolean {
    return this.maxMessages === null;
  }

  remainingMessages(): number {
    if (this.isUnlimited()) {
      return Number.MAX_SAFE_INTEGER;
    }
    return this.maxMessages - this.usedMessages;
  }

  canConsume(): boolean {
    return this.isUnlimited() || this.remainingMessages() > 0;
  }

  consume(): void {
    if (!this.canConsume()) {
      throw new Error('Subscription quota exceeded');
    }
    this.usedMessages += 1;
  }
}
