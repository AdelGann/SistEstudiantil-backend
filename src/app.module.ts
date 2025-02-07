import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './common/db/db.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { configModule } from './common/config/config.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/Roles.guard';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  imports: [DbModule, UsersModule, AuthModule, configModule],
})
export class AppModule {}
