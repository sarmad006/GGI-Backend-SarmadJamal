import { AppError } from './AppError';
export class QuotaExceededError extends AppError {
  constructor() {
    super('Quota exceeded', 402, 'QUOTA_EXCEEDED');
  }
}