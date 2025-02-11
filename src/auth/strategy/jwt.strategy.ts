import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DbService } from 'src/common/db/db.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly dbService: DbService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: async (configService: ConfigService) => {
        return {
          secret: process.env.JWT_SECRET,
        };
      },
    });
  }
  /**
   * Método de validación que se llama automáticamente con el payload del token.
   * Busca al usuario en la base de datos usando el nombre del payload.
   * Lanza una excepción si el usuario no se encuentra.
   *
   * @param payload - Datos del token JWT.
   * @returns El usuario encontrado en la base de datos.
   */

  async validate(payload: { email: string }): Promise<any> {
    try {
      const { email } = payload;

      const user = await this.dbService.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) throw new UnauthorizedException();

      return user;
    } catch (error) {
      throw error;
    }
  }
}
