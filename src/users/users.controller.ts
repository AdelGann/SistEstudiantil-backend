import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserType } from './type/user.type';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { Roles } from 'src/auth/decorators/Roles.decorator';
import { Role } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/Auth.guard';

@Controller('api/v1/users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  async getUsers(): Promise<UserType[]> {
    return await this.userService.getUsers();
  }
  @Post()
  //@Roles(Role.ADMIN)
  async createUsers(@Body() createUser: CreateUserDto): Promise<UserType> {
    return await this.userService.createUsers(createUser);
  }
  @Patch()
  @Roles(Role.ADMIN)
  async updateUser(
    @GetUser('id') userId: string,
    @Body() updateUser: UpdateUserDto,
  ): Promise<UserType> {
    return await this.userService.updateUsers(userId, updateUser);
  }
  @Delete()
  @Roles(Role.ADMIN)
  async deleteUser(@Query('id') id: string): Promise<boolean> {
    return await this.userService.deleteUser(id);
  }
}
