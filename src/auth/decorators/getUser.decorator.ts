import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * GetUser Decorator
 *
 * Este decorador se utiliza para extraer el usuario autenticado
 * del contexto de ejecución de una solicitud RESTful en un controlador de NestJS.
 *
 * @param data - Datos opcionales que se pueden pasar al decorador, como el nombre de una propiedad del usuario.
 * @param ctx - El contexto de ejecución que proporciona acceso a la solicitud HTTP.
 * @returns El usuario autenticado extraído de la solicitud o una propiedad específica del usuario.
 */
export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
