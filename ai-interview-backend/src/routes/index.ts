import { Express } from 'express';
import routesV1 from './v1';
import { apiLimiter } from '../middlewares/rate-limit.middleware';

const setupRoutes = (app: Express): void => {
  app.use('/api/v1', apiLimiter, routesV1);
};

export default setupRoutes;
