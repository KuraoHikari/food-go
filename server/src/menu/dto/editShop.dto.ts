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
  stock?: number;

  @IsBoolean()
  @IsOptional()
  availability?: boolean;
}

export class EditMenuAvailabilityDto {
  @IsBoolean()
  @IsOptional()
  availability?: boolean;
}
