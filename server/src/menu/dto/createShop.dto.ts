import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  desc: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  stok: number;

  @IsBoolean()
  @IsNotEmpty()
  availability: boolean;
}
