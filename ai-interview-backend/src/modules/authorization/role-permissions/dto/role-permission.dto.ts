import { ArrayUnique, IsArray, IsUUID } from 'class-validator';

export class SyncRolePermissionsDto {
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  permissionIds: string[];
}
