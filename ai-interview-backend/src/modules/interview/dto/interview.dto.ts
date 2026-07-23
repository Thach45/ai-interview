import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsEnum,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';
import {
  InterviewMode,
  ExperienceLevel,
  InterviewPersona,
  InterviewLanguage,
} from '@prisma/client';

export class SetupInterviewDto {
  @IsString()
  cvId: string;

  @IsOptional()
  @IsString()
  jobTemplateId?: string;

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

  @IsEnum(InterviewMode)
  mode: InterviewMode;

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

export class ChatMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  message: string;
}

export class TtsDto {
  @IsString()
  @MinLength(1)
  text: string;
}
