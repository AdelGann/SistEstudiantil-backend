import { Body, Controller, Post } from '@nestjs/common';
import { Token } from './type/jwt.object';
import { AuthService } from './auth.service';
import { RegisterUser } from './dto/registerUser.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async Login(
    @Body() { email, password }: { email: string; password: string },
  ): Promise<Token> {
    return this.authService.login({ email, password });
  }

  @Post('/register')
  async Register(@Body() registerDto: RegisterUser): Promise<Token> {
    return this.authService.register(registerDto);
  }
}
