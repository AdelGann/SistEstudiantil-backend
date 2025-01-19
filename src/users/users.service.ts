import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/common/db/db.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

  async createUsers(createUser: CreateUserDto) {
    const { password, ...data } = createUser;
    const userExists = await this.dbService.user.findUnique({
      where: { email: data.email },
    });
    if (userExists) {
      throw new BadRequestException(
        'User with email: ' + data.email + ' already exists. try another.',
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
  async updateUsers() {}

  async getUsers(): Promise<User[]> {
    return await this.dbService.user.findMany({});
  }

  async deleteUser(id: string): Promise<boolean> {
    return !!(await this.dbService.user.delete({
      where: { id },
    }));
  }
}
