import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/common/db/db.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserType } from './type/user.type';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

  async createUsers(createUser: CreateUserDto): Promise<UserType> {
    const { password, ...data } = createUser;
    const userExists = await this.dbService.user.findUnique({
      where: { email: data.email },
    });
    if (userExists) {
      throw new BadRequestException(
        'user with email: ' + data.email + ' already exists. try another.',
      );
    }
    const encryptedPassword = await argon2.hash(password);
    return this.dbService.user.create({
      data: {
        password: encryptedPassword,
        ...data,
      },
    });
  }
  async updateUsers(
    email: string,
    updateUser: UpdateUserDto,
  ): Promise<UserType> {
    const { password, newPassword, ...data } = updateUser;

    if (!email || !newPassword) {
      throw new BadRequestException('email and new password are required');
    }

    const user = await this.dbService.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('user not founded');
    }

    const isEqual = await argon2.verify(password, user.password);

    if (!isEqual) {
      throw new BadRequestException('password are not equal');
    }
    const newEncryptedPassword = await argon2.hash(newPassword);
    return this.dbService.user.update({
      where: { email },
      data: {
        password: newEncryptedPassword,
        firstname: data?.firstname || user.firstname,
        lastname: data?.lastname || user.lastname,
      },
    });
  }

  async getUsers(): Promise<UserType[]> {
    return await this.dbService.user.findMany({});
  }
  
  async deleteUser(id: string): Promise<boolean> {
    if (!id) {
      throw new BadRequestException('user id is required!');
    }
    const user = await this.dbService.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return !!(await this.dbService.user.delete({
      where: { id },
    }));
  }
}
