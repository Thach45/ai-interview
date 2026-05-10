export type JobTemplate = {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  location?: string;
  salaryRange?: string;
  employmentType?: string;
  experienceLevel: 'INTERN' | 'FRESHER' | 'JUNIOR' | 'MIDDLE' | 'SENIOR' | 'MANAGER' | 'DIRECTOR';
  isRemote: boolean;
  categoryId?: string;
  categoryName?: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  aiExtractedContext: string;
  isHotJob: boolean;
  status: 'published' | 'draft';
}


