import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class OptimizeCvDto {
  @IsUUID()
  @IsNotEmpty({ message: 'analysisId không được để trống' })
  analysisId: string;

  @IsOptional()
  @IsUUID()
  templateId?: string;
}

export class ExportPdfDto {
  @IsUUID()
  @IsNotEmpty({ message: 'analysisId không được để trống' })
  analysisId: string;

  @IsString()
  @IsNotEmpty({ message: 'Nội dung HTML không được để trống' })
  html: string;
}
