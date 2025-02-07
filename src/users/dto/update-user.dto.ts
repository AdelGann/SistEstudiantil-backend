import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  firstname?: string;

  @IsString()
  lastname?: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @IsStrongPassword()
  @IsNotEmpty()
  newPassword: string;
}
