import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MinLength,
} from 'class-validator';
import { InterviewPersona } from '@prisma/client';

export class SynthesizeDto {
  @IsString()
  @IsNotEmpty({ message: 'Van ban khong duoc de trong' })
  @MinLength(1, { message: 'Van ban khong duoc de trong' })
  text: string;

  @IsOptional()
  @IsEnum(InterviewPersona, {
    message: 'Persona phai la PROFESSIONAL, FRIENDLY, STRICT hoac CHEERFUL',
  })
  persona?: InterviewPersona;
}
