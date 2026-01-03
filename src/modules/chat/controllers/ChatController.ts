// chat/controllers/ChatController.ts
import { Response } from 'express';
import { ChatService } from '../services/ChatService';
import { AuthenticatedRequest } from '../../../shared/http/AuthenticatedRequest';
import { AppError } from '../../../shared/errors/AppError';

export class ChatController {
  constructor(private service: ChatService) {}

  /**
 * @swagger
 * /chat:
 *   post:
 *     summary: Ask AI a question
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI response
 *       402:
 *         description: Quota exceeded
 */

  ask = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }
    const result = await this.service.ask(
      req.user.id,
      req.body.question
    );
    res.json(result);
  };
}
