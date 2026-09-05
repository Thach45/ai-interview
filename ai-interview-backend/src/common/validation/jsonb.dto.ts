import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export type AnalysisPriorityJson = 'HIGH' | 'MEDIUM' | 'LOW';
export type ScoreCategoryJson =
  | 'TECHNICAL_SKILLS'
  | 'EXPERIENCE'
  | 'SOFT_SKILLS'
  | 'EDUCATION'
  | 'PROJECT_RELEVANCE';

export class MetricScoreJsonDto {
  @IsInt()
  @Min(0)
  @Max(100)
  score: number;

  @IsString()
  reason: string;
}

export class GeneralEvaluationJsonDto {
  @IsObject()
  @ValidateNested()
  @Type(() => MetricScoreJsonDto)
  overall: MetricScoreJsonDto;

  @IsObject()
  @ValidateNested()
  @Type(() => MetricScoreJsonDto)
  domain: MetricScoreJsonDto;

  @IsObject()
  @ValidateNested()
  @Type(() => MetricScoreJsonDto)
  problemSolving: MetricScoreJsonDto;

  @IsObject()
  @ValidateNested()
  @Type(() => MetricScoreJsonDto)
  clarity: MetricScoreJsonDto;

  @IsObject()
  @ValidateNested()
  @Type(() => MetricScoreJsonDto)
  confidence: MetricScoreJsonDto;

  @IsObject()
  @ValidateNested()
  @Type(() => MetricScoreJsonDto)
  relevance: MetricScoreJsonDto;
}

export class RubricCriterionJsonDto {
  @IsString()
  id: string;

  @IsString()
  description: string;

  @IsInt()
  @Min(0)
  @Max(100)
  points: number;
}

export class CoreQuestionJsonDto {
  @IsString()
  title: string;

  @IsString()
  reason: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RubricCriterionJsonDto)
  criteria: RubricCriterionJsonDto[];
}

export class CoreQuestionsResponseJsonDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CoreQuestionJsonDto)
  questions: CoreQuestionJsonDto[];
}

export class CriterionMatchJsonDto {
  @IsString()
  criterionId: string;

  @IsNumber()
  @IsIn([0, 0.5, 1])
  partialCredit: number;

  @IsString()
  evidence: string;
}

export class CriterionMatchesJsonDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CriterionMatchJsonDto)
  matches: CriterionMatchJsonDto[];
}

export class AiModificationJsonDto {
  @IsInt()
  id: number;

  @IsString()
  type: string;

  @IsString()
  title: string;

  @IsString()
  desc: string;
}

export class CvContactJsonDto {
  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsString()
  email?: string | null;

  @IsOptional()
  @IsString()
  birthday?: string | null;

  @IsOptional()
  @IsString()
  address?: string | null;
}

export class CvExperienceJsonDto {
  @IsOptional()
  @IsString()
  company?: string | null;

  @IsOptional()
  @IsString()
  period?: string | null;

  @IsOptional()
  @IsString()
  role?: string | null;

  @IsArray()
  @IsString({ each: true })
  details: string[];
}

export class CvProjectJsonDto {
  @IsOptional()
  @IsString()
  name?: string | null;

  @IsOptional()
  @IsString()
  period?: string | null;

  @IsOptional()
  @IsString()
  role?: string | null;

  @IsArray()
  @IsString({ each: true })
  details: string[];
}

export class CvSkillJsonDto {
  @IsOptional()
  @IsString()
  name?: string | null;

  @IsOptional()
  @IsString()
  level?: string | null;
}

export class CvEducationJsonDto {
  @IsOptional()
  @IsString()
  period?: string | null;

  @IsOptional()
  @IsString()
  school?: string | null;

  @IsOptional()
  @IsString()
  degree?: string | null;

  @IsArray()
  @IsString({ each: true })
  details: string[];
}

export class CvCertificationJsonDto {
  @IsOptional()
  @IsString()
  name?: string | null;

  @IsOptional()
  @IsString()
  issuer?: string | null;

  @IsOptional()
  @IsString()
  year?: string | null;
}

export class CvActivityJsonDto {
  @IsOptional()
  @IsString()
  name?: string | null;

  @IsOptional()
  @IsString()
  period?: string | null;

  @IsOptional()
  @IsString()
  role?: string | null;

  @IsArray()
  @IsString({ each: true })
  details: string[];
}

export class CvReferenceJsonDto {
  @IsOptional()
  @IsString()
  name?: string | null;

  @IsOptional()
  @IsString()
  role?: string | null;

  @IsOptional()
  @IsString()
  phone?: string | null;
}

export class CvDataJsonDto {
  @IsString()
  fullName: string;

  @IsString()
  jobTitle: string;

  @IsOptional()
  @IsString()
  objective?: string | null;

  @IsObject()
  @ValidateNested()
  @Type(() => CvContactJsonDto)
  contact: CvContactJsonDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CvExperienceJsonDto)
  experiences: CvExperienceJsonDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CvProjectJsonDto)
  projects: CvProjectJsonDto[];

  @IsArray()
  @IsString({ each: true })
  hardSkills: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CvSkillJsonDto)
  computerSkills: CvSkillJsonDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CvSkillJsonDto)
  languages: CvSkillJsonDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CvEducationJsonDto)
  education: CvEducationJsonDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CvCertificationJsonDto)
  certifications: CvCertificationJsonDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CvActivityJsonDto)
  activities: CvActivityJsonDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CvReferenceJsonDto)
  references: CvReferenceJsonDto[];
}

export class SkillAnalysisJsonDto {
  @IsString()
  skill: string;

  @IsInt()
  @Min(0)
  @Max(100)
  user: number;

  @IsInt()
  @Min(0)
  @Max(100)
  required: number;
}

export class ImprovementSuggestionJsonDto {
  @IsString()
  title: string;

  @IsString()
  desc: string;

  @IsString()
  solution: string;

  @IsIn(['HIGH', 'MEDIUM', 'LOW'])
  priority: AnalysisPriorityJson;
}

export class ImprovementSuggestionsJsonDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImprovementSuggestionJsonDto)
  suggestions: ImprovementSuggestionJsonDto[];
}

export class ScoreDetailJsonDto {
  @IsIn([
    'TECHNICAL_SKILLS',
    'EXPERIENCE',
    'SOFT_SKILLS',
    'EDUCATION',
    'PROJECT_RELEVANCE',
  ])
  category: ScoreCategoryJson;

  @IsInt()
  @Min(0)
  @Max(100)
  score: number;

  @IsString()
  reason: string;
}

export class CvAnalysisResultJsonDto {
  @IsInt()
  @Min(0)
  @Max(100)
  matchScore: number;

  @IsString()
  summary: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScoreDetailJsonDto)
  scoringDetails: ScoreDetailJsonDto[];

  @IsArray()
  @IsString({ each: true })
  strengths: string[];

  @IsArray()
  @IsString({ each: true })
  weaknesses: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillAnalysisJsonDto)
  skillsAnalysis: SkillAnalysisJsonDto[];

  @IsArray()
  @IsString({ each: true })
  foundKeywords: string[];

  @IsArray()
  @IsString({ each: true })
  missingKeywords: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImprovementSuggestionJsonDto)
  improvementSuggestions: ImprovementSuggestionJsonDto[];
}

export class CvOptimizationResultJsonDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CvDataJsonDto)
  optimizedData: CvDataJsonDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AiModificationJsonDto)
  modifications: AiModificationJsonDto[];
}

export class ChatInterviewResponseJsonDto {
  @IsString()
  reply: string;

  @IsIn(['CONTINUE', 'TRANSITION', 'FINISH'])
  suggestedAction: 'CONTINUE' | 'TRANSITION' | 'FINISH';
}

export class SoftSkillsEvaluationJsonDto {
  @IsObject()
  @ValidateNested()
  @Type(() => MetricScoreJsonDto)
  problemSolving: MetricScoreJsonDto;

  @IsObject()
  @ValidateNested()
  @Type(() => MetricScoreJsonDto)
  clarity: MetricScoreJsonDto;

  @IsObject()
  @ValidateNested()
  @Type(() => MetricScoreJsonDto)
  confidence: MetricScoreJsonDto;

  @IsObject()
  @ValidateNested()
  @Type(() => MetricScoreJsonDto)
  relevance: MetricScoreJsonDto;
}

export class RawQuestionEvaluationJsonDto {
  @IsInt()
  @Min(1)
  questionIndex: number;

  @IsString()
  questionTitle: string;

  @IsString()
  feedback: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CriterionMatchJsonDto)
  criteriaMatches: CriterionMatchJsonDto[];
}

export class SubmitInterviewResultJsonDto {
  @IsObject()
  @ValidateNested()
  @Type(() => SoftSkillsEvaluationJsonDto)
  softSkillsEvaluation: SoftSkillsEvaluationJsonDto;

  @IsIn(['PASS', 'FAIL', 'CONSIDER'])
  recommendation: 'PASS' | 'FAIL' | 'CONSIDER';

  @IsString()
  summary: string;

  @IsArray()
  @IsString({ each: true })
  strengths: string[];

  @IsArray()
  @IsString({ each: true })
  weaknesses: string[];

  @IsArray()
  @IsString({ each: true })
  learningPath: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RawQuestionEvaluationJsonDto)
  questionEvaluations: RawQuestionEvaluationJsonDto[];
}
