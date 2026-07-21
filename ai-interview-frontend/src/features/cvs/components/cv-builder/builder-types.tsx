import type { ElementType } from 'react';
import {
  User, Sparkles, Briefcase, GraduationCap, FolderGit2, Wrench, Globe, Award,
} from 'lucide-react';
import type { CvFormData } from '../../type/builder-cv.type';
import { DEFAULT_CV_FORM } from '../../type/builder-cv.type';

export const STORAGE_KEY = 'cv-builder-draft';
export const AUTOSAVE_DELAY = 3000;

// ===================== FORM SECTIONS =====================

export interface FormSection {
  id: string;
  label: string;
  icon: ElementType;
  group: 'header' | 'content' | 'extra';
}

export const FORM_SECTIONS: FormSection[] = [
  { id: 'personal', label: 'Thông tin cá nhân', icon: User, group: 'header' },
  { id: 'summary', label: 'Tóm tắt nghề nghiệp', icon: Sparkles, group: 'header' },
  { id: 'experience', label: 'Kinh nghiệm làm việc', icon: Briefcase, group: 'content' },
  { id: 'education', label: 'Học vấn', icon: GraduationCap, group: 'content' },
  { id: 'projects', label: 'Dự án', icon: FolderGit2, group: 'content' },
  { id: 'skills', label: 'Kỹ năng chuyên môn', icon: Wrench, group: 'content' },
  { id: 'computer', label: 'Tin học', icon: Wrench, group: 'extra' },
  { id: 'languages', label: 'Ngôn ngữ', icon: Globe, group: 'extra' },
  { id: 'certifications', label: 'Chứng chỉ', icon: Award, group: 'extra' },
  { id: 'activities', label: 'Hoạt động', icon: Briefcase, group: 'extra' },
  { id: 'references', label: 'Người tham khảo', icon: User, group: 'extra' },
];

// ===================== SECTION COMPLETION CHECKER =====================

export function isSectionComplete(id: string, data: CvFormData): boolean {
  switch (id) {
    case 'personal':
      return !!(data.fullName?.trim() && data.jobTitle?.trim() && data.contact?.email?.trim());
    case 'summary':
      return !!(data.objective?.trim().length > 10);
    case 'experience':
      return data.experiences.some(e => e.company?.trim() || e.role?.trim());
    case 'education':
      return data.education.some(e => e.school?.trim());
    case 'projects':
      return data.projects.some(p => p.name?.trim());
    case 'skills':
      return data.hardSkills.some(s => s.trim());
    case 'computer':
      return data.computerSkills.some(c => c.name?.trim());
    case 'languages':
      return data.languages.some(l => l.name?.trim());
    case 'certifications':
      return data.certifications.some(c => c.name?.trim());
    case 'activities':
      return data.activities.some(a => a.name?.trim());
    case 'references':
      return data.references.some(r => r.name?.trim());
    default:
      return false;
  }
}

// ===================== HELPERS =====================

/** Merge dữ liệu loaded với DEFAULT để tránh undefined fields */
export function safeMergeCvData(loaded: Partial<CvFormData>): CvFormData {
  const def = DEFAULT_CV_FORM;
  return {
    ...def,
    ...loaded,
    contact: { ...def.contact, ...(loaded.contact || {}) },
    experiences: loaded.experiences?.length
      ? loaded.experiences.map((e) => ({ ...def.experiences[0], ...e, details: e.details?.length ? e.details : [''] }))
      : def.experiences,
    education: loaded.education?.length
      ? loaded.education.map((e) => ({ ...def.education[0], ...e, details: e.details?.length ? e.details : [''] }))
      : def.education,
    projects: loaded.projects?.length
      ? loaded.projects.map((p) => ({ ...def.projects[0], ...p, details: p.details?.length ? p.details : [''] }))
      : def.projects,
    hardSkills: loaded.hardSkills?.length ? loaded.hardSkills : def.hardSkills,
    computerSkills: loaded.computerSkills?.length
      ? loaded.computerSkills.map((c) => ({ ...def.computerSkills[0], ...c }))
      : def.computerSkills,
    languages: loaded.languages?.length
      ? loaded.languages.map((l) => ({ ...def.languages[0], ...l }))
      : def.languages,
    certifications: loaded.certifications?.length
      ? loaded.certifications.map((c) => ({ ...def.certifications[0], ...c }))
      : def.certifications,
    activities: loaded.activities?.length
      ? loaded.activities.map((a) => ({ ...def.activities[0], ...a, details: a.details?.length ? a.details : [''] }))
      : def.activities,
    references: loaded.references?.length
      ? loaded.references.map((r) => ({ ...def.references[0], ...r }))
      : def.references,
  };
}

export function getEmptyItem(key: keyof CvFormData): any {
  const map: Record<string, any> = {
    experiences: { company: '', role: '', period: '', details: [''] },
    education: { school: '', degree: '', period: '', details: [''] },
    projects: { name: '', role: '', period: '', details: [''] },
    hardSkills: '',
    computerSkills: { name: '', level: '' },
    languages: { name: '', level: '' },
    certifications: { name: '', issuer: '', year: '' },
    activities: { name: '', role: '', period: '', details: [''] },
    references: { name: '', role: '', phone: '' },
  };
  return map[key] || '';
}
