import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as any;

      req.body = parsed.body || req.body;
      req.query = parsed.query || req.query;
      req.params = parsed.params || req.params;
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
