interface PackageItem {
  id: string;
  name: string;
  tagline?: string;
  price: number;
  oldPrice?: number;
  durationDays: number;
  credits: number;
  isPopular?: boolean;
  isActive?: boolean;
  icon?: string;
  features?: string[];
}

interface PackageCardProps {
  pkg: PackageItem;
  onEdit: (pkg: PackageItem) => void;
  onDelete: (id: string) => void;
}

export function PackageCard({ pkg, onEdit, onDelete }: PackageCardProps) {
  return (
    <div className="bg-white border border-border-hairline rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[20px]">{pkg.icon || 'rocket_launch'}</span>
          </div>
          <div className="flex gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${pkg.isActive ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
              {pkg.isActive ? 'Hoạt động' : 'Tạm dừng'}
            </span>
            {pkg.isPopular && (
              <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Phổ biến</span>
            )}
          </div>
        </div>

        <h3 className="text-[18px] font-bold text-text-primary mb-1">{pkg.name}</h3>
        {pkg.tagline && <p className="text-[12px] text-text-tertiary mb-4">{pkg.tagline}</p>}

        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-[24px] font-extrabold text-text-primary">{pkg.price.toLocaleString()}đ</span>
          {pkg.oldPrice && pkg.oldPrice > 0 && (
            <span className="text-[12px] text-text-tertiary line-through">{pkg.oldPrice.toLocaleString()}đ</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-[11px] font-bold bg-bg-surface px-2 py-1 rounded text-text-secondary">{pkg.durationDays} ngày</span>
          <span className="text-[11px] font-bold bg-bg-surface px-2 py-1 rounded text-text-secondary">
            {pkg.credits === -1 ? 'Vô hạn' : `${pkg.credits} Credit`}
          </span>
        </div>

        <div className="space-y-2 mb-6">
          {(pkg.features || []).slice(0, 3).map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-[12px] text-text-secondary">
              <span className="material-symbols-outlined text-[14px] text-green-500">check_circle</span>
              {f}
            </div>
          ))}
          {(pkg.features || []).length > 3 && (
            <div className="text-[11px] text-text-tertiary font-medium">... và {(pkg.features || []).length - 3} tính năng khác</div>
          )}
        </div>
      </div>

      <div className="p-6 pt-0 border-t border-border-hairline bg-gray-50/50">
        <div className="flex gap-2 pt-4">
          <button onClick={() => onEdit(pkg)} className="flex-1 py-2 bg-white border border-border-hairline text-text-primary rounded-lg text-[12px] font-bold hover:bg-bg-surface transition-all flex items-center justify-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">edit</span>Sửa
          </button>
          <button onClick={() => onDelete(pkg.id)} className="p-2 bg-white border border-border-hairline text-red-500 rounded-lg hover:bg-red-50 transition-all flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
