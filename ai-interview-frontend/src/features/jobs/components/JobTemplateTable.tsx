import React from 'react';
import type { JobTemplate } from '../../admin/jobs/types';


interface JobTemplateTableProps {
  templates: JobTemplate[];
  onEdit: (template: JobTemplate) => void;
  onDelete: (id: string) => void;
}

export const JobTemplateTable: React.FC<JobTemplateTableProps> = ({ templates, onEdit, onDelete }) => {
  return (
    <div className="bg-bg-canvas rounded-xl border border-border-hairline shadow-sm overflow-hidden">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-bg-surface-soft border-b border-border-hairline">
            <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Thông tin Job</th>
            <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Địa điểm</th>
            <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Cấp độ</th>
            <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Remote</th>
            <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px] text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-hairline">
          {templates.map((tpl) => (
            <tr key={tpl.id} className="hover:bg-bg-surface-soft/40 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 bg-bg-surface rounded-lg border border-border-hairline p-1 flex items-center justify-center overflow-hidden shrink-0">
                    {tpl.companyLogo ? (
                      <img src={tpl.companyLogo} alt={tpl.companyName} className="w-full h-full object-contain" />
                    ) : (
                      <span className="material-symbols-outlined text-text-tertiary">corporate_fare</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text-primary text-[14px] truncate">{tpl.title}</span>
                      {tpl.isHotJob && (
                        <span className="material-symbols-outlined text-orange-500 text-[16px] fill-current" title="Vị trí nổi bật">local_fire_department</span>
                      )}
                    </div>
                    <div className="text-text-secondary text-[12px]">{tpl.companyName}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                 <div className="text-[13px] text-text-primary">{tpl.location || 'N/A'}</div>
                 <div className="text-[11px] text-text-tertiary">{tpl.employmentType}</div>
              </td>
              <td className="px-6 py-4">
                <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded uppercase border border-primary/10">
                  {tpl.experienceLevel}
                </span>
              </td>
              <td className="px-6 py-4">
                 <span className={`material-symbols-outlined text-[20px] ${tpl.isRemote ? 'text-emerald-500' : 'text-text-tertiary opacity-30'}`}>
                    {tpl.isRemote ? 'cloud_done' : 'cloud_off'}
                 </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-1">
                  <button onClick={() => onEdit(tpl)} className="p-2 hover:bg-bg-surface text-text-tertiary hover:text-primary rounded-md transition-all">
                    <span className="material-symbols-outlined text-[20px]">edit_note</span>
                  </button>
                  <button onClick={() => onDelete(tpl.id)} className="p-2 hover:bg-red-50 text-text-tertiary hover:text-red-500 rounded-md transition-all">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="px-6 py-4 bg-bg-surface-soft/50 border-t border-border-hairline flex items-center justify-between">
        <div className="text-[12px] text-text-secondary font-medium">
          Hiển thị <span className="text-text-primary font-bold">1-{templates.length}</span> của <span className="text-text-primary font-bold">{templates.length}</span> mẫu JD
        </div>
        <div className="flex items-center gap-1">
          <button className="size-8 rounded border border-border-hairline bg-white flex items-center justify-center disabled:opacity-30 hover:bg-bg-surface transition-all">
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button className="size-8 rounded bg-primary text-white text-[12px] font-bold flex items-center justify-center">1</button>
          <button className="size-8 rounded border border-border-hairline bg-white flex items-center justify-center hover:bg-bg-surface transition-all">
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};


