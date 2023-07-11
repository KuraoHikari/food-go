import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MenuDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  menuId: number;

  @IsString()
  @IsNotEmpty()
  menuName: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(10)
  amount: number;
}

export class CreateBillDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  shopId: number;

  @IsString()
  @IsNotEmpty()
  note: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => MenuDto)
  orderMenu: MenuDto[];
}
