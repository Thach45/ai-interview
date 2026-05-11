import { z } from 'zod';
import { CategoryType } from '@prisma/client';

// Schema cho tạo mới danh mục
export const createJobCategorySchema = z.object({
  body: z
    .object({
      name: z.string().min(1, 'Tên danh mục không được để trống'),
      type: z.nativeEnum(CategoryType, {
        error: () => 'Type phải là GROUP, INDUSTRY hoặc POSITION',
      }),
      parentId: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      // GROUP không được có parentId
      if (data.type === CategoryType.GROUP && data.parentId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Nhóm nghề (GROUP) không được có danh mục cha',
          path: ['parentId'],
        });
      }
      // INDUSTRY và POSITION bắt buộc có parentId
      if (
        (data.type === CategoryType.INDUSTRY || data.type === CategoryType.POSITION) &&
        !data.parentId
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${data.type === CategoryType.INDUSTRY ? 'Ngành (INDUSTRY)' : 'Vị trí (POSITION)'} phải có danh mục cha`,
          path: ['parentId'],
        });
      }
    }),
});

// Schema cho cập nhật danh mục (chỉ cho phép sửa name)
export const updateJobCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID không hợp lệ'),
  }),
  body: z.object({
    name: z.string().min(1, 'Tên danh mục không được để trống'),
  }),
});
