import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "../../layouts/AdminLayout";
import subscriptionApi from "../../features/subscription/api/subscription.api";
import type { SubscriptionPackage as Package } from "../../features/subscription/api/subscription.api";
import { toast } from "sonner";
import { PackageCard } from "../../features/subscription/components/admin/PackageCard";
import { PackageFormModal } from "../../features/subscription/components/admin/PackageFormModal";

export const AdminPackagesPage = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  const fetchPackages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await subscriptionApi.adminGetPackages();
      setPackages(response.data);
    } catch {
      toast.error("Không thể tải danh sách gói dịch vụ");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleSubmit = async (data: any) => {
    try {
      if (editingPackage) {
        await subscriptionApi.adminUpdatePackage(editingPackage.id, data);
        toast.success("Cập nhật thành công! 🎉");
      } else {
        await subscriptionApi.adminCreatePackage(data);
        toast.success("Thêm gói mới thành công! 🚀");
      }
      setIsFormOpen(false);
      fetchPackages();
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi lưu");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa gói dịch vụ này không?"))
      return;
    try {
      await subscriptionApi.adminDeletePackage(id);
      toast.success("Xóa gói dịch vụ thành công!");
      fetchPackages();
    } catch (error: any) {
      toast.error(error.message || "Không thể xóa");
    }
  };

  return (
    <AdminLayout
      title="Quản lý Gói dịch vụ"
      rightAction={
        <button
          onClick={() => {
            setEditingPackage(null);
            setIsFormOpen(true);
          }}
          className="bg-primary text-white px-5 py-2 rounded-lg font-bold text-[12px] hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>Thêm
          gói mới
        </button>
      }
    >
      <div className="flex flex-col gap-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[300px] bg-white border border-gray-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
            <span className="material-symbols-outlined text-[48px] text-gray-300 mb-2">
              inventory_2
            </span>
            <p className="text-text-tertiary">
              Chưa có gói dịch vụ nào. Hãy nhấn "Thêm gói mới"!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onEdit={(p) => {
                  setEditingPackage(p as Package);
                  setIsFormOpen(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <PackageFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={
          editingPackage
            ? {
                name: editingPackage.name,
                tagline: editingPackage.tagline,
                price: editingPackage.price,
                oldPrice: editingPackage.oldPrice,
                credits: editingPackage.credits,
                isPopular: editingPackage.isPopular,
                isActive: editingPackage.isActive ?? true,
                icon: editingPackage.icon || "rocket_launch",
                features: editingPackage.features || [],
              }
            : null
        }
      />
    </AdminLayout>
  );
};
