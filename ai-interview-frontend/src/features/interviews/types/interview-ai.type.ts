
import { ExperienceLevel, InterviewLanguage, InterviewMode, InterviewPersona } from "../../../shared/types/interview";


export type SetupInterviewRequest = {
  cvId: string;
  jobDescriptionId?: string | null;
  customJdText?: string | null;
  position: string;
  nameCompany?: string | null;
  level: ExperienceLevel;
  language: InterviewLanguage;
  mode: InterviewMode;
  duration: number;
  difficulty: number;
  persona: InterviewPersona;
  focusSkills: string[];
}
