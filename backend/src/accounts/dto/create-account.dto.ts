import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({
    description: 'The ID of the user associated with the account',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  userId: number;

  @ApiProperty({
    description: 'The initial balance of the account',
    example: 500.0,
  })
  @IsPositive()
  initialBalance: number;
}
