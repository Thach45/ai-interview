import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const HAS_ROLE_KEY = 'hasRole';

/**
 * Specify required roles for a controller or route.
 * Only works when RolesGuard is applied via @UseGuards(RolesGuard).
 *
 * @example
 * @Controller('admin/users')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @HasRole(Role.ADMIN)
 * export class AdminUserController {}
 */
export const HasRole = (...roles: Role[]) => SetMetadata(HAS_ROLE_KEY, roles);
