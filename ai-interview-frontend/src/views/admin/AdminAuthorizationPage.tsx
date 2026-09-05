'use client';

import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { usePermissions, useRoles, usePermissionActions, useRoleActions } from '../../features/authorization/hooks/useAuthorization';
import { RoleModal } from '../../features/authorization/components/RoleModal';
import { PermissionModal } from '../../features/authorization/components/PermissionModal';
import { RolePermissionsModal } from '../../features/authorization/components/RolePermissionsModal';
import type { Permission, Role } from '../../features/authorization/types';

type Tab = 'roles' | 'permissions';

const methodColor: Record<string, string> = {
  GET: 'text-green-600 bg-green-50 border-green-100',
  POST: 'text-blue-600 bg-blue-50 border-blue-100',
  PUT: 'text-amber-600 bg-amber-50 border-amber-100',
  PATCH: 'text-amber-600 bg-amber-50 border-amber-100',
  DELETE: 'text-red-600 bg-red-50 border-red-100',
};

export const AdminAuthorizationPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('roles');

  // Roles state
  const [rolePage, setRolePage] = useState(1);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [permissionsForRole, setPermissionsForRole] = useState<Role | null>(null);

  // Permissions state
  const [permPage, setPermPage] = useState(1);
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

  const pageSize = 10;

  const { data: rolesData, isLoading: isLoadingRoles } = useRoles({ page: rolePage, limit: pageSize });
  const { data: permsData, isLoading: isLoadingPerms } = usePermissions({ page: permPage, limit: pageSize });

  const { deleteRole } = useRoleActions();
  const { deletePermission, syncPermissions, isSyncing } = usePermissionActions();

  const handleAddRole = () => {
    setSelectedRole(null);
    setIsRoleModalOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsRoleModalOpen(true);
  };

  const handleDeleteRole = async (role: Role) => {
    if (role.isSystem) return;
    if (window.confirm(`Xóa role "${role.displayName}"?`)) {
      await deleteRole(role.id);
    }
  };

  const handleAddPermission = () => {
    setSelectedPermission(null);
    setIsPermModalOpen(true);
  };

  const handleEditPermission = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsPermModalOpen(true);
  };

  const handleDeletePermission = async (permission: Permission) => {
    if (window.confirm(`Xóa permission "${permission.method} ${permission.path}"?`)) {
      await deletePermission(permission.id);
    }
  };

  const headerAction = (
    <div className="flex gap-2">
      {tab === 'permissions' && (
        <button
          onClick={() => syncPermissions()}
          disabled={isSyncing}
          className="border border-border-hairline text-text-secondary px-5 py-2 rounded-lg font-bold text-[12px] hover:bg-bg-surface transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">sync</span>
          {isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ route'}
        </button>
      )}
      <button
        onClick={tab === 'roles' ? handleAddRole : handleAddPermission}
        className="bg-primary text-white px-5 py-2 rounded-lg font-bold text-[12px] hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        {tab === 'roles' ? 'Thêm role' : 'Thêm permission'}
      </button>
    </div>
  );

  return (
    <AdminLayout title="Vai trò & quyền" rightAction={headerAction}>
      <div className="flex flex-col gap-6">
        <div className="flex gap-1 bg-bg-surface-soft p-1 rounded-xl w-fit">
          <button
            onClick={() => setTab('roles')}
            className={`px-5 py-2 rounded-lg text-[13px] font-bold transition-all ${tab === 'roles' ? 'bg-white text-primary shadow-sm' : 'text-text-tertiary hover:text-text-secondary'}`}
          >
            Roles
          </button>
          <button
            onClick={() => setTab('permissions')}
            className={`px-5 py-2 rounded-lg text-[13px] font-bold transition-all ${tab === 'permissions' ? 'bg-white text-primary shadow-sm' : 'text-text-tertiary hover:text-text-secondary'}`}
          >
            Permissions
          </button>
        </div>

        {tab === 'roles' ? (
          <div className="bg-white rounded-2xl border border-border-hairline shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-bg-surface-soft border-b border-border-hairline">
                    <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Mã role</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Tên hiển thị</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Trạng thái</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Hệ thống</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px] text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-hairline">
                  {isLoadingRoles ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                          <span className="text-[13px] text-text-tertiary font-medium">Đang tải danh sách...</span>
                        </div>
                      </td>
                    </tr>
                  ) : rolesData?.data.map((role) => (
                    <tr key={role.id} className="hover:bg-bg-surface-soft/40 transition-colors group">
                      <td className="px-6 py-4 font-mono text-[13px] font-semibold text-text-primary">{role.code}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-text-primary text-[14px]">{role.displayName}</div>
                        {role.description && <div className="text-text-tertiary text-[12px]">{role.description}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className={`size-2 rounded-full ${role.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className={`text-[12px] font-medium ${role.isActive ? 'text-green-600' : 'text-red-600'}`}>
                            {role.isActive ? 'Hoạt động' : 'Vô hiệu'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {role.isSystem && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase border text-purple-600 bg-purple-50 border-purple-100">
                            System
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => setPermissionsForRole(role)}
                            className="p-2 hover:bg-bg-surface text-text-tertiary hover:text-primary rounded-md transition-all"
                            title="Phân quyền"
                          >
                            <span className="material-symbols-outlined text-[20px]">key</span>
                          </button>
                          <button
                            onClick={() => handleEditRole(role)}
                            className="p-2 hover:bg-bg-surface text-text-tertiary hover:text-primary rounded-md transition-all"
                            title="Sửa"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteRole(role)}
                            disabled={role.isSystem}
                            className="p-2 hover:bg-red-50 text-text-tertiary hover:text-red-600 rounded-md transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-tertiary"
                            title={role.isSystem ? 'Không thể xóa role hệ thống' : 'Xóa'}
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(!isLoadingRoles && (!rolesData || rolesData.data.length === 0)) && (
              <div className="py-20 flex flex-col items-center justify-center text-text-tertiary">
                <span className="material-symbols-outlined text-[48px] mb-2 opacity-20">admin_panel_settings</span>
                <p className="text-[14px]">Chưa có role nào</p>
              </div>
            )}

            {rolesData && rolesData.meta.totalPages > 1 && (
              <PaginationBar
                page={rolesData.meta.page}
                totalPages={rolesData.meta.totalPages}
                total={rolesData.meta.total}
                limit={rolesData.meta.limit}
                onChange={setRolePage}
              />
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border-hairline shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-bg-surface-soft border-b border-border-hairline">
                    <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Method</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Path</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Tên hiển thị</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Trạng thái</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px] text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-hairline">
                  {isLoadingPerms ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                          <span className="text-[13px] text-text-tertiary font-medium">Đang tải danh sách...</span>
                        </div>
                      </td>
                    </tr>
                  ) : permsData?.data.map((permission) => (
                    <tr key={permission.id} className="hover:bg-bg-surface-soft/40 transition-colors group">
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${methodColor[permission.method] ?? ''}`}>
                          {permission.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-[13px] text-text-primary">{permission.path}</td>
                      <td className="px-6 py-4 text-[13px] text-text-secondary">{permission.displayName}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className={`size-2 rounded-full ${permission.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className={`text-[12px] font-medium ${permission.isActive ? 'text-green-600' : 'text-red-600'}`}>
                            {permission.isActive ? 'Hoạt động' : 'Vô hiệu'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => handleEditPermission(permission)}
                            className="p-2 hover:bg-bg-surface text-text-tertiary hover:text-primary rounded-md transition-all"
                            title="Sửa"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeletePermission(permission)}
                            className="p-2 hover:bg-red-50 text-text-tertiary hover:text-red-600 rounded-md transition-all"
                            title="Xóa"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(!isLoadingPerms && (!permsData || permsData.data.length === 0)) && (
              <div className="py-20 flex flex-col items-center justify-center text-text-tertiary">
                <span className="material-symbols-outlined text-[48px] mb-2 opacity-20">key_off</span>
                <p className="text-[14px]">Chưa có permission nào. Bấm &quot;Đồng bộ route&quot; để phát hiện tự động.</p>
              </div>
            )}

            {permsData && permsData.meta.totalPages > 1 && (
              <PaginationBar
                page={permsData.meta.page}
                totalPages={permsData.meta.totalPages}
                total={permsData.meta.total}
                limit={permsData.meta.limit}
                onChange={setPermPage}
              />
            )}
          </div>
        )}
      </div>

      <RoleModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} role={selectedRole} />
      <PermissionModal isOpen={isPermModalOpen} onClose={() => setIsPermModalOpen(false)} permission={selectedPermission} />
      <RolePermissionsModal
        isOpen={Boolean(permissionsForRole)}
        onClose={() => setPermissionsForRole(null)}
        role={permissionsForRole}
      />
    </AdminLayout>
  );
};

interface PaginationBarProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}

const PaginationBar: React.FC<PaginationBarProps> = ({ page, totalPages, total, limit, onChange }) => (
  <div className="px-6 py-4 bg-bg-surface-soft/50 border-t border-border-hairline flex items-center justify-between">
    <div className="text-[13px] text-text-secondary">
      Hiển thị <span className="font-bold text-text-primary">{(page - 1) * limit + 1}-{Math.min(page * limit, total)}</span> trên <span className="font-bold text-text-primary">{total}</span>
    </div>
    <div className="flex items-center gap-2">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="size-8 rounded-lg border border-border-hairline bg-white flex items-center justify-center hover:bg-bg-surface disabled:opacity-30 transition-all shadow-sm"
      >
        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
      </button>
      <div className="flex items-center gap-1">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i + 1)}
            className={`size-8 rounded-lg text-[13px] font-bold transition-all ${page === i + 1
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'bg-white border border-border-hairline text-text-secondary hover:bg-bg-surface shadow-sm'
              }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="size-8 rounded-lg border border-border-hairline bg-white flex items-center justify-center hover:bg-bg-surface disabled:opacity-30 transition-all shadow-sm"
      >
        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
      </button>
    </div>
  </div>
);
