import { type ElementType } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '../../../../shared/utils/cn';

// ===================== SECTION HEADER =====================

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

// ===================== FORM FIELD =====================

export function FormField({
  label, value, onChange, placeholder, multiline, className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
}) {
  const Comp = multiline ? 'textarea' : 'input';
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="text-[11px] font-bold text-gray-700">{label}</label>
      <Comp
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-[13px] font-medium text-gray-800 outline-none transition-all duration-200',
          'placeholder:text-gray-400 placeholder:font-normal',
          'focus:border-[#4b2c9a] focus:ring-1 focus:ring-[#4b2c9a]/20 focus:bg-white',
          multiline ? 'resize-none min-h-[80px]' : 'h-[42px]',
        )}
      />
    </div>
  );
}

// ===================== ARRAY BLOCK (object items) =====================

export function ArrayBlock({
  label, icon, items, fields, onUpdate, onRemove, onAdd,
}: {
  label: string;
  icon: ElementType;
  items: any[];
  fields: { key: string; label: string; placeholder?: string; multiline?: boolean }[];
  onUpdate: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
}) {
  return (
    <div className="space-y-4">
      <SectionHeader icon={icon} title={label} count={items.length} onAdd={onAdd} />
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: i * 0.03 }}
          className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3 relative group hover:shadow-sm hover:border-gray-300 transition-all duration-200"
        >
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200 active:scale-[0.95]"
          >
            <Trash2 className="size-3.5" />
          </button>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            #{i + 1}
          </span>
          <div className="grid grid-cols-2 gap-3">
            {fields.map((f) => (
              <FormField
                key={f.key}
                label={f.label}
                value={item[f.key] ?? ''}
                onChange={(v) => onUpdate(i, f.key, v)}
                placeholder={f.placeholder}
                multiline={f.multiline}
                className={f.multiline ? 'col-span-2' : ''}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ===================== DETAIL ARRAY BLOCK (với details textarea) =====================

export function DetailArrayBlock({
  label, icon, items, fields: customFields, onUpdate, onRemove, onAdd,
}: {
  label: string;
  icon: ElementType;
  items: any[];
  fields?: { key: string; label: string; placeholder?: string; multiline?: boolean }[];
  onUpdate: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
}) {
  const fields = customFields ?? [
    { key: 'company', label: 'Công ty / Tổ chức' },
    { key: 'role', label: 'Vai trò / Vị trí' },
    { key: 'period', label: 'Thời gian' },
    { key: 'details', label: 'Chi tiết', multiline: true },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader icon={icon} title={label} count={items.length} onAdd={onAdd} />
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: i * 0.03 }}
          className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3 relative group hover:shadow-sm hover:border-gray-300 transition-all duration-200"
        >
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200 active:scale-[0.95]"
          >
            <Trash2 className="size-3.5" />
          </button>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            #{i + 1}
          </span>
          <div className="grid grid-cols-2 gap-3">
            {fields.map((f) =>
              f.key === 'details' ? (
                <FormField
                  key={f.key}
                  label={f.label}
                  value={Array.isArray(item[f.key]) ? item[f.key].join('\n') : (item[f.key] ?? '')}
                  onChange={(v) => onUpdate(i, f.key, v.split('\n').filter((l: string) => l.trim()))}
                  placeholder="Mỗi dòng là một ý chi tiết"
                  multiline
                  className="col-span-2"
                />
              ) : (
                <FormField
                  key={f.key}
                  label={f.label}
                  value={item[f.key] ?? ''}
                  onChange={(v) => onUpdate(i, f.key, v)}
                  placeholder={f.label === 'Thời gian' ? '2020 - 2024' : ''}
                />
              ),
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
