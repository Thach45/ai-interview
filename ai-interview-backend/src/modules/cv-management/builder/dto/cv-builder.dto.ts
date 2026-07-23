import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class SaveCvDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @IsNotEmpty({ message: 'templateId không được để trống' })
  templateId: string;

  @IsString()
  @IsNotEmpty({ message: 'Title không được để trống' })
  @MinLength(1)
  title: string;

  @IsNotEmpty({ message: 'cvData không được để trống' })
  cvData: any;

  @IsString()
  @IsNotEmpty({ message: 'renderedHtml không được để trống' })
  renderedHtml: string;
}

export class ExportPdfDto {
  @IsOptional()
  @IsString()
  html?: string;
}
