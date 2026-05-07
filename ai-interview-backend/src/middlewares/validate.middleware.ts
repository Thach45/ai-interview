import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { BadRequestException } from '../exceptions';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Zod v3/v4 uses 'issues' or 'errors' property
        // We'll use issues as it's the standard for Zod 3.x+
        const issues = (error as any).issues || (error as any).errors || [];
        const errorMessage = issues.map((err: any) => err.message).join(', ');
        return next(new BadRequestException(errorMessage));
      }
      return next(error);
    }
  };
};
