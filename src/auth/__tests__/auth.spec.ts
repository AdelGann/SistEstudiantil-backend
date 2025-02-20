import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { DbService } from '../../common/db/db.service';
import * as argon2 from 'argon2';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Role } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let dbService: DbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn() },
        },
        {
          provide: DbService,
          useValue: { user: { findUnique: jest.fn() } },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    dbService = module.get<DbService>(DbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return a token if credentials are valid', async () => {
      const credentials = {
        email: 'imadelg14@gmail.com',
        password: 'GannemTest@Admin',
      };
      const user = {
        id: '95210-5429sh125-125-asgh2152',
        email: 'imadelg14@gmail.com',
        password: await argon2.hash('GannemTest@Admin'),
        firstname: 'Adel',
        lastname: 'Gannem',
        role: Role.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const token = 'mockedToken';

      jest.spyOn(dbService.user, 'findUnique').mockResolvedValue(user);
      jest.spyOn(argon2, 'verify').mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);

      const result = await service.login(credentials);

      expect(result).toEqual({ accessToken: token });
    });

    it('should throw NotFoundException if user is not found', async () => {
       const credentials = {
         email: 'imadelg14@gmail.com',
         password: 'GannemTest@User',
       };

      jest.spyOn(dbService.user, 'findUnique').mockRejectedValue(() => {
        throw new NotFoundException('User not founded');
      });

      await expect(service.login(credentials)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if password is incorrect', async () => {
      const credentials = {
        email: 'imadelg14@gmail.com',
        password: 'GannemTest@User',
      };
      const user = {
        id: '95210-5429sh125-125-asgh2152',
        email: 'imadelg14@gmail.com',
        password: await argon2.hash('GannemTest@Admin'),
        firstname: 'Adel',
        lastname: 'Gannem',
        role: Role.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(dbService.user, 'findUnique').mockResolvedValue(user);
      jest.spyOn(argon2, 'verify').mockResolvedValue(false);

      await expect(service.login(credentials)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
  
  describe("register", () => {
    
  })
});
