import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: (...args: any[]) => any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
