export type TokenPayload = {
  id: string;
  email: string;
  roles: string[];
  emailVerifyAt: Date;
  status: string;
};
