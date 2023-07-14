import {
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditShopDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsOptional()
  desc?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsMobilePhone('id-ID')
  @IsString()
  @IsNotEmpty()
  phoneNumber?: string;
}
