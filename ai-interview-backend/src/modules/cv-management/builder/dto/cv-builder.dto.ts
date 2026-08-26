import { plainToInstance, Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CvDataJsonDto } from '../../../../common/validation/jsonb.dto';

const parseJsonObject = ({ value }: { value: unknown }) => {
  let parsed = value;

  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value);
    } catch {
      return value;
    }
  }

  return typeof parsed === 'object' && parsed !== null
    ? plainToInstance(CvDataJsonDto, parsed)
    : parsed;
};

export class SaveCvDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsUUID()
  @IsNotEmpty({ message: 'templateId không được để trống' })
  templateId: string;

  @IsString()
  @IsNotEmpty({ message: 'Title không được để trống' })
  @MinLength(1)
  title: string;

  @Transform(parseJsonObject)
  @IsObject({ message: 'cvData phải là một JSON object' })
  @ValidateNested()
  cvData: CvDataJsonDto;

  @IsString()
  @IsNotEmpty({ message: 'renderedHtml không được để trống' })
  renderedHtml: string;
}

export class ExportPdfDto {
  @IsOptional()
  @IsString()
  html?: string;
}
