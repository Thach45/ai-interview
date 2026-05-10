import React, { useState } from 'react';
import type { JobTemplate } from '../types/types';


interface JobTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: JobTemplate | null;
}

export const JobTemplateModal: React.FC<JobTemplateModalProps> = ({ isOpen, onClose, template }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'ai'>('basic');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <div className="bg-bg-canvas w-full max-w-[900px] max-h-[90vh] rounded-xl shadow-2xl border border-border-hairline flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-border-hairline flex justify-between items-center bg-bg-surface-soft">
          <div className="flex items-center gap-3">
            <div className="size-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-text-primary leading-tight">
                {template ? 'Cập nhật mẫu JD' : 'Thiết kế mẫu JD mới'}
              </h3>
              <p className="text-[11px] text-text-tertiary uppercase font-bold tracking-[0.5px]">Thư viện JD chuẩn hóa</p>
            </div>
          </div>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-full hover:bg-bg-surface text-text-tertiary transition-all">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tabs Trigger */}
        <div className="px-6 bg-bg-surface-soft border-b border-border-hairline flex gap-8">
          {[
            { id: 'basic', label: 'Thông tin chung', icon: 'info' },
            { id: 'content', label: 'Nội dung hiển thị', icon: 'description' },
            { id: 'ai', label: 'Tri thức phỏng vấn (AI)', icon: 'psychology' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 text-[13px] font-semibold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-text-tertiary uppercase mb-2">Vị trí tuyển dụng</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-lg outline-none focus:bg-white focus:border-primary/30 transition-all" defaultValue={template?.title} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-text-tertiary uppercase mb-2">Tên công ty</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-lg outline-none focus:bg-white focus:border-primary/30 transition-all" defaultValue={template?.companyName} />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-text-tertiary uppercase mb-2">Địa điểm</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-lg outline-none focus:bg-white focus:border-primary/30 transition-all" defaultValue={template?.location} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-text-tertiary uppercase mb-2">Mức lương</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-lg outline-none focus:bg-white focus:border-primary/30 transition-all" defaultValue={template?.salaryRange} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-text-tertiary uppercase mb-2">Hình thức làm việc</label>
                  <select className="w-full px-3 py-2.5 bg-bg-surface border border-border-hairline rounded-lg outline-none focus:bg-white focus:border-primary/30 transition-all text-[13px]" defaultValue={template?.employmentType}>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-text-tertiary uppercase mb-2">Cấp bậc kinh nghiệm</label>
                  <select className="w-full px-3 py-2.5 bg-bg-surface border border-border-hairline rounded-lg outline-none focus:bg-white focus:border-primary/30 transition-all text-[13px]" defaultValue={template?.experienceLevel}>
                    {['INTERN', 'FRESHER', 'JUNIOR', 'MIDDLE', 'SENIOR', 'MANAGER', 'DIRECTOR'].map(lv => (
                      <option key={lv} value={lv}>{lv}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-6 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" defaultChecked={template?.isRemote} className="size-4 rounded border-border-hairline text-primary" />
                    <span className="text-[13px] font-semibold text-text-secondary group-hover:text-text-primary transition-all">Làm việc từ xa (Remote)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" defaultChecked={template?.isHotJob} className="size-4 rounded border-border-hairline text-orange-500" />
                    <span className="text-[13px] font-semibold text-text-secondary group-hover:text-orange-500 transition-all">Vị trí nổi bật</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold text-text-tertiary uppercase mb-2">Trách nhiệm (Responsibilities)</label>
                <textarea rows={3} className="w-full px-4 py-3 bg-bg-surface border border-border-hairline rounded-lg outline-none focus:bg-white focus:border-primary/30 transition-all text-[14px]" defaultValue={template?.responsibilities}></textarea>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-text-tertiary uppercase mb-2">Yêu cầu kỹ năng (Requirements)</label>
                <textarea rows={3} className="w-full px-4 py-3 bg-bg-surface border border-border-hairline rounded-lg outline-none focus:bg-white focus:border-primary/30 transition-all text-[14px]" defaultValue={template?.requirements}></textarea>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-text-tertiary uppercase mb-2">Quyền lợi (Benefits)</label>
                <textarea rows={3} className="w-full px-4 py-3 bg-bg-surface border border-border-hairline rounded-lg outline-none focus:bg-white focus:border-primary/30 transition-all text-[14px]" defaultValue={template?.benefits}></textarea>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="bg-primary/5 border border-primary/10 p-4 rounded-lg flex gap-3">
                <span className="material-symbols-outlined text-primary">psychology</span>
                <p className="text-[13px] text-primary/80 leading-relaxed font-medium">
                  Trường <strong>tri thức phỏng vấn</strong> này sẽ được AI sử dụng làm tri thức nền để đặt câu hỏi. Hãy cung cấp bối cảnh chuyên sâu nhất để tối ưu hóa phỏng vấn.
                </p>
              </div>
              <textarea rows={10} className="w-full px-4 py-4 bg-bg-surface border border-border-hairline rounded-lg outline-none focus:bg-white focus:border-primary/30 transition-all text-[14px] font-mono leading-relaxed" placeholder="Nhập tri thức AI tại đây..." defaultValue={template?.aiExtractedContext}></textarea>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-5 border-t border-border-hairline bg-bg-surface-soft flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-2.5 text-[13px] font-bold text-text-secondary hover:text-text-primary">Hủy bỏ</button>
          <button className="bg-primary text-white px-10 py-2.5 rounded-lg text-[13px] font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};
