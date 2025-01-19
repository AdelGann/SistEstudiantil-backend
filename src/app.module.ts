import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './common/db/db.module';
import { UsersModule } from './users/users.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [DbModule, UsersModule],
})
export class AppModule {}
