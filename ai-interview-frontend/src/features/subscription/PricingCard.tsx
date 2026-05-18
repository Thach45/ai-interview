import React from 'react';
import { motion } from 'framer-motion';
import type { SubscriptionPackage } from './api/subscription.api';

const GRADIENTS = [
  'from-[#6366f1] to-[#818cf8]',
  'from-[#5645d4] to-[#7c3aed]',
  'from-[#ec4899] to-[#d946ef]',
  'from-[#f59e0b] to-[#fbbf24]',
];

const formatPrice = (price: number) => price.toLocaleString('vi-VN');

interface Props {
  pkg: SubscriptionPackage;
  index: number;
  onBuy: (pkg: SubscriptionPackage) => void;
}

export const PricingCard: React.FC<Props> = ({ pkg, index, onBuy }) => {
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const discount = pkg.oldPrice ? Math.round((1 - pkg.price / pkg.oldPrice) * 100) : 0;
  const durationLabel = `${pkg.durationDays} ngày`;
  const creditsLabel = pkg.credits === -1 ? 'Không giới hạn lượt dùng' : `${pkg.credits} Credit`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative flex flex-col bg-white rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
        pkg.isPopular
          ? 'border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/20 scale-[1.02]'
          : 'border-gray-100 shadow-sm hover:border-primary/30'
      }`}
    >
      {/* Popular badge */}
      {pkg.isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-primary text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md shadow-primary/30">
            Phổ biến nhất
          </span>
        </div>
      )}

      {/* Gradient top bar */}
      <div className={`h-1.5 w-full rounded-t-2xl bg-gradient-to-r ${gradient}`} />

      <div className="p-6 flex flex-col flex-1">
        {/* Icon + Name */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`size-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}>
            <span className="material-symbols-outlined text-white text-[20px]">{pkg.icon}</span>
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-text-primary">{pkg.name}</h3>
            <p className="text-[11px] text-text-tertiary">{pkg.tagline}</p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-1">
          {pkg.oldPrice > 0 && (
            <span className="text-[12px] text-text-tertiary line-through mr-2">{formatPrice(pkg.oldPrice)}đ</span>
          )}
          {discount > 0 && (
            <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              Tiết kiệm {discount}%
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-[32px] font-extrabold text-text-primary tracking-tight">{formatPrice(pkg.price)}</span>
          <span className="text-[14px] text-text-tertiary font-medium">đ</span>
        </div>
        <p className="text-[12px] text-primary font-semibold mb-5">
          <span className="material-symbols-outlined text-[14px] align-middle mr-1">schedule</span>
          {durationLabel} · {creditsLabel}
        </p>

        {/* Features */}
        <ul className="space-y-2.5 mb-6 flex-1">
          {pkg.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[13px] text-text-secondary">
              <span className="material-symbols-outlined text-[16px] text-green-500 mt-0.5 shrink-0">check_circle</span>
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={() => onBuy(pkg)}
          className={`w-full py-3 rounded-xl font-bold text-[13px] transition-all duration-300 ${
            pkg.isPopular
              ? 'bg-primary text-white hover:brightness-110 shadow-md shadow-primary/20'
              : 'bg-gray-50 text-text-primary border border-gray-200 hover:bg-primary hover:text-white hover:border-primary'
          }`}
        >
          Mua ngay
        </button>
      </div>
    </motion.div>
  );
};
