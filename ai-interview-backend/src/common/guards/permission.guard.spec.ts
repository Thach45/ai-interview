import { ForbiddenException } from '@nestjs/common';
import { PermissionGuard } from './permission.guard';

const createContext = (request: Record<string, unknown>) =>
  ({
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({ getRequest: () => request }),
  }) as any;

describe('PermissionGuard', () => {
  const reflector = { getAllAndOverride: jest.fn() } as any;
  const prisma = { rolePermission: { findFirst: jest.fn() } } as any;
  const guard = new PermissionGuard(reflector, prisma);

  beforeEach(() => jest.resetAllMocks());

  it('allows a public endpoint without querying permissions', async () => {
    reflector.getAllAndOverride.mockReturnValue(true);

    await expect(guard.canActivate(createContext({}))).resolves.toBe(true);
    expect(prisma.rolePermission.findFirst).not.toHaveBeenCalled();
  });

  it('matches a permission using the normalized Nest route path', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    prisma.rolePermission.findFirst.mockResolvedValue({ roleId: 'role-id' });

    await expect(
      guard.canActivate(
        createContext({
          method: 'PATCH',
          baseUrl: '/api/v1/admin/users',
          route: { path: '/:id' },
          user: { roles: ['MODERATOR'] },
        }),
      ),
    ).resolves.toBe(true);

    expect(prisma.rolePermission.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          role: { code: { in: ['MODERATOR'] }, isActive: true },
          permission: {
            method: 'PATCH',
            path: '/admin/users/:id',
            isActive: true,
          },
        }),
      }),
    );
  });

  it('rejects an endpoint when none of the JWT roles has its permission', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    prisma.rolePermission.findFirst.mockResolvedValue(null);

    await expect(
      guard.canActivate(
        createContext({
          method: 'GET',
          baseUrl: '/api/v1/users',
          route: { path: '/me' },
          user: { roles: ['CANDIDATE'] },
        }),
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
