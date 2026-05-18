import { JobCategory } from '@prisma/client';
import { JobCategoryResponseDTO } from '../types/job-category.type';

export const toJobCategoryResponseDTO = (
  category: JobCategory & {
    parent?: JobCategory | null;
    children?: JobCategory[];
  }
): JobCategoryResponseDTO => {
  return {
    id: category.id,
    name: category.name,
    type: category.type,
    parentId: category.parentId,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    parent: category.parent ? toJobCategoryResponseDTO(category.parent) : undefined,
    children: category.children
      ? category.children.map((child) => toJobCategoryResponseDTO(child))
      : undefined,
  };
};
