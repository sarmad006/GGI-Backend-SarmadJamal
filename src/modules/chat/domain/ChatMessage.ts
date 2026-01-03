export class ChatMessage {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly question: string,
    public readonly answer: string,
    public readonly tokens: number,
    public readonly createdAt: Date
  ) {}
}
