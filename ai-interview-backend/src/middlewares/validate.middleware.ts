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
        const issues = error.issues || [];

        console.log('ZOD ERRORS:', issues);

        return res.status(400).json({
          status: 'fail',
          errors: issues.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
            received: err.received,
          })),
        });
      }

      return next(error);
    }
  };
};
