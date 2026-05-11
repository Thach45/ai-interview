import { Response } from 'express';

/**
 * Standardized API Response Helper
 * @param res Express Response object
 * @param statusCode HTTP Status Code
 * @param message Success or Error message
 * @param data Response data (optional)
 */
export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: any = null,
) => {
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
  });
};
