import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import subscriptionApi from '../../features/subscription/api/subscription.api';
import type { SubscriptionPackage as Package } from '../../features/subscription/api/subscription.api';
import { toast } from 'sonner';

export const AdminPackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [oldPrice, setOldPrice] = useState<number>(0);
  const [durationDays, setDurationDays] = useState<number>(30);
  const [credits, setCredits] = useState<number>(10);
  const [isPopular, setIsPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [icon, setIcon] = useState('rocket_launch');
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const response = await subscriptionApi.adminGetPackages();
      setPackages(response.data);
    } catch (error) {
      toast.error('Không thể tải danh sách gói dịch vụ');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const openAddModal = () => {
    setEditingPackage(null);
    setName('');
    setTagline('');
    setPrice(0);
    setOldPrice(0);
    setDurationDays(30);
    setCredits(10);
    setIsPopular(false);
    setIsActive(true);
    setIcon('rocket_launch');
    setFeatures([]);
    setNewFeature('');
    setIsFormOpen(true);
  };

  const openEditModal = (pkg: Package) => {
    setEditingPackage(pkg);
    setName(pkg.name);
    setTagline(pkg.tagline || '');
    setPrice(pkg.price);
    setOldPrice(pkg.oldPrice || 0);
    setDurationDays(pkg.durationDays);
    setCredits(pkg.credits);
    setIsPopular(pkg.isPopular || false);
    setIsActive(pkg.isActive !== undefined ? pkg.isActive : true);
    setIcon(pkg.icon || 'rocket_launch');
    setFeatures(pkg.features || []);
    setNewFeature('');
    setIsFormOpen(true);
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setFeatures([...features, newFeature.trim()]);
    setNewFeature('');
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên gói');
      return;
    }

    const payload = {
      name: name.trim(),
      tagline: tagline.trim() || undefined,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      durationDays: Number(durationDays),
      credits: Number(credits),
      isPopular,
      isActive,
      icon,
      features
    };

    try {
      if (editingPackage) {
        await subscriptionApi.adminUpdatePackage(editingPackage.id, payload);
        toast.success('Cập nhật gói dịch vụ thành công! 🎉');
      } else {
        await subscriptionApi.adminCreatePackage(payload);
        toast.success('Thêm gói dịch vụ mới thành công! 🚀');
      }
      setIsFormOpen(false);
      fetchPackages();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi lưu';
      toast.error(msg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa gói dịch vụ này không?')) return;

    try {
      await subscriptionApi.adminDeletePackage(id);
      toast.success('Xóa gói dịch vụ thành công!');
      fetchPackages();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Không thể xóa gói dịch vụ';
      toast.error(msg);
    }
  };

  const headerActions = (
    <button 
      onClick={openAddModal}
      className="bg-primary text-white px-5 py-2 rounded-lg font-bold text-[12px] hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
    >
      <span className="material-symbols-outlined text-[18px]">add</span>
      Thêm gói mới
    </button>
  );

  return (
    <AdminLayout title="Quản lý Gói dịch vụ" rightAction={headerActions}>
      <div className="flex flex-col gap-6">
        {isLoading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[300px] bg-white border border-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
            <span className="material-symbols-outlined text-[48px] text-gray-300 mb-2">inventory_2</span>
            <p className="text-text-tertiary">Chưa có gói dịch vụ nào. Hãy nhấn "Thêm gói mới"!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white border border-border-hairline rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
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
                        <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          Phổ biến
                        </span>
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
                    <span className="text-[11px] font-bold bg-bg-surface px-2 py-1 rounded text-text-secondary">
                      {pkg.durationDays} ngày
                    </span>
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
                      <div className="text-[11px] text-text-tertiary font-medium">... và {pkg.features.length - 3} tính năng khác</div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-border-hairline bg-gray-50/50">
                  <div className="flex gap-2 pt-4">
                    <button 
                      onClick={() => openEditModal(pkg)}
                      className="flex-1 py-2 bg-white border border-border-hairline text-text-primary rounded-lg text-[12px] font-bold hover:bg-bg-surface transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(pkg.id)}
                      className="p-2 bg-white border border-border-hairline text-red-500 rounded-lg hover:bg-red-50 transition-all flex items-center justify-center shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Dialog Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
          
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-text-primary">
                {editingPackage ? 'Chỉnh sửa gói dịch vụ' : 'Thêm gói dịch vụ mới'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                <span className="material-symbols-outlined text-[20px] text-text-tertiary">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[12px] font-bold text-text-secondary mb-1.5">Tên gói dịch vụ *</label>
                  <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-[13px]"
                    placeholder="Ví dụ: Chinh Phục, Bứt Phá..."
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[12px] font-bold text-text-secondary mb-1.5">Mô tả ngắn (Tagline)</label>
                  <input 
                    type="text" 
                    value={tagline} 
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-[13px]"
                    placeholder="Ví dụ: Được chọn nhiều nhất, Dành cho người nghiêm túc..."
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-text-secondary mb-1.5">Giá bán (VNĐ) *</label>
                  <input 
                    type="number" 
                    required 
                    min={0}
                    value={price} 
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-[13px]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-text-secondary mb-1.5">Giá gốc/Giá cũ (VNĐ)</label>
                  <input 
                    type="number" 
                    min={0}
                    value={oldPrice} 
                    onChange={(e) => setOldPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-[13px]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-text-secondary mb-1.5">Thời hạn (Ngày) *</label>
                  <input 
                    type="number" 
                    required 
                    min={1}
                    value={durationDays} 
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-[13px]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-text-secondary mb-1.5">Số Credits cộng thêm *</label>
                  <input 
                    type="number" 
                    required 
                    min={-1}
                    value={credits} 
                    onChange={(e) => setCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-[13px]"
                  />
                  <span className="text-[10px] text-text-tertiary">Điền -1 nếu muốn cộng vô hạn lượt phỏng vấn.</span>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-text-secondary mb-1.5">Icon đại diện (Material Name)</label>
                  <select 
                    value={icon} 
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-[13px]"
                  >
                    <option value="rocket_launch">rocket_launch (Tên lửa)</option>
                    <option value="military_tech">military_tech (Huy chương)</option>
                    <option value="diamond">diamond (Kim cương)</option>
                    <option value="auto_awesome">auto_awesome (Lấp lánh)</option>
                    <option value="star">star (Ngôi sao)</option>
                    <option value="school">school (Mũ học vấn)</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end gap-3 pb-2.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={isPopular} 
                      onChange={(e) => setIsPopular(e.target.checked)}
                      className="accent-primary"
                    />
                    <span className="text-[12px] font-bold text-text-secondary">Đặt làm gói phổ biến</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={isActive} 
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="accent-primary"
                    />
                    <span className="text-[12px] font-bold text-text-secondary">Mở bán gói này</span>
                  </label>
                </div>
              </div>

              {/* Features List Section */}
              <div className="border-t border-gray-100 pt-4">
                <label className="block text-[12px] font-bold text-text-secondary mb-1.5">Tính năng nổi bật</label>
                <div className="flex gap-2 mb-3">
                  <input 
                    type="text" 
                    value={newFeature} 
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-[13px]"
                    placeholder="Ví dụ: AI Feedback chuyên sâu..."
                  />
                  <button 
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-primary text-white font-bold rounded-lg text-[12px] hover:brightness-110 transition-colors"
                  >
                    Thêm
                  </button>
                </div>

                <div className="space-y-1.5 max-h-[150px] overflow-y-auto custom-scrollbar">
                  {features.map((feat, index) => (
                    <div key={index} className="flex items-center justify-between bg-bg-surface-soft p-2 rounded-lg border border-gray-100 text-[12px]">
                      <span className="text-text-secondary">{feat}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-500 hover:text-red-700 font-bold px-1.5"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-end gap-3 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-border-hairline rounded-lg text-[12px] font-bold text-text-secondary hover:bg-bg-surface transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-primary text-white font-bold rounded-lg text-[12px] hover:brightness-110 transition-colors"
                >
                  Lưu gói
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
