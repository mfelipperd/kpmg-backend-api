import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma.service";
import { EmailRecipient } from "../../../domain/entities/email-recipient.entity";
import { EmailRecipientRepository } from "../../../domain/repositories/email-recipient.repository";

@Injectable()
export class PrismaEmailRecipientRepository
  implements EmailRecipientRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(emailRecipient: EmailRecipient): Promise<EmailRecipient> {
    const created = await this.prisma.emailRecipient.create({
      data: {
        email: emailRecipient.email,
        active: emailRecipient.active,
      },
    });

    return new EmailRecipient(
      created.id,
      created.email,
      created.active,
      created.createdAt,
      created.updatedAt,
    );
  }

  async findAll(): Promise<EmailRecipient[]> {
    const recipients = await this.prisma.emailRecipient.findMany({
      orderBy: { id: "asc" },
    });

    return recipients.map(
      (recipient) =>
        new EmailRecipient(
          recipient.id,
          recipient.email,
          recipient.active,
          recipient.createdAt,
          recipient.updatedAt,
        ),
    );
  }

  async findById(id: number): Promise<EmailRecipient | null> {
    const recipient = await this.prisma.emailRecipient.findUnique({
      where: { id },
    });

    if (!recipient) {
      return null;
    }

    return new EmailRecipient(
      recipient.id,
      recipient.email,
      recipient.active,
      recipient.createdAt,
      recipient.updatedAt,
    );
  }

  async findByEmail(email: string): Promise<EmailRecipient | null> {
    const recipient = await this.prisma.emailRecipient.findUnique({
      where: { email },
    });

    if (!recipient) {
      return null;
    }

    return new EmailRecipient(
      recipient.id,
      recipient.email,
      recipient.active,
      recipient.createdAt,
      recipient.updatedAt,
    );
  }

  async findActiveRecipients(): Promise<EmailRecipient[]> {
    const recipients = await this.prisma.emailRecipient.findMany({
      where: { active: true },
      orderBy: { id: "asc" },
    });

    return recipients.map(
      (recipient) =>
        new EmailRecipient(
          recipient.id,
          recipient.email,
          recipient.active,
          recipient.createdAt,
          recipient.updatedAt,
        ),
    );
  }

  async update(
    id: number,
    emailRecipient: EmailRecipient,
  ): Promise<EmailRecipient> {
    const updated = await this.prisma.emailRecipient.update({
      where: { id },
      data: {
        email: emailRecipient.email,
        active: emailRecipient.active,
      },
    });

    return new EmailRecipient(
      updated.id,
      updated.email,
      updated.active,
      updated.createdAt,
      updated.updatedAt,
    );
  }

  async delete(id: number): Promise<void> {
    await this.prisma.emailRecipient.delete({
      where: { id },
    });
  }
}
