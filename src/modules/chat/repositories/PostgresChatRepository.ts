import { pool } from '../../../shared/database';
import { ChatMessage } from '../domain/ChatMessage';
import { ChatRepository } from './ChatRepository';

export class PostgresChatRepository implements ChatRepository {
  async save(message: ChatMessage): Promise<void> {
    await pool.query(
      `
      INSERT INTO chat_messages (id, user_id, question, answer, tokens, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        message.id,
        message.userId,
        message.question,
        message.answer,
        message.tokens,
        message.createdAt,
      ]
    );
  }

  async findByUser(userId: string): Promise<ChatMessage[]> {
    const { rows } = await pool.query(
      `SELECT * FROM chat_messages WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    return rows.map(
      (row: any) =>
        new ChatMessage(
          row.id,
          row.user_id,
          row.question,
          row.answer,
          row.tokens,
          row.created_at
        )
    );
  }
}
