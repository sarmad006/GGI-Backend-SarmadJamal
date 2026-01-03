export class FreeQuota {
  constructor(
    public readonly userId: string,
    public readonly month: number,
    public readonly year: number,
    public usedMessages: number
  ) {}

  canConsume(limit: number): boolean {
    return this.usedMessages < limit;
  }

  consume(): void {
    this.usedMessages += 1;
  }
}
