import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import {
  DepositDto,
  WithdrawDto,
  TransferDto,
} from './dto/create-transaction.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit')
  @ApiOperation({ summary: 'Deposit money into an account' })
  async deposit(@Body() data: DepositDto) {
    return this.transactionsService.deposit(data.accountId, data.amount);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw money from an account' })
  async withdraw(@Body() data: WithdrawDto) {
    return this.transactionsService.withdraw(data.accountId, data.amount);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer money between accounts' })
  async transfer(@Body() data: TransferDto) {
    return this.transactionsService.transfer(
      data.fromAccountId,
      data.toAccountId,
      data.amount,
    );
  }

  @Get('history/:accountId')
  @ApiOperation({ summary: 'Get transaction history for an account' })
  async getHistory(
    @Param('accountId') accountId: string,
    @Query('type') type?: string,
  ) {
    return this.transactionsService.getTransactionHistory(
      Number(accountId),
      type,
    );
  }
}
