import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';
import { NotificationType } from '@prisma/client';
import { NotificationMode } from '../enums/notification.enum';

export class SendNotificationDto {
  @IsEnum(NotificationType, { message: 'Type phải là hợp lệ' })
  type: NotificationType;

  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @MinLength(1, { message: 'Tiêu đề không được để trống' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  @MinLength(1, { message: 'Nội dung không được để trống' })
  message: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsEnum(NotificationMode, { message: 'Mode phải là all hoặc individual' })
  mode: 'all' | 'individual';
}
