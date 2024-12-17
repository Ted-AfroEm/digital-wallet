import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { userId: number; initialBalance: number }) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return this.prisma.account.create({
      data: {
        userId: data.userId,
        balance: data.initialBalance,
      },
    });
  }

  async findAll() {
    return this.prisma.account.findMany({
      include: {
        // Include user details in the response if needed
        user: true,
      },
    });
  }

  async findOne(id: number) {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        transactionsFrom: true,
        transactionsTo: true,
      },
    });

    if (!account) {
      throw new BadRequestException(`Account with ID ${id} not found`);
    }

    return account;
  }
}
