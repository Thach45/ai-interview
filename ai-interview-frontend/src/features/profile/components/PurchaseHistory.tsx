import React from 'react';
import { Receipt } from 'lucide-react';

export const PurchaseHistory: React.FC = () => {
  return (
    <div className="bg-bg-canvas rounded-lg border border-border-hairline shadow-[0_1px_2px_rgba(15,15,15,0.04)] overflow-hidden">
      <div className="px-6 py-4 border-b border-border-hairline flex items-center gap-2.5">
        <Receipt className="w-5 h-5 text-primary" />
        <h2 className="text-[18px] font-semibold text-text-primary">Lịch sử mua hàng</h2>
      </div>
      
      <div className="p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-bg-surface rounded-full flex items-center justify-center mb-6">
          <Receipt className="w-8 h-8 text-text-tertiary" />
        </div>
        <h3 className="text-[18px] font-medium text-text-primary mb-2">Chưa có lịch sử mua hàng</h3>
        <p className="text-[14px] text-text-tertiary max-w-[280px]">Mọi giao dịch và gói dịch vụ bạn đã mua sẽ xuất hiện tại đây.</p>
      </div>
    </div>
  );
};
