import { Express } from 'express';
import routesV1 from './v1';

const setupRoutes = (app: Express): void => {
  app.use('/api/v1', routesV1);
};

export default setupRoutes;
