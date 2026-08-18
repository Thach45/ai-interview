import React from 'react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '../../subscription/hooks/useSubscription';
import { PricingCard } from '../../subscription/components/client/PricingCard';
import type { SubscriptionPackage } from '../../subscription/api/subscription.api';
import { useAuthStore } from '../../../store/authStore';

export const PricingSection: React.FC = () => {
  const { packages, isLoading } = useSubscription();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleBuyClick = (pkg: SubscriptionPackage) => {
    if (isAuthenticated) {
      // If logged in, send them to the main subscription page to complete payment
      router.push('/subscription');
    } else {
      // If not logged in, send them to login (then they can buy)
      router.push('/login');
    }
  };

  return (
    <section id="pricing" className="border-t border-gray-200 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-block rounded-md border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
            Bảng giá
          </span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-gray-950 md:text-5xl">
            Đầu tư cho sự nghiệp của bạn
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600">
            Mọi tính năng mạnh mẽ nhất của Arion được gói gọn trong các lựa chọn phù hợp với nhu cầu của bạn.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {isLoading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[450px] animate-pulse rounded-xl border border-gray-200 bg-gray-50" />
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
            <div className="col-span-full rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
              <span className="material-symbols-outlined text-[48px] text-gray-300 mb-2">inventory_2</span>
              <p className="text-gray-500 font-medium">Đang cập nhật các gói dịch vụ...</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
