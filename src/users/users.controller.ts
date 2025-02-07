import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserType } from './type/user.type';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from 'src/auth/decorators/getUser.decorator';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getUsers(): Promise<UserType[]> {
    return await this.userService.getUsers();
  }
  @Post()
  async createUsers(@Body() createUser: CreateUserDto): Promise<UserType> {
    return await this.userService.createUsers(createUser);
  }
  @Patch()
  async updateUser(
    @GetUser('id') userId: string,
    @Body() updateUser: UpdateUserDto,
  ): Promise<UserType> {
    return await this.userService.updateUsers(userId, updateUser);
  }
  @Delete()
  async deleteUser(@Query('id') id: string): Promise<boolean> {
    return await this.userService.deleteUser(id);
  }
}
