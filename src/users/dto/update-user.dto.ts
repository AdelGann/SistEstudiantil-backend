import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
