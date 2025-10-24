export class EmailRecipient {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly active: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(email: string, active: boolean = true): EmailRecipient {
    const now = new Date();
    return new EmailRecipient(
      0,
      email.trim().toLowerCase(),
      active,
      now,
      now,
    );
  }

  update(data: Partial<{ email: string; active: boolean }>): EmailRecipient {
    return new EmailRecipient(
      this.id,
      data.email ? data.email.trim().toLowerCase() : this.email,
      data.active ?? this.active,
      this.createdAt,
      new Date(),
    );
  }

  isActive(): boolean {
    return this.active;
  }

  activate(): EmailRecipient {
    return this.update({ active: true });
  }

  deactivate(): EmailRecipient {
    return this.update({ active: false });
  }

  getNormalizedEmail(): string {
    return this.email.trim().toLowerCase();
  }
}
