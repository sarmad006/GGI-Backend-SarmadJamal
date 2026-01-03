import { Router } from 'express';
import { ChatController } from './modules/chat/controllers/ChatController';
import { ChatService } from './modules/chat/services/ChatService';
import { PostgresChatRepository } from './modules/chat/repositories/PostgresChatRepository';
import { PostgresSubscriptionRepository } from './modules/subscriptions/repositories/PostgresSubscriptionRepository';
import { SubscriptionController } from './modules/subscriptions/controllers/SubscriptionController';
import { SubscriptionService } from './modules/subscriptions/services/SubscriptionService';
import { PostgresFreeQuotaRepository } from './modules/chat/repositories/FreeQuotaRepository';

export const routes = Router();

// Instantiate repositories
const chatRepo = new PostgresChatRepository();
const subscriptionRepo = new PostgresSubscriptionRepository();
const freeQuotaRepo = new PostgresFreeQuotaRepository();

// Instantiate services
const chatService = new ChatService(chatRepo, subscriptionRepo, freeQuotaRepo);
const subscriptionService = new SubscriptionService();

// Instantiate controllers
const chatController = new ChatController(chatService);
const subscriptionController = new SubscriptionController(subscriptionService, subscriptionRepo);

// Chat
routes.post('/chat', (req, res, next) => chatController.ask(req, res).catch(next) );

// Subscriptions
routes.post('/subscriptions', subscriptionController.create);
routes.post('/subscriptions/:id/cancel', subscriptionController.cancel);
