import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateRepresentativeDTO {
  @IsString()
  @IsNotEmpty()
  CI: string;

  @IsString()
  @IsNotEmpty()
  names: string;

  @IsString()
  @IsNotEmpty()
  lastnames: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber('VE')
  @IsNotEmpty()
  phone: string;
}
