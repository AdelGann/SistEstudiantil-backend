import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const AuthDecorator = () => {
  return applyDecorators(UseGuards(AuthGuard()));
};
