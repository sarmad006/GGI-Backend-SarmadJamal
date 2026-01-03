import { ChatMessage } from '../domain/ChatMessage';

export interface ChatRepository {
  save(message: ChatMessage): Promise<void>;
}
