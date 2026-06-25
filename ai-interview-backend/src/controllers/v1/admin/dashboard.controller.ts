import { asyncHandler } from '../../../utils/asyncHandler';

class DashboardAdminController {
  getDashboardAdmin = asyncHandler(async (req, res) => {
    // TODO: Implement dashboard admin
    return res.status(200).json({ message: 'Dashboard admin' });
  });
}

export const dashboardAdminController = new DashboardAdminController();
