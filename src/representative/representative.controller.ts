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
import { RepresentativeType } from './type/representative.type';
import { RepresentativeService } from './representative.service';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { CreateRepresentativeDTO } from './dto/create-representative.dto';
import { UpdateRepresentativeDTO } from './dto/update-representative.dto';
import { Representative, Role } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/Auth.guard';
import { Roles } from 'src/auth/decorators/Roles.decorator';

@Controller('api/v1/representative')
@UseGuards(JwtGuard)
export class RepresentativeController {
  constructor(private readonly representativeService: RepresentativeService) {}

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER)
  async getRepresentatives(): Promise<RepresentativeType[]> {
    return await this.representativeService.getAllRepresentatives();
  }
  @Get('/get-by-token')
  @Roles(Role.USER)
  async getRepresentativeByTokenId(
    @GetUser('id') id: string,
  ): Promise<Representative> {
    return await this.representativeService.getRepresentativeById(id);
  }
  @Get('/get-by-id')
  @Roles(Role.ADMIN, Role.TEACHER)
  async getRepresentativeById(@Query() id: string): Promise<Representative> {
    return await this.representativeService.getRepresentativeById(id);
  }
  @Post('/create')
  @Roles(Role.ADMIN)
  async createRepresentative(
    @Body() createRepresentative: CreateRepresentativeDTO,
  ): Promise<RepresentativeType> {
    return await this.representativeService.createRepresentative(
      createRepresentative,
    );
  }
  @Patch('/update')
  async updateRepresentative(
    @GetUser('id') id: string,
    @Body() updateRepresentative: UpdateRepresentativeDTO,
  ): Promise<RepresentativeType> {
    return await this.representativeService.updateRepresentative(
      id,
      updateRepresentative,
    );
  }
  @Patch('/update-debts')
  @Roles(Role.ADMIN)
  async updateDebts(@Body() newDebt: number) {
    return await this.representativeService.updateAllDebts(newDebt);
  }
  @Delete('/delete')
  @Roles(Role.USER)
  async deleteRepresentative(@GetUser('id') id: string): Promise<boolean> {
    return this.representativeService.deleteRepresentative(id);
  }
}
