import { type ElementType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Briefcase, FolderGit2, GraduationCap, Wrench, Globe, Award, User, Sparkles,
  Plus, XCircle, Trash2, CheckCircle2, Circle,
} from 'lucide-react';
import { cn } from '../../../../shared/utils/cn';
import type { CvFormData } from '../../type/builder-cv.type';
import { FORM_SECTIONS, type FormSection, isSectionComplete } from './builder-types';
import { SectionHeader, FormField, ArrayBlock, DetailArrayBlock } from './builder-components';

// ===================== PROPS =====================

interface FormPanelProps {
  cvData: CvFormData;
  activeSection: string;
  onSectionChange: (id: string) => void;
  completedCount: number;
  sectionStatus: Record<string, boolean>;
  onUpdateField: <K extends keyof CvFormData>(key: K, value: CvFormData[K]) => void;
  onUpdateNested: <K extends keyof CvFormData>(parent: K, field: string, value: any) => void;
  onUpdateArrayItem: (key: keyof CvFormData, index: number, field: string, value: any) => void;
  onUpdateStringItem: (key: keyof CvFormData, index: number, value: string) => void;
  onAddArrayItem: (key: keyof CvFormData, emptyItem: any) => void;
  onRemoveArrayItem: (key: keyof CvFormData, index: number) => void;
}

// ===================== FORM PANEL =====================

export function FormPanel({
  cvData,
  activeSection,
  onSectionChange,
  sectionStatus,
  onUpdateField,
  onUpdateNested,
  onUpdateArrayItem,
  onUpdateStringItem,
  onAddArrayItem,
  onRemoveArrayItem,
}: FormPanelProps) {
  const router = useRouter();

  return (
    <div className="h-full flex flex-col bg-[#f8f9fa] border-r border-gray-200 overflow-hidden w-full lg:w-[480px] shrink-0">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 shrink-0 flex flex-col gap-5 bg-white shadow-sm z-10 relative">
        <button
          onClick={() => router.push('/cv-builder/templates')}
          className="flex items-center text-[#4b2c9a] hover:text-[#3d2380] transition-colors w-fit font-semibold text-sm"
        >
          <ArrowLeft className="size-5 mr-1" />
          Quay lại
        </button>

        {/* Fake Progress Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-[12px] font-bold">
            <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded text-[10px]">
              15% <span className="text-gray-700 ml-1">Điểm hồ sơ</span>
            </span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
              +85% <span className="text-gray-700 ml-1">Thêm thông tin cơ bản</span>
            </span>
          </div>
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 w-[15%] rounded-full" />
          </div>
        </div>

        {/* Section Tabs (Scrollable) */}
        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1 -mx-2 px-2">
          {FORM_SECTIONS.map((s) => {
            const Icon = s.icon;
            const isActive = activeSection === s.id;
            const isComplete = sectionStatus[s.id];
            return (
              <button
                key={s.id}
                onClick={() => onSectionChange(s.id)}
                className={cn(
                  'flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-bold transition-all border shrink-0',
                  isActive
                    ? 'bg-white text-primary border-primary shadow-sm'
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50',
                  isComplete && !isActive && 'text-emerald-600 border-emerald-200 bg-emerald-50',
                )}
              >
                <Icon className="size-3.5" />
                {s.label}
                {isComplete && !isActive && <CheckCircle2 className="size-3 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 custom-scrollbar">
        <h2 className="text-[16px] font-bold text-gray-800 mb-4 ml-1">
          {FORM_SECTIONS.find((s) => s.id === activeSection)?.label || 'Thông tin'}
        </h2>

        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-5 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="space-y-5"
            >
              <SectionRenderer
                id={activeSection}
                cvData={cvData}
                onUpdateField={onUpdateField}
                onUpdateNested={onUpdateNested}
                onUpdateArrayItem={onUpdateArrayItem}
                onUpdateStringItem={onUpdateStringItem}
                onAddArrayItem={onAddArrayItem}
                onRemoveArrayItem={onRemoveArrayItem}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ===================== SECTION RENDERER =====================

interface SectionRendererProps {
  id: string;
  cvData: CvFormData;
  onUpdateField: FormPanelProps['onUpdateField'];
  onUpdateNested: FormPanelProps['onUpdateNested'];
  onUpdateArrayItem: FormPanelProps['onUpdateArrayItem'];
  onUpdateStringItem: FormPanelProps['onUpdateStringItem'];
  onAddArrayItem: FormPanelProps['onAddArrayItem'];
  onRemoveArrayItem: FormPanelProps['onRemoveArrayItem'];
}

function SectionRenderer({
  id, cvData,
  onUpdateField, onUpdateNested, onUpdateArrayItem, onUpdateStringItem,
  onAddArrayItem, onRemoveArrayItem,
}: SectionRendererProps) {
  switch (id) {
    case 'personal':
      return <PersonalSection cvData={cvData} onUpdateField={onUpdateField} onUpdateNested={onUpdateNested} />;
    case 'summary':
      return <SummarySection cvData={cvData} onUpdateField={onUpdateField} />;
    case 'experience':
      return (
        <DetailArrayBlock
          label="Kinh nghiệm làm việc"
          icon={Briefcase}
          items={cvData.experiences}
          onUpdate={onUpdateArrayItem.bind(null, 'experiences')}
          onRemove={onRemoveArrayItem.bind(null, 'experiences')}
          onAdd={onAddArrayItem.bind(null, 'experiences', { company: '', role: '', period: '', details: [''] })}
        />
      );
    case 'education':
      return (
        <DetailArrayBlock
          label="Học vấn"
          icon={GraduationCap}
          items={cvData.education}
          fields={[
            { key: 'school', label: 'Trường / Tổ chức' },
            { key: 'degree', label: 'Bằng cấp / Chuyên ngành' },
            { key: 'period', label: 'Thời gian' },
            { key: 'details', label: 'Chi tiết', multiline: true },
          ]}
          onUpdate={onUpdateArrayItem.bind(null, 'education')}
          onRemove={onRemoveArrayItem.bind(null, 'education')}
          onAdd={onAddArrayItem.bind(null, 'education', { school: '', degree: '', period: '', details: [''] })}
        />
      );
    case 'projects':
      return (
        <DetailArrayBlock
          label="Dự án"
          icon={FolderGit2}
          items={cvData.projects}
          fields={[
            { key: 'name', label: 'Tên dự án' },
            { key: 'role', label: 'Vai trò' },
            { key: 'period', label: 'Thời gian' },
            { key: 'details', label: 'Chi tiết', multiline: true },
          ]}
          onUpdate={onUpdateArrayItem.bind(null, 'projects')}
          onRemove={onRemoveArrayItem.bind(null, 'projects')}
          onAdd={onAddArrayItem.bind(null, 'projects', { name: '', role: '', period: '', details: [''] })}
        />
      );
    case 'skills':
      return (
        <SkillsSection
          cvData={cvData}
          onUpdateStringItem={onUpdateStringItem}
          onAddArrayItem={onAddArrayItem}
          onRemoveArrayItem={onRemoveArrayItem}
        />
      );
    case 'computer':
      return (
        <SimpleSkillSection
          label="Tin học"
          icon={Wrench}
          items={cvData.computerSkills}
          onUpdate={onUpdateArrayItem.bind(null, 'computerSkills')}
          onRemove={onRemoveArrayItem.bind(null, 'computerSkills')}
          onAdd={onAddArrayItem.bind(null, 'computerSkills', { name: '', level: '' })}
        />
      );
    case 'languages':
      return (
        <SimpleSkillSection
          label="Ngôn ngữ"
          icon={Globe}
          items={cvData.languages}
          onUpdate={onUpdateArrayItem.bind(null, 'languages')}
          onRemove={onRemoveArrayItem.bind(null, 'languages')}
          onAdd={onAddArrayItem.bind(null, 'languages', { name: '', level: '' })}
        />
      );
    case 'certifications':
      return (
        <ArrayBlock
          label="Chứng chỉ"
          icon={Award}
          items={cvData.certifications}
          fields={[
            { key: 'name', label: 'Tên chứng chỉ', placeholder: 'AWS Solutions Architect' },
            { key: 'issuer', label: 'Tổ chức cấp', placeholder: 'Amazon' },
            { key: 'year', label: 'Năm', placeholder: '2024' },
          ]}
          onUpdate={onUpdateArrayItem.bind(null, 'certifications')}
          onRemove={onRemoveArrayItem.bind(null, 'certifications')}
          onAdd={onAddArrayItem.bind(null, 'certifications', { name: '', issuer: '', year: '' })}
        />
      );
    case 'activities':
      return (
        <DetailArrayBlock
          label="Hoạt động"
          icon={Briefcase}
          items={cvData.activities}
          fields={[
            { key: 'name', label: 'Tên hoạt động' },
            { key: 'role', label: 'Vai trò' },
            { key: 'period', label: 'Thời gian' },
            { key: 'details', label: 'Chi tiết', multiline: true },
          ]}
          onUpdate={onUpdateArrayItem.bind(null, 'activities')}
          onRemove={onRemoveArrayItem.bind(null, 'activities')}
          onAdd={onAddArrayItem.bind(null, 'activities', { name: '', role: '', period: '', details: [''] })}
        />
      );
    case 'references':
      return (
        <ArrayBlock
          label="Người tham khảo"
          icon={User}
          items={cvData.references}
          fields={[
            { key: 'name', label: 'Họ và tên', placeholder: 'Nguyễn Văn B' },
            { key: 'role', label: 'Chức vụ', placeholder: 'Trưởng phòng' },
            { key: 'phone', label: 'SĐT', placeholder: '+84 123 456 789' },
          ]}
          onUpdate={onUpdateArrayItem.bind(null, 'references')}
          onRemove={onRemoveArrayItem.bind(null, 'references')}
          onAdd={onAddArrayItem.bind(null, 'references', { name: '', role: '', phone: '' })}
        />
      );
    default:
      return null;
  }
}

// ===================== SECTION: PERSONAL =====================

function PersonalSection({ cvData, onUpdateField, onUpdateNested }: {
  cvData: CvFormData;
  onUpdateField: FormPanelProps['onUpdateField'];
  onUpdateNested: FormPanelProps['onUpdateNested'];
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Họ và tên"
          value={cvData.fullName}
          onChange={(v) => onUpdateField('fullName', v)}
          placeholder="Nguyễn Hoàng Thạch"
          className="col-span-2 lg:col-span-1"
        />
        <FormField
          label="Tiêu đề hồ sơ"
          value={cvData.jobTitle}
          onChange={(v) => onUpdateField('jobTitle', v)}
          placeholder="VD: Nhân viên kinh doanh bất động sản"
          className="col-span-2 lg:col-span-1"
        />
        <FormField
          label="Email"
          value={cvData.contact.email}
          onChange={(v) => onUpdateNested('contact', 'email', v)}
          placeholder="email@gmail.com"
          className="col-span-2 lg:col-span-1"
        />
        <FormField
          label="Số điện thoại"
          value={cvData.contact.phone}
          onChange={(v) => onUpdateNested('contact', 'phone', v)}
          placeholder="Điền số điện thoại"
          className="col-span-2 lg:col-span-1"
        />
        <FormField
          label="Địa chỉ"
          value={cvData.contact.address}
          onChange={(v) => onUpdateNested('contact', 'address', v)}
          placeholder="HCM"
          className="col-span-2"
        />
      </div>
    </div>
  );
}

// ===================== SECTION: SUMMARY =====================

function SummarySection({ cvData, onUpdateField }: {
  cvData: CvFormData;
  onUpdateField: FormPanelProps['onUpdateField'];
}) {
  return (
    <div className="space-y-4">
      <FormField
        label="Mục tiêu nghề nghiệp"
        value={cvData.objective}
        onChange={(v) => onUpdateField('objective', v)}
        placeholder="Giới thiệu sơ bản thân thông qua mong muốn, mục tiêu của bạn khi đi làm."
        multiline
        className="col-span-2"
      />
      <div className="text-right text-[10px] text-gray-400">
        Số ký tự tối ưu: {cvData.objective?.length || 0}/200
      </div>
    </div>
  );
}

// ===================== SECTION: SKILLS (string[]) =====================

function SkillsSection({ cvData, onUpdateStringItem, onAddArrayItem, onRemoveArrayItem }: {
  cvData: CvFormData;
  onUpdateStringItem: FormPanelProps['onUpdateStringItem'];
  onAddArrayItem: FormPanelProps['onAddArrayItem'];
  onRemoveArrayItem: FormPanelProps['onRemoveArrayItem'];
}) {
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={Wrench}
        title="Kỹ năng chuyên môn"
        count={cvData.hardSkills.filter((s) => s.trim()).length}
        onAdd={() => onAddArrayItem('hardSkills', '')}
      />
      <div className="flex flex-wrap gap-2">
        {cvData.hardSkills.map((skill, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 pl-3.5 pr-1.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl group transition-all"
          >
            <input
              value={skill}
              onChange={(e) => onUpdateStringItem('hardSkills', i, e.target.value)}
              placeholder="Nhập kỹ năng..."
              className="bg-transparent outline-none text-[12px] font-medium text-gray-800 w-[100px] placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => onRemoveArrayItem('hardSkills', i)}
              className="w-5 h-5 rounded-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <XCircle className="size-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== SECTION: COMPUTER SKILLS / LANGUAGES =====================

function SimpleSkillSection({
  label, icon, items, onUpdate, onRemove, onAdd,
}: {
  label: string;
  icon: ElementType;
  items: { name: string; level: string }[];
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
}) {
  return (
    <div className="space-y-4">
      <SectionHeader icon={icon} title={label} count={items.length} onAdd={onAdd} />
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-end gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <FormField
              label={label === 'Ngôn ngữ' ? 'Ngôn ngữ' : 'Kỹ năng'}
              value={item.name}
              onChange={(v) => onUpdate(i, 'name', v)}
              placeholder={label === 'Ngôn ngữ' ? 'Tiếng Anh' : 'Excel, Python...'}
            />
            <FormField
              label="Trình độ"
              value={item.level}
              onChange={(v) => onUpdate(i, 'level', v)}
              placeholder={label === 'Ngôn ngữ' ? 'IELTS 7.0' : 'Trung cấp'}
            />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="mb-1 w-9 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
