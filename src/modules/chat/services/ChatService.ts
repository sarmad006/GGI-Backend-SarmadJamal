import { v4 as uuid } from 'uuid';
import { ChatRepository } from '../repositories/ChatRepository';
import { SubscriptionRepository } from '../../subscriptions/repositories/SubscriptionRepository';
import { QuotaExceededError } from '../../../shared/errors/QuotaExceededError';
import { mockOpenAI } from '../../../shared/utils/mockOpenAI';
import { PostgresFreeQuotaRepository } from '../repositories/FreeQuotaRepository';
import { BillingConfig } from '../../../shared/config';




export class ChatService {
    constructor(
        private chatRepo: ChatRepository,
        private subscriptionRepo: SubscriptionRepository,
        private readonly freeQuotaRepo: PostgresFreeQuotaRepository
    ) { }

    async ask(userId: string, question: string) {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const freeQuota = await this.freeQuotaRepo.find(userId, month, year);

        if (!freeQuota) {
            await this.freeQuotaRepo.create(userId, month, year);
            const aiResponse = await mockOpenAI(question);

            await this.saveChatMessage(userId, question, aiResponse);

            return aiResponse;
        }

        if (freeQuota.canConsume(BillingConfig.FREE_MESSAGES_PER_MONTH)) {
            await this.freeQuotaRepo.increment(userId, month, year);
            const aiResponse = await mockOpenAI(question);

            await this.saveChatMessage(userId, question, aiResponse);
            return aiResponse;
        }
        return this.consumeSubscription(userId, question);


    }
    private async consumeSubscription(userId: string, question: string) {
        const bundles = await this.subscriptionRepo.findActiveByUser(userId);

        const usable = bundles
            .filter(b => b.active)
            .sort((a, b) => b.remainingMessages() - a.remainingMessages());

        if (!usable.length || !usable[0].canConsume()) {
            throw new QuotaExceededError();
        }

        const bundle = usable[0];

        bundle.consume();
        await this.subscriptionRepo.incrementUsage(bundle.id);
        const aiResponse = await mockOpenAI(question);
        await this.saveChatMessage(userId, question, aiResponse);
        return aiResponse;
    }


    private async saveChatMessage(
        userId: string,
        question: string,
        aiResponse: { text: string; tokens: number }
    ) {
        await this.chatRepo.save({
            id: uuid(),
            userId,
            question,
            answer: aiResponse.text,
            tokens: aiResponse.tokens,
            createdAt: new Date(),
        });
    }

}
