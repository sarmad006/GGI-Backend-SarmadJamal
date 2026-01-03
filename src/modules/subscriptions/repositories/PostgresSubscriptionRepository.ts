import { pool } from '../../../shared/database';
import { SubscriptionRepository } from './SubscriptionRepository';
import { SubscriptionBundle } from '../domain/SubscriptionBundle';
import { SubscriptionPricingService } from '../domain/SubscriptionPricingService';

export class PostgresSubscriptionRepository
  implements SubscriptionRepository {

  async findActiveByUser(userId: string): Promise<SubscriptionBundle[]> {
    console.log('Finding active subscriptions for user:', userId);
    const { rows } = await pool.query(
      `SELECT * FROM subscription_bundles
       WHERE user_id = $1 AND active = true`,
      [userId]
    );
    console.log('Found subscriptions:', rows);
    return rows.map(this.toDomain);
  }

  async findById(id: string) {
    const { rows } = await pool.query(
      `SELECT * FROM subscription_bundles WHERE id = $1`,
      [id]
    );
    return this.toDomain(rows[0]);
  }

  private map(row: any): SubscriptionBundle {
    return new SubscriptionBundle(
      row.id,
      row.user_id,
      row.tier,
      row.max_messages,
      row.used_messages,
      row.start_date,
      row.end_date,
      row.renewal_date,
      row.auto_renew,
      row.active,
      row.billing_cycle
    );
  }


  async findRenewable(date: Date) {
    const { rows } = await pool.query(
      `
    SELECT *
    FROM subscription_bundles
    WHERE active = true
      AND auto_renew = true
      AND renewal_date <= $1
    `,
      [date]
    );
    console.log('Renewable bundles:', rows);

    return rows.map(this.map);
  }

  async renew(bundle: any) {
    await pool.query(
      `
    UPDATE subscription_bundles
    SET
      start_date = $1,
      end_date = $2,
      renewal_date = $3,
      used_messages = 0
    WHERE id = $4
    `,
      [
        bundle.startDate,
        bundle.endDate,
        bundle.renewalDate,
        bundle.id,
      ]
    );
  }
  async deactivate(bundleId: string) {
    await pool.query(
      `
    UPDATE subscription_bundles
    SET active = false,
        auto_renew = false
    WHERE id = $1
    `,
      [bundleId]
    );
  }


  async incrementUsage(bundleId: string): Promise<void> {
    console.log('Incrementing usage for bundle:', bundleId);
    await pool.query(
      `
      UPDATE subscription_bundles
      SET used_messages = used_messages + 1
      WHERE id = $1
        AND active = true
      `,
      [bundleId]
    );
  }
  async save(bundle: SubscriptionBundle): Promise<void> {
    await pool.query(
      `
      INSERT INTO subscription_bundles (
        id,
        user_id,
        tier,
        max_messages,
        used_messages,
        price,
        start_date,
        end_date,
        renewal_date,
        auto_renew,
        active,
        billing_cycle
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12
      )
      ON CONFLICT (id)
      DO UPDATE SET
        tier = EXCLUDED.tier,
        max_messages = EXCLUDED.max_messages,
        used_messages = EXCLUDED.used_messages,
        price = EXCLUDED.price,
        start_date = EXCLUDED.start_date,
        end_date = EXCLUDED.end_date,
        renewal_date = EXCLUDED.renewal_date,
        auto_renew = EXCLUDED.auto_renew,
        active = EXCLUDED.active,
        billing_cycle = EXCLUDED.billing_cycle
      `,
      [
        bundle.id,
        bundle.userId,
        bundle.tier,
        bundle.maxMessages,
        bundle.usedMessages,
        SubscriptionPricingService.getPrice(
          bundle.tier,
          bundle.billingCycle
        ),
        bundle.startDate,
        bundle.endDate,
        bundle.renewalDate,
        bundle.autoRenew,
        bundle.active,
        bundle.billingCycle
      ]
    );
  }

  private toDomain(row: any): SubscriptionBundle {
    return new SubscriptionBundle(
      row.id,
      row.user_id,
      row.tier,
      row.max_messages,
      row.used_messages,
      row.auto_renew,
      row.active,
      row.renewal_date,
      row.end_date,
      row.billing_cycle,
      row.start_date
    );
  }
}
