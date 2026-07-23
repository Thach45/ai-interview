import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Mark a route/controller as publicly accessible (no JWT auth required).
 * Only works when JwtAuthGuard is applied via @UseGuards(JwtAuthGuard).
 *
 * @example
 * @Controller('auth')
 * @IsPublic()
 * export class AuthController {}
 */
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
