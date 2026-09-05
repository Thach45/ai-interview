import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { Prisma } from '@prisma/client';

type ClassConstructor<T extends object> = new (...args: any[]) => T;

const validationOptions: ValidatorOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
  validationError: { target: false, value: false },
};

function flattenValidationErrors(
  errors: ValidationError[],
  parentPath = '',
): string[] {
  return errors.flatMap((error) => {
    const path = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;
    const currentErrors = error.constraints
      ? Object.values(error.constraints).map((message) => `${path}: ${message}`)
      : [];

    return [
      ...currentErrors,
      ...flattenValidationErrors(error.children ?? [], path),
    ];
  });
}

export async function validateJsonb<T extends object>(
  dtoClass: ClassConstructor<T>,
  value: unknown,
  context: string,
): Promise<T> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${context} phải là một JSON object`);
  }

  const instance = plainToInstance(dtoClass, value);
  const errors = await validate(instance, validationOptions);

  if (errors.length > 0) {
    throw new Error(
      `${context} không đúng cấu trúc: ${flattenValidationErrors(errors).join('; ')}`,
    );
  }

  return instanceToPlain(instance) as T;
}

export function toPrismaJson(value: object): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}
