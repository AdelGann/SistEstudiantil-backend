import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';

/**
 * Guardian que verifica el token JWT en las solicitudes.
 * Si el token es válido, almacena el payload en request['user'].
 * Protege las rutas que requieren autenticación.
 */

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Método que determina si se puede activar la guardia.
   * @param context - Contexto de la ejecución de la solicitud.
   * @returns Devuelve true si el token es válido, de lo contrario lanza UnauthorizedException.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  /**
   * Método para extraer el token del encabezado de autorización.
   * @param request - Solicitud HTTP que contiene los encabezados.
   * @returns El token si se encuentra, undefined en caso contrario.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
