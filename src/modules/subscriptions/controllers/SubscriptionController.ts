import { Request, Response } from 'express';
import { SubscriptionService } from '../services/SubscriptionService';
import { SubscriptionRepository } from '../repositories/SubscriptionRepository';
import { AuthenticatedRequest } from '../../../shared/http/AuthenticatedRequest';
import { AppError } from '../../../shared/errors/AppError';

export class SubscriptionController {
  constructor(
    private service: SubscriptionService,
    private repository: SubscriptionRepository
  ) {}


    /**
   * @swagger
   * /subscriptions:
   *   post:
   *     summary: Create a subscription bundle for a user
   *     tags: [Subscriptions]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - tier
   *               - billingCycle
   *               - autoRenew
   *             properties:
   *               tier:
   *                 type: string
   *                 enum: [BASIC, PRO, ENTERPRISE]
   *               billingCycle:
   *                 type: string
   *                 enum: [MONTHLY, YEARLY]
   *               autoRenew:
   *                 type: boolean
   *     responses:
   *       201:
   *         description: Subscription bundle created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 tier:
   *                   type: string
   *                 billingCycle:
   *                   type: string
   *                 autoRenew:
   *                   type: boolean
   *                 startDate:
   *                   type: string
   *                   format: date
   *                 endDate:
   *                   type: string
   *                   format: date
   *                 price:
   *                   type: number
   *       401:
   *         description: Unauthorized
   */
  create = async (req: AuthenticatedRequest, res: Response) => {
    const { tier, billingCycle, autoRenew } = req.body;
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }
    const userId = req.user.id;

    const bundle = await this.service.create(
      userId,
      tier,
      billingCycle,
      autoRenew
    );

    await this.repository.save(bundle);

    res.status(201).json(bundle);
  };

  /**
   * @swagger
   * /subscriptions/{id}/cancel:
   *   post:
   *     summary: Cancel a subscription bundle
   *     tags: [Subscriptions]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Subscription bundle ID
   *     responses:
   *       200:
   *         description: Subscription cancelled successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Subscription cancelled
   *       404:
   *         description: Subscription not found
   */

  cancel = async (req: Request, res: Response) => {
    const bundle = await this.repository.findById(req.params.id);
    if (!bundle) {
      throw new AppError('Subscription not found', 404);
    }
    bundle.active = false;
    bundle.autoRenew = false;

    await this.repository.save(bundle);

    res.json({ message: 'Subscription cancelled' });
  };
}
