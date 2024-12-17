import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async deposit(accountId: number, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Deposit amount must be greater than zero');
    }

    return this.prisma.$transaction(async (prisma) => {
      await prisma.account.update({
        where: { id: accountId },
        data: { balance: { increment: amount } },
      });

      return prisma.transaction.create({
        data: {
          toAccountId: accountId,
          type: 'DEPOSIT',
          amount,
          status: 'SUCCESS',
        },
      });
    });
  }

  async withdraw(accountId: number, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException(
        'Withdrawal amount must be greater than zero',
      );
    }

    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account || account.balance < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    return this.prisma.$transaction(async (prisma) => {
      await prisma.account.update({
        where: { id: accountId },
        data: { balance: { decrement: amount } },
      });

      return prisma.transaction.create({
        data: {
          fromAccountId: accountId,
          type: 'WITHDRAW',
          amount,
          status: 'SUCCESS',
        },
      });
    });
  }

  async transfer(fromAccountId: number, toAccountId: number, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException(
        'Transfer amount must be greater than zero',
      );
    }

    const fromAccount = await this.prisma.account.findUnique({
      where: { id: fromAccountId },
    });
    const toAccount = await this.prisma.account.findUnique({
      where: { id: toAccountId },
    });

    if (!fromAccount || !toAccount) {
      throw new BadRequestException('Invalid accounts provided');
    }

    if (fromAccount.balance < amount) {
      throw new BadRequestException('Insufficient funds in source account');
    }

    return this.prisma.$transaction(async (prisma) => {
      await prisma.account.update({
        where: { id: fromAccountId },
        data: { balance: { decrement: amount } },
      });

      await prisma.account.update({
        where: { id: toAccountId },
        data: { balance: { increment: amount } },
      });

      return prisma.transaction.create({
        data: {
          fromAccountId,
          toAccountId,
          type: 'TRANSFER',
          amount,
          status: 'SUCCESS',
        },
      });
    });
  }

  async getTransactionHistory(accountId: number, type?: string) {
    return this.prisma.transaction.findMany({
      where: {
        OR: [{ fromAccountId: accountId }, { toAccountId: accountId }],
        ...(type && { type }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
