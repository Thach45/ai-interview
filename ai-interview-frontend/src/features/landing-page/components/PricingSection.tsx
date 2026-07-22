import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../subscription/hooks/useSubscription';
import { PricingCard } from '../../subscription/components/client/PricingCard';
import type { SubscriptionPackage } from '../../subscription/api/subscription.api';
import { useAuthStore } from '../../../store/authStore';

export const PricingSection: React.FC = () => {
  const { packages, isLoading } = useSubscription();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleBuyClick = (pkg: SubscriptionPackage) => {
    if (isAuthenticated) {
      // If logged in, send them to the main subscription page to complete payment
      navigate('/subscription');
    } else {
      // If not logged in, send them to login (then they can buy)
      navigate('/login');
    }
  };

  return (
    <section id="pricing" className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-widest mb-4">
            Bảng Giá Dịch Vụ
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Đầu tư cho sự nghiệp của bạn
          </h2>
          <p className="text-lg text-gray-500 font-medium">
            Mọi tính năng mạnh mẽ nhất của AI Interview được gói gọn trong các lựa chọn phù hợp với nhu cầu của bạn.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {isLoading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[450px] bg-white border border-gray-100 rounded-2xl animate-pulse shadow-sm" />
            ))
          ) : packages && packages.length > 0 ? (
            packages.map((pkg, idx) => (
              <PricingCard 
                key={pkg.id} 
                pkg={pkg} 
                index={idx} 
                onBuy={handleBuyClick} 
              />
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-gray-200">
              <span className="material-symbols-outlined text-[48px] text-gray-300 mb-2">inventory_2</span>
              <p className="text-gray-500 font-medium">Đang cập nhật các gói dịch vụ...</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
