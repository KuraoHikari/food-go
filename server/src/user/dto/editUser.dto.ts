import {
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class editUserDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsMobilePhone('id-ID')
  phoneNumber: string;
}
