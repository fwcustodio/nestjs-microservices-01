import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(0)
  quantity: number;
}