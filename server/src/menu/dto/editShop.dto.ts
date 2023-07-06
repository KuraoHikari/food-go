import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class EditMenuDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  desc?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  stok?: number;

  @IsBoolean()
  @IsOptional()
  availability?: boolean;
}
