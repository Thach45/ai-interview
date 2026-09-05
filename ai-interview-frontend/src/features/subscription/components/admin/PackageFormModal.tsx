import { useState } from "react";

interface PackageFormData {
  name: string;
  tagline?: string;
  price: number;
  oldPrice?: number;
  credits: number;
  isPopular: boolean;
  isActive: boolean;
  icon: string;
  features: string[];
}

interface PackageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PackageFormData) => Promise<void>;
  initialData?: PackageFormData | null;
  isSubmitting?: boolean;
}

const DEFAULT_FORM: PackageFormData = {
  name: "",
  tagline: "",
  price: 0,
  oldPrice: 0,
  credits: 10,
  isPopular: false,
  isActive: true,
  icon: "rocket_launch",
  features: [],
};

export function PackageFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: PackageFormModalProps) {
  const [form, setForm] = useState<PackageFormData>(
    initialData || DEFAULT_FORM,
  );
  const [newFeature, setNewFeature] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await onSubmit(form);
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setForm((f) => ({ ...f, features: [...f.features, newFeature.trim()] }));
    setNewFeature("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-text-primary">
            {initialData ? "Chỉnh sửa gói dịch vụ" : "Thêm gói dịch vụ mới"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] text-text-tertiary">
              close
            </span>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto custom-scrollbar"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[12px] font-bold text-text-secondary mb-1.5">
                Tên gói dịch vụ *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-[13px]"
                placeholder="Ví dụ: Chinh Phục, Bứt Phá..."
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[12px] font-bold text-text-secondary mb-1.5">
                Mô tả ngắn
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tagline: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-text-secondary mb-1.5">
                Giá bán (VNĐ) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: Number(e.target.value) }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-text-secondary mb-1.5">
                Giá cũ (VNĐ)
              </label>
              <input
                type="number"
                min={0}
                value={form.oldPrice}
                onChange={(e) =>
                  setForm((f) => ({ ...f, oldPrice: Number(e.target.value) }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-text-secondary mb-1.5">
                Credits *
              </label>
              <input
                type="number"
                required
                min={-1}
                value={form.credits}
                onChange={(e) =>
                  setForm((f) => ({ ...f, credits: Number(e.target.value) }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-[13px]"
              />
              <span className="text-[10px] text-text-tertiary">
                -1 = vô hạn
              </span>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-text-secondary mb-1.5">
                Icon
              </label>
              <select
                value={form.icon}
                onChange={(e) =>
                  setForm((f) => ({ ...f, icon: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-[13px]"
              >
                {[
                  "rocket_launch",
                  "military_tech",
                  "diamond",
                  "auto_awesome",
                  "star",
                  "school",
                ].map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col justify-end gap-3 pb-2.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.isPopular}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isPopular: e.target.checked }))
                  }
                  className="accent-primary"
                />
                <span className="text-[12px] font-bold text-text-secondary">
                  Gói phổ biến
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isActive: e.target.checked }))
                  }
                  className="accent-primary"
                />
                <span className="text-[12px] font-bold text-text-secondary">
                  Mở bán
                </span>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <label className="block text-[12px] font-bold text-text-secondary mb-1.5">
              Tính năng nổi bật
            </label>
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
                onClick={addFeature}
                className="px-4 py-2 bg-primary text-white font-bold rounded-lg text-[12px] hover:brightness-110 transition-colors"
              >
                Thêm
              </button>
            </div>
            <div className="space-y-1.5 max-h-[150px] overflow-y-auto custom-scrollbar">
              {form.features.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-bg-surface-soft p-2 rounded-lg border border-gray-100 text-[12px]"
                >
                  <span className="text-text-secondary">{feat}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        features: f.features.filter((_, j) => j !== i),
                      }))
                    }
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
              onClick={onClose}
              className="px-4 py-2 border border-border-hairline rounded-lg text-[12px] font-bold text-text-secondary hover:bg-bg-surface transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-primary text-white font-bold rounded-lg text-[12px] hover:brightness-110 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu gói"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
