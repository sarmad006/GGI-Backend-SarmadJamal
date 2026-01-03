import { app } from './app';

import { PostgresSubscriptionRepository } from
  './modules/subscriptions/repositories/PostgresSubscriptionRepository';

import { BillingService } from
  './modules/subscriptions/services/BillingService';
import { AppConfig } from './shared/config';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './shared/utils/swagger';

const subscriptionRepo = new PostgresSubscriptionRepository();
const billingService = new BillingService(subscriptionRepo);


setInterval(async () => {
  console.log('Running billing simulation...');
  await billingService.processRenewals();
}, 60 * 1000);




app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.listen(AppConfig.port, () => {
  console.log('Server running on port 3000');
});
