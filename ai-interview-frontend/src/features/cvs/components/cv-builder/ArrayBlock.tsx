import { type ElementType } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { FormField } from './FormField';

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
