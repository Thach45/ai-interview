import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { TokenPayload } from '../types/jwt.type';

dotenv.config();

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as any,
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as any,
  });
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string,
    ) as TokenPayload;
  } catch {
    return null;
  }
};
