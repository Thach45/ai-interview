
import { ExperienceLevel, InterviewLanguage, InterviewMode, InterviewPersona } from "../../../shared/types/interview";


export type SetupInterviewRequest = {
  cvId: string;
  jobTemplateId?: string | null;
  customJdText?: string | null;
  jobTitle: string;
  companyName?: string | null;
  level: ExperienceLevel;
  language: InterviewLanguage;
  mode: InterviewMode;
  duration: number;
  difficulty: number;
  persona: InterviewPersona;
  focusSkills: string[];
}
