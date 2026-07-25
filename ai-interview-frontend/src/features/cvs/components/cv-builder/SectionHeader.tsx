import { type ElementType } from 'react';
import { Plus } from 'lucide-react';

export function SectionHeader({
  icon: Icon,
  title,
  count,
  onAdd,
}: {
  icon: ElementType;
  title: string;
  count?: number;
  onAdd?: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-[#f0ecfc] flex items-center justify-center">
          <Icon className="size-4 text-[#4b2c9a]" />
        </div>
        <div>
          <span className="text-[14px] font-bold text-gray-800">{title}</span>
          {count !== undefined && (
            <span className="ml-2 text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md">
              {count}
            </span>
          )}
        </div>
      </div>
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1 text-[11px] font-bold text-[#4b2c9a] hover:text-[#3d2380] transition-colors active:scale-[0.97]"
        >
          <Plus className="size-3.5" />
          THÊM
        </button>
      )}
    </div>
  );
}
