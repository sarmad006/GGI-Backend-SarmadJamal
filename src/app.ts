import express from 'express';
import { routes } from './routes';
import { errorMiddleware } from './shared/http/ErrorMiddleware';

export const app = express();

app.use(express.json());

// Fake auth middleware
app.use((req: any, _res, next) => {
  req.user = { id: '11111111-1111-1111-1111-111111111111' };
  next();
});

app.use(routes);
app.use(errorMiddleware);
