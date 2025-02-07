import { Body, Controller, Post } from '@nestjs/common';
import { Token } from './type/jwt.object';
import { AuthService } from './auth.service';
import { RegisterUser } from './dto/registerUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async Login(
    @Body() { email, password }: { email: string; password: string },
  ): Promise<Token> {
    return this.authService.login({ email, password });
  }

  @Post()
  async Register(@Body() registerDto: RegisterUser): Promise<Token> {
    return this.authService.register(registerDto);
  }
  
}
