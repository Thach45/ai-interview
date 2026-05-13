import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { userService } from '../../services/user.service';
import { Role, UserStatus } from '@prisma/client';
import { sendResponse } from '../../utils/apiResponse';
import { toUserResponseDTO } from '../../mappers/user.mapper';

export const userController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, role, status, search } = req.query;

    const result = await userService.getAllUsers({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      role: role as Role,
      status: status as UserStatus,
      search: search as string,
    });

    const mappedUsers = result.users.map(toUserResponseDTO);

    return sendResponse(res, 200, 'Users retrieved successfully', {
      users: mappedUsers,
      pagination: result.pagination,
    });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    return sendResponse(res, 200, 'User retrieved successfully', toUserResponseDTO(user));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);
    return sendResponse(res, 201, 'User created successfully', toUserResponseDTO(user));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await userService.updateUser(id, req.body);
    return sendResponse(res, 200, 'User updated successfully', toUserResponseDTO(user));
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    return sendResponse(res, 200, result.message);
  }),
};
