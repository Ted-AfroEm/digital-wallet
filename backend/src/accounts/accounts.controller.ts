import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';

@ApiTags('Accounts')
@ApiBearerAuth()
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create an account for a user' })
  async create(@Body() data: CreateAccountDto) {
    return this.accountsService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all accounts' })
  async findAll() {
    return this.accountsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account details by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  async findOne(@Param('id') id: string) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid account ID format');
    }
    return this.accountsService.findOne(numericId);
  }
}
