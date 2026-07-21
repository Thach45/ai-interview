export interface BuilderCv {
  id: string;
  userId: string;
  templateId: string;
  title: string;
  cvData: string; // JSON string
  renderedHtml: string;
  fileUrl: string | null;
  createdAt: string;
  updatedAt: string;
  template?: {
    id: string;
    name: string;
    thumbnailUrl: string;
    htmlStructure?: string;
    cssStyles?: string;
  };
  aiModifications?: AiModification[];
}

export interface AiModification {
  id: number;
  type: string;
  title: string;
  desc: string;
}

/** Dữ liệu CV form dùng trong Builder — khớp với template Handlebars */
export interface CvFormData {
  fullName: string;
  jobTitle: string;
  objective: string;
  contact: {
    address: string;
    phone: string;
    email: string;
    birthday: string;
  };
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  hardSkills: string[];
  computerSkills: Skill[];
  languages: Skill[];
  certifications: Certification[];
  activities: Activity[];
  references: Reference[];
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  details: string[];
}

export interface Education {
  school: string;
  degree: string;
  period: string;
  details: string[];
}

export interface Project {
  name: string;
  role: string;
  period: string;
  details: string[];
}

export interface Skill {
  name: string;
  level: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface Activity {
  name: string;
  role: string;
  period: string;
  details: string[];
}

export interface Reference {
  name: string;
  role: string;
  phone: string;
}

/** Giá trị mặc định cho form CV */
export const DEFAULT_CV_FORM: CvFormData = {
  fullName: "",
  jobTitle: "",
  objective: "",
  contact: {
    address: "",
    phone: "",
    email: "",
    birthday: "",
  },
  experiences: [{ company: "", role: "", period: "", details: [""] }],
  education: [{ school: "", degree: "", period: "", details: [""] }],
  projects: [{ name: "", role: "", period: "", details: [""] }],
  hardSkills: [""],
  computerSkills: [{ name: "", level: "" }],
  languages: [{ name: "", level: "" }],
  certifications: [{ name: "", issuer: "", year: "" }],
  activities: [{ name: "", role: "", period: "", details: [""] }],
  references: [{ name: "", role: "", phone: "" }],
};
