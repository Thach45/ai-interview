import React from 'react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any; // Replace with User interface
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-bg-canvas w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-border-hairline flex justify-between items-center bg-bg-surface-soft">
          <h3 className="text-lg font-bold text-text-primary">
            {user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-bg-surface rounded-full transition-colors text-text-tertiary">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-text-secondary ml-1">Họ và tên</label>
              <input 
                type="text" 
                defaultValue={user?.fullName}
                placeholder="Nhập tên người dùng..."
                className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-xl outline-none focus:border-primary/30 focus:bg-white transition-all text-[14px]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-text-secondary ml-1">Email</label>
              <input 
                type="email" 
                defaultValue={user?.email}
                placeholder="email@example.com"
                className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-xl outline-none focus:border-primary/30 focus:bg-white transition-all text-[14px]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-text-secondary ml-1">Mật khẩu</label>
              <input 
                type="password" 
                placeholder={user ? "Để trống nếu không muốn đổi..." : "Nhập mật khẩu..."}
                className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-xl outline-none focus:border-primary/30 focus:bg-white transition-all text-[14px]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-text-secondary ml-1">Google ID (Nếu dùng Google Login)</label>
              <input 
                type="text" 
                defaultValue={user?.googleId}
                placeholder="1029384756..."
                className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-xl outline-none focus:border-primary/30 focus:bg-white transition-all text-[14px]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-text-secondary ml-1">Vai trò</label>
              <select 
                defaultValue={user?.role || 'CANDIDATE'}
                className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-xl outline-none focus:border-primary/30 focus:bg-white transition-all text-[14px] appearance-none"
              >
                <option value="CANDIDATE">Ứng viên (CANDIDATE)</option>
                <option value="MODERATOR">Điều phối viên (MODERATOR)</option>
                <option value="ADMIN">Quản trị viên (ADMIN)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 rounded-xl border border-border-hairline font-semibold text-[14px] hover:bg-bg-surface transition-all text-text-secondary"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit"
              className="flex-1 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-[14px] hover:brightness-110 transition-all shadow-lg shadow-primary/20"
            >
              {user ? 'Lưu thay đổi' : 'Tạo tài khoản'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
