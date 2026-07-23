export type JobCategoryResponseDTO = {
  id: string;
  name: string;
  type: string;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  parent?: JobCategoryResponseDTO | null;
  children?: JobCategoryResponseDTO[];
};
