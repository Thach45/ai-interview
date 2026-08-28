import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authorizationApi } from '../api/authorization.api';
import type {
  CreatePermissionPayload,
  CreateRolePayload,
  UpdatePermissionPayload,
  UpdateRolePayload,
} from '../types';

export const useRoles = (params: { page?: number; limit?: number; isActive?: boolean } = {}) =>
  useQuery({
    queryKey: ['authorization', 'roles', params],
    queryFn: () => authorizationApi.getRoles(params),
  });

export const usePermissions = (
  params: { page?: number; limit?: number; isActive?: boolean } = {},
) =>
  useQuery({
    queryKey: ['authorization', 'permissions', params],
    queryFn: () => authorizationApi.getPermissions(params),
  });

export const useRolePermissions = (roleId: string | null) =>
  useQuery({
    queryKey: ['authorization', 'role-permissions', roleId],
    queryFn: () => authorizationApi.getPermissionsForRole(roleId as string),
    enabled: Boolean(roleId),
  });

export const useRoleActions = () => {
  const queryClient = useQueryClient();
  const invalidateRoles = () =>
    queryClient.invalidateQueries({ queryKey: ['authorization', 'roles'] });

  const createMutation = useMutation({
    mutationFn: (payload: CreateRolePayload) => authorizationApi.createRole(payload),
    onSuccess: () => {
      invalidateRoles();
      toast.success('Đã tạo role thành công');
    },
    onError: (error: any) => toast.error(error.message || 'Không thể tạo role'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRolePayload }) =>
      authorizationApi.updateRole(id, data),
    onSuccess: () => {
      invalidateRoles();
      toast.success('Đã cập nhật role');
    },
    onError: (error: any) => toast.error(error.message || 'Không thể cập nhật role'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => authorizationApi.deleteRole(id),
    onSuccess: () => {
      invalidateRoles();
      toast.success('Đã xóa role');
    },
    onError: (error: any) => toast.error(error.message || 'Không thể xóa role'),
  });

  return {
    createRole: createMutation.mutateAsync,
    updateRole: updateMutation.mutateAsync,
    deleteRole: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const usePermissionActions = () => {
  const queryClient = useQueryClient();
  const invalidatePermissions = () =>
    queryClient.invalidateQueries({ queryKey: ['authorization', 'permissions'] });

  const createMutation = useMutation({
    mutationFn: (payload: CreatePermissionPayload) => authorizationApi.createPermission(payload),
    onSuccess: () => {
      invalidatePermissions();
      toast.success('Đã tạo permission thành công');
    },
    onError: (error: any) => toast.error(error.message || 'Không thể tạo permission'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePermissionPayload }) =>
      authorizationApi.updatePermission(id, data),
    onSuccess: () => {
      invalidatePermissions();
      toast.success('Đã cập nhật permission');
    },
    onError: (error: any) => toast.error(error.message || 'Không thể cập nhật permission'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => authorizationApi.deletePermission(id),
    onSuccess: () => {
      invalidatePermissions();
      toast.success('Đã xóa permission');
    },
    onError: (error: any) => toast.error(error.message || 'Không thể xóa permission'),
  });

  const syncMutation = useMutation({
    mutationFn: () => authorizationApi.syncPermissions(),
    onSuccess: (result) => {
      invalidatePermissions();
      toast.success(
        `Đồng bộ thành công: phát hiện ${result.discovered}, tạo mới ${result.created}, cấp cho ADMIN ${result.grantedToAdmin}`,
      );
    },
    onError: (error: any) => toast.error(error.message || 'Không thể đồng bộ permission'),
  });

  return {
    createPermission: createMutation.mutateAsync,
    updatePermission: updateMutation.mutateAsync,
    deletePermission: deleteMutation.mutateAsync,
    syncPermissions: syncMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isSyncing: syncMutation.isPending,
  };
};

export const useRolePermissionActions = (roleId: string) => {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['authorization', 'role-permissions', roleId] });

  const replaceMutation = useMutation({
    mutationFn: (permissionIds: string[]) =>
      authorizationApi.replaceRolePermissions(roleId, permissionIds),
    onSuccess: () => {
      invalidate();
      toast.success('Đã cập nhật quyền cho role');
    },
    onError: (error: any) => toast.error(error.message || 'Không thể cập nhật quyền'),
  });

  return {
    replacePermissions: replaceMutation.mutateAsync,
    isReplacing: replaceMutation.isPending,
  };
};
