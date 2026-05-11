import React, { useState, useEffect } from 'react';
import type { JobCategory } from '../../../api/jobCategory.api';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; type: string; parentId?: string }) => void;
  initialData?: JobCategory | null;
  parentInfo?: { id: string; name: string; type: string } | null;
  isLoading?: boolean;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  parentInfo,
  isLoading,
}) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    } else {
      setName('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Xác định type dựa trên cha nếu đang tạo mới
    let type = 'GROUP';
    if (parentInfo) {
      if (parentInfo.type === 'GROUP') type = 'INDUSTRY';
      if (parentInfo.type === 'INDUSTRY') type = 'POSITION';
    } else if (initialData) {
      type = initialData.type;
    }

    onSubmit({
      name: name.trim(),
      type,
      parentId: parentInfo?.id,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-border-hairline flex justify-between items-center bg-bg-surface-soft">
          <h3 className="font-bold text-text-primary">
            {initialData ? 'Chỉnh sửa danh mục' : parentInfo ? `Thêm vào "${parentInfo.name}"` : 'Thêm nhóm nghề mới'}
          </h3>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary transition-all">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-text-secondary mb-1.5">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Công nghệ thông tin, Backend Developer..."
              className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-[14px]"
              required
            />
          </div>

          {parentInfo && (
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-[12px] text-primary">
                Danh mục này sẽ được tạo ở cấp: <strong>{parentInfo.type === 'GROUP' ? 'Ngành nghề (Cấp 2)' : 'Vị trí (Cấp 3)'}</strong>
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-border-hairline rounded-xl font-semibold text-[14px] hover:bg-bg-surface transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl font-semibold text-[14px] hover:brightness-110 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : initialData ? 'Lưu thay đổi' : 'Tạo ngay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
