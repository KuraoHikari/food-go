import { IsMobilePhone, IsNotEmpty, IsString } from 'class-validator';

export class CreateShopDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  desc: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsMobilePhone('id-ID')
  @IsNotEmpty()
  phoneNumber: string;
}
