import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UpdateRepresentativeDTO {
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

  @IsNumber()
  @IsNotEmpty()
  debt: number;

  @IsBoolean()
  @IsNotEmpty()
  isDebtor: boolean;
}
