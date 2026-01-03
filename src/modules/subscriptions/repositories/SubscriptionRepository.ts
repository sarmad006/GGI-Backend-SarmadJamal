import { SubscriptionBundle } from '../domain/SubscriptionBundle';

export interface SubscriptionRepository {
  findActiveByUser(userId: string): Promise<SubscriptionBundle[]>;
  findById(id: string): Promise<SubscriptionBundle | null>;
  save(bundle: SubscriptionBundle): Promise<void>;
  incrementUsage(bundleId: string): Promise<void>;
  findRenewable(date: Date): Promise<any[]>;
  renew(bundle: any): Promise<void>;
  deactivate(bundleId: string): Promise<void>;
}
