import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../common/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: PrismaService,
          useValue: {
            account: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            transaction: {
              create: jest.fn(),
            },
            $transaction: jest.fn((callback) => callback(prisma)),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('TransactionsService - deposit', () => {
    it('should successfully deposit money into an account', async () => {
      // Mock account lookup
      jest.spyOn(prisma.account, 'findUnique').mockResolvedValueOnce({
        id: 1,
        userId: 1,
        balance: 1000,
      });

      // Mock account update
      jest.spyOn(prisma.account, 'update').mockResolvedValueOnce({
        id: 1,
        userId: 1,
        balance: 1500,
      });

      // Mock transaction creation
      jest.spyOn(prisma.transaction, 'create').mockResolvedValueOnce({
        id: 1,
        fromAccountId: null,
        toAccountId: 1,
        type: 'DEPOSIT',
        amount: 500,
        status: 'SUCCESS',
        createdAt: new Date(),
      });

      const result = await service.deposit(1, 1, 500);

      expect(result).toEqual({
        id: 1,
        fromAccountId: null,
        toAccountId: 1,
        type: 'DEPOSIT',
        amount: 500,
        status: 'SUCCESS',
        createdAt: expect.any(Date),
      });
      expect(prisma.account.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { balance: { increment: 500 } },
      });
      expect(prisma.transaction.create).toHaveBeenCalledWith({
        data: {
          fromAccountId: null,
          toAccountId: 1,
          type: 'DEPOSIT',
          amount: 500,
          status: 'SUCCESS',
        },
      });
    });

    it('should throw an error if deposit amount is less than or equal to zero', async () => {
      await expect(service.deposit(1, 1, 0)).rejects.toThrow(
        new BadRequestException('Deposit amount must be greater than zero'),
      );
    });

    it('should throw an error if account does not belong to the user', async () => {
      // Mock account lookup
      jest.spyOn(prisma.account, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.deposit(1, 1, 500)).rejects.toThrow(
        new BadRequestException('Access denied or account not found'),
      );
    });
  });

  describe('TransactionsService - withdraw', () => {
    it('should successfully withdraw money from an account', async () => {
      // Mock account lookup
      jest.spyOn(prisma.account, 'findUnique').mockResolvedValueOnce({
        id: 1,
        userId: 1,
        balance: 1000,
      });

      // Mock account update
      jest.spyOn(prisma.account, 'update').mockResolvedValueOnce({
        id: 1,
        userId: 1,
        balance: 500, // Updated balance after withdrawal
      });

      // Mock transaction creation
      jest.spyOn(prisma.transaction, 'create').mockResolvedValueOnce({
        id: 1,
        fromAccountId: 1,
        toAccountId: null, // No toAccountId for withdrawals
        type: 'WITHDRAW',
        amount: 500,
        status: 'SUCCESS',
        createdAt: new Date(),
      });

      const result = await service.withdraw(1, 1, 500);

      expect(result).toEqual({
        id: 1,
        fromAccountId: 1,
        toAccountId: null, // Ensure this matches the mock response
        type: 'WITHDRAW',
        amount: 500,
        status: 'SUCCESS',
        createdAt: expect.any(Date),
      });
      expect(prisma.account.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { balance: { decrement: 500 } },
      });
      expect(prisma.transaction.create).toHaveBeenCalledWith({
        data: {
          fromAccountId: 1,
          type: 'WITHDRAW',
          amount: 500,
          status: 'SUCCESS',
        },
      });
    });

    it('should throw an error if account has insufficient funds', async () => {
      // Mock account lookup
      jest.spyOn(prisma.account, 'findUnique').mockResolvedValueOnce({
        id: 1,
        userId: 1,
        balance: 400, // Insufficient balance
      });

      await expect(service.withdraw(1, 1, 500)).rejects.toThrow(
        new BadRequestException('Insufficient funds or access denied'),
      );
    });

    it('should throw an error if account does not belong to the user', async () => {
      // Mock account lookup
      jest.spyOn(prisma.account, 'findUnique').mockResolvedValueOnce({
        id: 1,
        userId: 2, // Account belongs to a different user
        balance: 1000,
      });

      await expect(service.withdraw(1, 1, 500)).rejects.toThrow(
        new BadRequestException('Insufficient funds or access denied'),
      );
    });

    it('should throw an error if withdrawal amount is less than or equal to zero', async () => {
      // Mock account lookup
      jest.spyOn(prisma.account, 'findUnique').mockResolvedValueOnce({
        id: 1,
        userId: 1,
        balance: 1000,
      });

      await expect(service.withdraw(1, 1, 0)).rejects.toThrow(
        new BadRequestException('Withdrawal amount must be greater than zero'),
      );
    });
  });
});
