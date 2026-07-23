import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UploadCvDto {
  @IsOptional()
  @IsString()
  title?: string;
}

export class DeleteCvResponseDto {
  message: string;
}
