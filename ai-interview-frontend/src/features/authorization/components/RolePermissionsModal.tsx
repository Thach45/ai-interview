import React, { useEffect, useMemo, useState } from 'react';
import type { Role } from '../types';
import { usePermissions, useRolePermissions, useRolePermissionActions } from '../hooks/useAuthorization';

interface RolePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
}

export const RolePermissionsModal: React.FC<RolePermissionsModalProps> = ({ isOpen, onClose, role }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  const { data: allPermissions, isLoading: isLoadingAll } = usePermissions({ limit: 100 });
  const { data: assignedPermissions, isLoading: isLoadingAssigned } = useRolePermissions(
    role?.id ?? null,
  );
  const { replacePermissions, isReplacing } = useRolePermissionActions(role?.id ?? '');

  useEffect(() => {
    if (assignedPermissions) {
      setSelectedIds(new Set(assignedPermissions.map((p) => p.id)));
    }
  }, [assignedPermissions, role?.id]);

  const filteredPermissions = useMemo(() => {
    const list = allPermissions?.data ?? [];
    if (!search.trim()) return list;
    const q = search.trim().toLowerCase();
    return list.filter(
      (p) => p.path.toLowerCase().includes(q) || p.displayName.toLowerCase().includes(q),
    );
  }, [allPermissions, search]);

  if (!isOpen || !role) return null;

  const isLoading = isLoadingAll || isLoadingAssigned;

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    try {
      await replacePermissions([...selectedIds]);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const methodColor: Record<string, string> = {
    GET: 'text-green-600 bg-green-50 border-green-100',
    POST: 'text-blue-600 bg-blue-50 border-blue-100',
    PUT: 'text-amber-600 bg-amber-50 border-amber-100',
    PATCH: 'text-amber-600 bg-amber-50 border-amber-100',
    DELETE: 'text-red-600 bg-red-50 border-red-100',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[640px] max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-border-hairline flex justify-between items-center bg-bg-surface-soft shrink-0">
          <div>
            <h3 className="text-lg font-bold text-text-primary">Phân quyền cho role</h3>
            <p className="text-[12px] text-text-tertiary">{role.displayName} ({role.code})</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg-surface rounded-full transition-colors text-text-tertiary">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="px-6 py-3 border-b border-border-hairline shrink-0">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-[18px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo path hoặc tên..."
              className="w-full pl-9 pr-3 py-2 bg-bg-surface border border-border-hairline rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[13px]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <span className="text-[13px] text-text-tertiary font-medium">Đang tải quyền...</span>
            </div>
          ) : filteredPermissions.length === 0 ? (
            <div className="py-16 text-center text-text-tertiary text-[13px]">Không tìm thấy permission nào.</div>
          ) : (
            <div className="space-y-1">
              {filteredPermissions.map((permission) => (
                <label
                  key={permission.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg-surface-soft cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(permission.id)}
                    onChange={() => toggle(permission.id)}
                    className="size-4 shrink-0"
                  />
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${methodColor[permission.method] ?? ''}`}>
                    {permission.method}
                  </span>
                  <span className="text-[13px] font-mono text-text-primary truncate flex-1">{permission.path}</span>
                  <span className="text-[12px] text-text-tertiary truncate max-w-[160px]">{permission.displayName}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border-hairline flex items-center justify-between shrink-0 bg-bg-surface-soft">
          <span className="text-[12px] text-text-secondary">Đã chọn {selectedIds.size} permission</span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isReplacing}
              className="px-6 py-2.5 rounded-xl border border-border-hairline font-semibold text-[14px] hover:bg-bg-surface transition-all text-text-secondary disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isReplacing || isLoading}
              className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-[14px] hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isReplacing && <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
