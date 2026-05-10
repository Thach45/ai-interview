import React from 'react';

interface CreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any; // Replace with User interface
}

export const CreditModal: React.FC<CreditModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-bg-canvas w-full max-w-[400px] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-border-hairline flex justify-between items-center bg-amber-50">
          <div className="flex items-center gap-2 text-amber-700">
            <span className="material-symbols-outlined text-[20px]">toll</span>
            <h3 className="text-sm font-bold uppercase tracking-wider">Nạp Credit</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-amber-100 rounded-full transition-colors text-amber-700">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3 p-3 bg-bg-surface-soft rounded-xl border border-border-hairline">
            <img src={user.avatarUrl} alt={user.fullName} className="size-10 rounded-full border border-white shadow-sm" />

            <div>
              <div className="text-[14px] font-bold text-text-primary">{user.fullName}</div>
              <div className="text-[12px] text-text-tertiary">Hiện có: <span className="font-bold text-primary">{user.creditsBalance} credit</span></div>
            </div>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-text-secondary ml-1">Số lượng credit cần nạp</label>
              <div className="relative">
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full pl-4 pr-12 py-3 bg-bg-surface border border-border-hairline rounded-xl outline-none focus:border-amber-400 focus:bg-white transition-all text-xl font-bold text-center"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600 font-bold">CR</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[10, 50, 100].map(amount => (
                <button 
                  key={amount}
                  type="button"
                  className="py-2 rounded-lg border border-border-hairline hover:border-amber-400 hover:bg-amber-50 text-[13px] font-bold text-text-secondary hover:text-amber-700 transition-all"
                >
                  +{amount}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full bg-amber-500 text-white px-6 py-3 rounded-xl font-bold text-[15px] hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                Xác nhận nạp credit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
