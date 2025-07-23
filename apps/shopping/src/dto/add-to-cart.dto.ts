import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}