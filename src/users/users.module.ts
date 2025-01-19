import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DbService } from 'src/common/db/db.service';
import { DbModule } from 'src/common/db/db.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [DbModule],
})
export class UsersModule {}
