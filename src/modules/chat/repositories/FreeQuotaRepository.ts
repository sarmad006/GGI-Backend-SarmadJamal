import { pool } from '../../../shared/database';
import { FreeQuota } from '../domain/FreeQuota';

export class PostgresFreeQuotaRepository {
  async find(
    userId: string,
    month: number,
    year: number
  ): Promise<FreeQuota | null> {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM free_quotas
      WHERE user_id = $1
        AND month = $2
        AND year = $3
      `,
      [userId, month, year]
    );

    if (!rows.length) return null;

    return new FreeQuota(
      rows[0].user_id,
      rows[0].month,
      rows[0].year,
      rows[0].used_messages
    );
  }

  async create(userId: string, month: number, year: number): Promise<void> {
    await pool.query(
      `
      INSERT INTO free_quotas (user_id, used_messages, month, year)
      VALUES ($1, 1, $2, $3)
      `,
      [userId, month, year]
    );
  }

  async increment(userId: string, month: number, year: number): Promise<void> {
    await pool.query(
      `
      UPDATE free_quotas
      SET used_messages = used_messages + 1
      WHERE user_id = $1
        AND month = $2
        AND year = $3
      `,
      [userId, month, year]
    );
  }
}
