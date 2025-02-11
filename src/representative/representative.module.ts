import { Module } from '@nestjs/common';
import { RepresentativeService } from './representative.service';
import { RepresentativeController } from './representative.controller';
import { JwtService } from '@nestjs/jwt';
import { DbModule } from 'src/common/db/db.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [RepresentativeService, JwtService],
  controllers: [RepresentativeController],
  imports: [DbModule, AuthModule],
})
export class RepresentativeModule {}
