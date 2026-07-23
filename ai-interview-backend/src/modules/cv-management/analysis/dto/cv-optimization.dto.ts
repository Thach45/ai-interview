import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class OptimizeCvDto {
  @IsString()
  @IsNotEmpty({ message: 'analysisId không được để trống' })
  analysisId: string;

  @IsOptional()
  @IsString()
  templateId?: string;
}

export class ExportPdfDto {
  @IsString()
  @IsNotEmpty({ message: 'analysisId không được để trống' })
  analysisId: string;

  @IsString()
  @IsNotEmpty({ message: 'Nội dung HTML không được để trống' })
  html: string;
}
