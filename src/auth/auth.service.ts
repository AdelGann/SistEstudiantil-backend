import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DbService } from 'src/common/db/db.service';
import * as argon2 from 'argon2';
import { Token } from './type/jwt.object';
import { RegisterUser } from './dto/registerUser.dto';
import { Role } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly dbService: DbService,
  ) {}

  /**
   * Logs in a user by verifying their email and password.
   * This method works for all the roles, USER, TEACHER, ADMIN
   *
   * @param {Object} credentials - The login credentials.
   * @param {string} credentials.email - The email of the user.
   * @param {string} credentials.password - The password of the user.
   * @returns {Promise<Token>} A promise that resolves to an object containing the access token.
   * @throws {NotFoundException} If the user with the given email is not found.
   * @throws {BadRequestException} If the password is incorrect.
   */
  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<Token> {
    const user = await this.dbService.user.findUnique({
      where: { email },
    });
    if (!user) throw new NotFoundException('User not founded');
    const passwordMatch = await argon2.verify(user.password, password);
    if (!passwordMatch)
      throw new BadRequestException('The password is incorrect');
    return {
      accessToken: await this.jwtService.signAsync({
        id: user.id,
        role: user.role,
      }),
    };
  }
  /**
   * Register a new user, that takes email from representative table.
   * it only works for rol user.
   *
   *
   * @param {Object} register - The register dto.
   * @param {string} register.CI - Identity Card, unique for representative user.
   * @param {string} register.email - Email, unique for representative user.
   * @param {string} register.password - Password of the user.
   * @param {string} register.repeat_password - property to validate if user typed correctly his password.
   * @returns {Promise<Token>} A promise that resolves to an object containing the access token.
   * @throws {BadRequestException} If the user with the given email is founded.
   * @throws {BadRequestException} If CI, Email or Password did not sended.
   * @throws {BadRequestException} If password and repeat_password arent equals.
   * @throws {ForbiddenException} If was not founded at representative table.
   */
  async register(register: RegisterUser): Promise<Token> {
    const { CI, email, password, repeat_password } = register;

    if (!CI || !email || !password)
      throw new BadRequestException('CI, Email and Password are required');

    const user = await this.dbService.user.findUnique({
      where: { email },
    });

    if (user) throw new BadRequestException('User already exists');

    const representative = await this.dbService.representative.findUnique({
      where: { CI_email: { CI, email } },
    });

    if (!representative) {
      throw new ForbiddenException(
        'CI not founded, cannot continue. Only persons registered has representative can create an account.',
      );
    }

    if (password !== repeat_password) {
      throw new BadRequestException("Password aren't equals, try again.");
    }
    const encryptedPassword = await argon2.hash(repeat_password);
    const userRegistered = await this.dbService.user.create({
      data: {
        email,
        firstname: representative.names,
        lastname: representative.lastnames,
        password: encryptedPassword,
        role: Role.USER,
      },
    });
    return {
      accessToken: await this.jwtService.signAsync({
        id: userRegistered.id,
        role: userRegistered.role,
      }),
    };
  }
}
