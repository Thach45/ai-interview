import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsEnum,
  IsUUID,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';
import {
  ExperienceLevel,
  InterviewPersona,
  InterviewLanguage,
} from '@prisma/client';

export class SetupInterviewDto {
  @IsUUID()
  cvId: string;

  @IsOptional()
  @IsUUID()
  jobTemplateId?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(3000)
  customJdText?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  jobTitle: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  companyName?: string;

  @IsEnum(ExperienceLevel)
  level: ExperienceLevel;

  @IsEnum(InterviewLanguage)
  language: InterviewLanguage;

  @IsEnum(InterviewPersona)
  persona: InterviewPersona;

  @IsNumber()
  @Min(5)
  @Max(60)
  duration: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  difficulty: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  focusSkills?: string[];
}

export class TtsDto {
  @IsString()
  @MinLength(1)
  text: string;
}
