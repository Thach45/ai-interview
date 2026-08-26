import { IsString, IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class AnalyzeCvWithTemplateDto {
  @IsUUID()
  @IsNotEmpty({ message: 'cvId không được để trống' })
  cvId: string;

  @IsUUID()
  @IsNotEmpty({ message: 'jobTemplateId không được để trống' })
  jobTemplateId: string;
}

export class AnalyzeCvWithExternalJobDto {
  @IsUUID()
  @IsNotEmpty({ message: 'cvId không được để trống' })
  cvId: string;

  @IsString()
  @IsNotEmpty({ message: 'Mô tả công việc không được để trống' })
  @MaxLength(15000, {
    message: 'Mô tả công việc không được vượt quá 15000 ký tự',
  })
  externalJobDescription: string;
}
